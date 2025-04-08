// Send log and error messages to the log/error channel in a monitor discord server

const { EmbedBuilder, WebhookClient } = require('discord.js');
const error_reporter = new WebhookClient({ id: process.env.error_id, token: process.env.error_token });

require('./misc.js')();

module.exports = function () {
    this.send_error = function (message, location, process, task) {
        let time = getCurrentTime("Asia/Ho_Chi_Minh");
        let color = (global.BETA_RELEASE) ? "#f07800" : "#f52b32";
        const embed = new EmbedBuilder()
            .setColor(color)
            .setDescription(`**Error message**:\n> ${message}`)
            .addFields(
                { name: `File`, value: location, inline: true },
                { name: `Process`, value: process, inline: true },
                { name: `Task`, value: task, inline: true }
            )
            .setFooter({ text: time });
        error_reporter.send({ embeds: [embed] });
    };
}