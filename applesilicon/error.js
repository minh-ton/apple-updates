// Send log and error messages to the log/error channel in a monitor discord server

const Discord = require('discord.js');
const error_reporter = new Discord.WebhookClient({ id: process.env.error_id, token: process.env.error_token });

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