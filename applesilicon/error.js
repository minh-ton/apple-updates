// Send log and error messages to the log/error channel in a monitor discord server

const Discord = require('discord.js');
const config = require("../bootrom/config.json");
const error_reporter = new Discord.WebhookClient({ id: config.error_id, token: config.error_token });

require('./misc.js')();

module.exports = function () {
    this.send_error = function (message, location, process, task) {
        let time = getCurrentTime("Asia/Ho_Chi_Minh");
        const embed = new Discord.MessageEmbed()
            .setColor("#f52b32")
            .setDescription(`**Error message**:\n> ${message}`)
            .addField(`File`, location, true)
            .addField(`Process`, process, true)
            .addField(`Task`, task, true)
            .setFooter(time);
        error_reporter.send({ embeds: [embed] });
    };
}