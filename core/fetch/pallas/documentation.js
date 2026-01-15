// Get update documentation/changelog

const axios_instance = require('../axios.js');
const axios = require('axios');
const admzip = require('adm-zip');
const sanitizeHtml = require('sanitize-html');

require('../../utils/error.js')();

module.exports = function () {
    this.get_documentation = async function (asset_audience, hw_model, su_documentation_id, device, asset_type) {
        const response = await axios_instance.post('https://gdmf.apple.com/v2/assets', {
            AssetAudience: asset_audience,
            HWModelStr: hw_model,
            SUDocumentationID: su_documentation_id,
            ClientVersion: 2,
            DeviceName: device,
            AssetType: asset_type,
        }).catch(function (error) {
            log_error(error, "doc.js", `${device} changelog`, `getting changelog from apple server.`);
        });

        if (!response) {
            log_error("No data available", "doc.js", `${device} changelog`, `getting changelog from apple server.`);
            return "Release note is not available.";
        }

        var jwt_parts = response.data.split(".");
        let jwt_payload_buffer = new Buffer.from(jwt_parts[1], 'base64');
        let asset_data = JSON.parse(jwt_payload_buffer.toString('utf8'));

        if (!asset_data.Assets[0]) return "Release note is not available."

        var documentation_url = `${asset_data.Assets[0].__BaseURL}${asset_data.Assets[0].__RelativePath}`;

        const documentation_file = await axios.request({
            method: 'GET',
            url: documentation_url,
            responseType: 'arraybuffer',
            responseEncoding: null,
        }).catch(function (error) {
            return log_error(error, "doc.js", `extract changelog files`, `url: ${documentation_url}`);
        });

        if (!documentation_file) return log_error("No changelog file available", "doc.js", `${device} changelog`, `cannot download changelog zip file.`);

        var zip_archive = new admzip(documentation_file.data);
        var zip_entries = zip_archive.getEntries();

        let changelog_entry = zip_entries.map(function (entry) {
            if (entry.entryName == "AssetData/en.lproj/ReadMeSummary.html") return entry;
        }).filter(function (entry) { return entry; })[0];

        const sanitized_html = sanitizeHtml(zip_archive.readAsText(changelog_entry).replace(/(.|\n)*<body.*>/, '').replace(/<\/body(.|\n)*/g, ''), {
            allowedTags: ['li'],
        });

        var changelog_lines = sanitized_html.split("\r\n");

        for (var i = 0; i < changelog_lines.length; i++) changelog_lines[i] = changelog_lines[i].replace(/\t/g, "").replace(/<li>/g, "- ").replace(/<[^>]+>/g, '').replace(/\&amp;/g, '&').trimStart();

        let notes = changelog_lines.join('\n').replace(/\n\s*\n\s*\n/g, '\n\n');
        
        notes = notes.replace(/\s*\n*\s*For information on the security content[^\n]*(\n\s*https?:\/\/[^\s\n]*)?/gi, '').trim();

        if (notes.length > 4000) notes = notes.substring(0, 4000) + '...\n\n*[Release notes have been truncated]*';

        return notes;
    };
}
