const { EmbedBuilder } = require("discord.js");
const { PALLAS_CONFIGS } = require("../../core/constants.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

require('../../core/fetch/pallas/software.js')();
require('../../core/utils/error.js')();
require('../../core/utils/utils.js')();

if (!global.pallas_cache) global.pallas_cache = {};

module.exports = {
    name: 'latest_updates',
    command: 'latest_updates',
    category: 'Apple',
    cooldown: 60,
    ephemeral: false,
    description: 'Gets the latest public and beta versions for all Apple operating systems.',
    data: new SlashCommandBuilder().setName("latest_updates").setDescription("Gets the latest public and beta versions for all Apple operating systems."),
    async execute(interaction) {
        try {
            const processing = new EmbedBuilder().setColor(random_color());
            await interaction.editReply({ embeds: [processing.setDescription("Hang on, I'm fetching data from Apple...")] });

            const os_versions = {};
            
            for (const os in PALLAS_CONFIGS) {
                const all_configs = PALLAS_CONFIGS[os];
                
                if (all_configs.length === 0) continue;
                
                const max_target = Math.max(...all_configs.map(c => c.target_version));
                const configs = all_configs.filter(c => c.target_version === max_target);
                
                os_versions[os] = {};
                
                for (const config of configs) {
                    const cache_key = `${os}_${config.is_beta ? 'beta' : 'public'}_${config.target_version}`;
                    let updates;
                    
                    if (global.pallas_cache[cache_key]) {
                        updates = global.pallas_cache[cache_key];
                    } else {
                        updates = await get_pallas_updates(
                            os,
                            config.asset_audience,
                            config.device.build,
                            config.device.model,
                            config.device.prodtype,
                            config.device.version,
                            config.is_beta
                        );
                        
                        if (updates) global.pallas_cache[cache_key] = updates;
                    }
                    
                    if (!updates || updates.length === 0) continue;
                    
                    let latest_update = updates[0];
                    for (const update of updates) {
                        if (compare_versions(update.os_version, latest_update.os_version) > 0) {
                            latest_update = update;
                        }
                    }
                    
                    const major = parse_version(latest_update.os_version).major;
                    const type = is_beta_build(latest_update.os_build) ? 'beta' : 'public';
                    
                    if (!os_versions[os][major]) os_versions[os][major] = { public: null, beta: null };
                    
                    if (!os_versions[os][major][type] || compare_versions(latest_update.os_version, os_versions[os][major][type].version) > 0) {
                        os_versions[os][major][type] = {
                            version: latest_update.os_version,
                            build: latest_update.os_build
                        };
                    }
                }
            }
            
            const embed = new EmbedBuilder()
                .setTitle('Latest Apple Operating System Updates')
                .setColor(random_color())
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();
            
            const os_order = ['ios', 'ipados', 'macos', 'watchos', 'tvos', 'audioos'];
            
            for (const os of os_order) {
                if (!os_versions[os] || Object.keys(os_versions[os]).length === 0) continue;
                
                const os_name = get_os_displayname(os);
                const major = Object.keys(os_versions[os])[0];
                
                let field_value = '';
                const public_version = os_versions[os][major].public;
                const beta_version = os_versions[os][major].beta;
                
                if (public_version) field_value += `${public_version.version} (Build ${public_version.build})\n`;
                if (beta_version) field_value += `${beta_version.version} Beta (Build ${beta_version.build})\n`;
                
                if (field_value) embed.addFields({ name: os_name, value: field_value.trim(), inline: true });
            }
            
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            return interaction.editReply(error_alert("Ugh, an unknown error occurred.", error));
        }
    },
};
