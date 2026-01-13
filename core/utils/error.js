// Send error messages to stderr in an organized format for debugging
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

require('./utils.js')();

module.exports = function () {
    this.log_error = function (message, location, process, task) {
        let time = get_current_time("Asia/Ho_Chi_Minh");
        let mode = (global.BETA_RELEASE) ? "BETA" : "PROD";
        const is_error = (message instanceof Error);
        const msg = is_error ? message.message : String(message);
        const stack = is_error && message.stack ? `\n${message.stack}` : '';
        const meta = `File: ${location} | Process: ${process} | Task: ${task} | Mode: ${mode} | Time: ${time}`;
        console.error(`[ERROR] ${meta}\n${msg}${stack}`);
    };

    this.error_alert = function (message, report) {
        const embeds = [];
        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                    .setURL("https://discord.gg/ktHmcbpMNU")
                    .setLabel('Join support server to ask for help')
                    .setStyle(ButtonStyle.Link));

        const alert = new EmbedBuilder().setDescription("<:apple_x:869128016494751755> " + message).setColor("#FF0000");
        embeds.push(alert);

        if (report != undefined) {
            const error_report = new EmbedBuilder()
                .setDescription(`Please report this incident in the support server:\n\`\`\`${report}\`\`\``)
                .setColor("#FF0000");
            embeds.push(error_report);
        }

        return { embeds: embeds, components: [button] };
    }
}