// Fetch tvOS changelog from Apple's support page

const axios_instance = require('../axios.js');

require('../../utils/error.js')();

const CHANGELOG_URL = 'https://support.apple.com/en-us/106336';

module.exports = function () {
    this.get_tvos_documentation = async function (version) {
        try {
            const response = await axios_instance.get(CHANGELOG_URL).catch(function (error) {
                return log_error(error, "tvos_docs.js", `get_tvos_documentation`, `fetching tvOS changelog page`);
            });

            if (!response || !response.data) {
                log_error("No data available", "tvos_docs.js", `get_tvos_documentation`, `fetching tvOS changelog page`);
                return undefined;
            }

            const html = response.data;
            const changelog = parse_tvos_changelog(html, version);

            return changelog;
        } catch (error) {
            log_error(error, "tvos_docs.js", `get_tvos_documentation`, `parsing tvOS ${version} changelog`);
            return undefined;
        }
    };

    function parse_tvos_changelog(html, version) {
        const normalized_version = version.replace(/^tvOS\s*/i, '').trim();
        
        // Lol this is some fallback dumpster fire
        // because Apple might not update the support
        // page right after releasing a new tvOS version
        let changelog = try_parse_version(html, normalized_version);
        if (changelog) return changelog;
        
        const parts = normalized_version.split('.');
        
        if (parts.length === 3) {
            const minor_version = `${parts[0]}.${parts[1]}`;
            changelog = try_parse_version(html, minor_version);
            if (changelog) return changelog;
        }
        
        if (parts.length >= 2) {
            const major_version = parts[0];
            changelog = try_parse_version(html, major_version);
            if (changelog) return changelog;
        }
        
        return undefined;
    }

    function try_parse_version(html, version) {
        let version_pattern;
        if (version.endsWith('.0')) {
            const major_version = version.replace('.0', '');
            version_pattern = `${major_version}(\\.0)?`;
        } else if (!version.includes('.')) {
            version_pattern = `${version}(\\.0)?`;
        } else {
            version_pattern = version.replace(/\./g, '\\.');
        }
        
        const pattern = new RegExp(`<h2 class="gb-header">(What's new in )?tvOS ${version_pattern}(<|\\s|</h2>)`, 'i');

        const match = html.match(pattern);
        if (!match) return undefined;

        const version_index = match.index;
        const matched_header = match[0];
        const after_header = html.substring(version_index + matched_header.length);
        const next_header_match = after_header.match(/<h2 class="gb-header">/);
        const end_index = next_header_match ? version_index + matched_header.length + next_header_match.index : html.length;

        const changelog_section = html.substring(version_index, end_index);
        const changelog = parse_changelog_content(changelog_section);

        if (!changelog || changelog.trim().length === 0) return undefined;

        return changelog;
    }

    function parse_changelog_content(html) {
        let content = [];

        html = html.replace(/<div class="note gb-note">.*?<\/div>/gs, '');

        const first_paragraph_match = html.match(/<h2[^>]*>.*?<\/h2>\s*<p class="gb-paragraph">(?!<b>)(.*?)<\/p>/s);
        if (first_paragraph_match) {
            const text = clean_html(first_paragraph_match[1]);
            if (text && !text.startsWith('<a href=')) {
                content.push(text);
            }
        }

        // We don't need the detail sections since other 
        // changelogs are requested using the *Short SUDocumentationID
        /*
        const section_regex = /<p class="gb-paragraph">(?:<b>)?(.*?)(?:<\/b>)?<\/p>\s*(?:<ul class="list gb-list">(.*?)<\/ul>)?/gs;
        let section_match;
        
        while ((section_match = section_regex.exec(html)) !== null) {
            const section_title = clean_html(section_match[1]);
            const list_content = section_match[2];
            
            if (!section_match[0].includes('<b>') && !list_content) continue;
            
            content.push(`\n${section_title}`);
            
            if (list_content) {
                const list_item_regex = /<li class="gb-list_item"><p class="gb-paragraph">(.*?)<\/p><\/li>/gs;
                let list_item_match;
                
                while ((list_item_match = list_item_regex.exec(list_content)) !== null) {
                    const item_text = clean_html(list_item_match[1]);
                    content.push(`- ${item_text}`);
                }
            }
        } */

        let changelog = content.join('\n');
        
        if (changelog.length > 4000) changelog = changelog.substring(0, 4000) + '...\n\n*[Release notes have been truncated]*';

        return changelog;
    }

    function clean_html(text) {
        return text
            .replace(/<sup>.*?<\/sup>/g, '')      // Remove sup tags and footnote numbers
            .replace(/<a[^>]*>(.*?)<\/a>/g, '$1') // Remove links but keep text
            .replace(/<[^>]*>/g, '')              // Remove all other HTML tags
            .replace(/&nbsp;/g, ' ')              // Replace non-breaking spaces
            .replace(/&rsquo;/g, "'")             // Replace right single quote
            .replace(/&lsquo;/g, "'")             // Replace left single quote
            .replace(/&rdquo;/g, '"')             // Replace right double quote
            .replace(/&ldquo;/g, '"')             // Replace left double quote
            .replace(/&gt;/g, '>')                // Replace greater than
            .replace(/&lt;/g, '<')                // Replace less than
            .replace(/&amp;/g, '&')               // Replace ampersand (do this last)
            .replace(/\s+/g, ' ')                 // Normalize whitespace
            .trim();
    }
};