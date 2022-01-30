// Get database from remote

const firebase = require("firebase-admin");
const Discord = require('discord.js');

require('../../applesilicon/misc.js')();
require('../../applesilicon/embed.js')();

let db = firebase.firestore();

module.exports = {
    name: 'database',
    command: 'database <collection> <document>',
    category: 'Owner',
    usage: '`apple!database <collection> <document>`',
    description: '**[Owner Only]** Views database from remote.',
    async execute(message, args) {
        let isBotOwner = message.author.id == '589324103463338007';
        if (!isBotOwner) return message.channel.send(error_alert('Well you can\'t get my database without having my brain!'));

        try {
            const database_list = db.collection(args[0]).doc(args[1]);
            const data = await database_list.get();
            const data_key = data.data();

            var list = [];

            if (args[2] == "--human-readable") {
                for (let value in data_key) {
                    let server = global.bot.guilds.cache.get(value);
                    let channel = global.bot.channels.cache.get(data_key[value]);
                    if (server != undefined && channel != undefined) list.push(`${server.name} - #${channel.name}`);
                }
            } else {
                for (let value in data_key) {
                    list.push(`${value} - ${data_key[value]}`);
                }
            }

            if (list.length < 1) return message.channel.send(`Could not find "${args[0]}" collection or "${args[1]}" document.`);

            let embed = new Discord.MessageEmbed()
                .setColor(randomColor())
                .setTitle(`Data from remote database`)
                .setDescription(list.join('\n'))
                .addField(`Collection`, args[0], true)
                .addField(`Document`, args[1], true)
                .addField(`Items count`, list.length.toString(), true);
            message.channel.send({ embeds: [embed] });
        } catch (error) {
            return message.channel.send(error_alert(`An error happened!\n> ${error}`));
        }
    },
};
