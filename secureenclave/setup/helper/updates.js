const Discord = require('discord.js');
const firebase = require("firebase-admin");

const db = firebase.firestore();

require("./misc/embeds.js")();

const ios_database = db.collection('discord').doc('ios');
const ipados_database = db.collection('discord').doc('ipados');
const watchos_database = db.collection('discord').doc('watchos');
const tvos_database = db.collection('discord').doc('tvos');
const audioos_database = db.collection('discord').doc('audioos');
const macos_database = db.collection('discord').doc('macos');
const pkg_database = db.collection('discord').doc('pkg');
const bot_database = db.collection('discord').doc('bot');

module.exports = function () {
	this.setup_updates = async function (message, args) {
		var msg = await message.channel.send(updates_part_1());

		const messageFilter = m => m.author.id == message.author.id;
	    const reply = await message.channel.awaitMessages({ messageFilter, max: 1, time: 180000 });

	    if (!reply.size) return message.channel.send(error_embed("You did not reply within 3 minutes so the command was cancelled."));
	    if (!reply.first().content.match(/^<#!?(\d+)>$/)) return message.channel.send(error_embed("I may not have the necessary permissions to fetch the channel or I was unable to read your message."));

	    let selected_channel = global.bot.channels.cache.get(reply.first().content.match(/^<#!?(\d+)>$/)[1]);
	    if (selected_channel == undefined) return message.channel.send(error_embed("I may not have the necessary permissions to fetch the channel or the chosen channel does not exist."));

	    await reply.first().delete();

	    await msg.edit(updates_part_2(selected_channel, "Your selected options will appear here"));

	    const warning_embed = new Discord.MessageEmbed().setDescription("**PLEASE WAIT FOR THE REACTIONS TO FULLY-LOAD BEFORE REACTING TO THE MESSAGE OR YOUR OPTIONS WON'T BE RECORDED.**").setColor("#f07800");
    	var warning = await message.channel.send({ embeds: [warning_embed] });

	    await msg.react("852824816092315678");
	    await msg.react("852824860089516033");
	    await msg.react("852824628921499688");
	    await msg.react("852824690166333440");
	    await msg.react("852826560725778442");
	    await msg.react("852826607286878228");
	    await msg.react("852824497202659348");
	    await msg.react("852825269705113610");

	    const filter = (reaction, user) => {
        	return user.id == message.author.id;
    	}

	    const collector = msg.createReactionCollector({ filter, time: 60000, dispose: true });

	    let options = [];

	    collector.on("collect", (reaction, user) => {
	    	if (warning != undefined) {
            	warning.delete();
            	warning = undefined;
        	}

        	switch (reaction.emoji.id) { 
	            case "852824816092315678":
	                options.push("iOS Updates")
	                break;
	            case "852824860089516033":
	                options.push("iPadOS Updates")
	                break;
	            case "852824628921499688":
	                options.push("watchOS Updates")
	                break;
	            case "852824690166333440":
	                options.push("audioOS Updates")
	                break;
	            case "852826560725778442":
	                options.push("tvOS Updates")
	                break;
	            case "852826607286878228":
	                options.push("macOS Updates")
	                break;
	            case "852824497202659348":
	                options.push("macOS InstallAssistant.pkg Links")
	                break;
	            case "852825269705113610":
	                options.push("Bot Updates")
	                break;
	            default:
	                break;
	        }

	        msg.edit(updates_part_2(selected_channel, options.join(", ")));
	    });

	    collector.on("remove", (reaction, user) => {
	        switch (reaction.emoji.id) {
	            case "852824816092315678":
	                if (options.includes("iOS Updates")) options.splice(options.indexOf("iOS Updates"), 1);
	                break;
	            case "852824860089516033":
	                if (options.includes("iPadOS Updates")) options.splice(options.indexOf("iPadOS Updates"), 1);
	                break;
	            case "852824628921499688":
	                if (options.includes("watchOS Updates")) options.splice(options.indexOf("watchOS Updates"), 1);
	                break;
	            case "852824690166333440":
	                if (options.includes("audioOS Updates")) options.splice(options.indexOf("audioOS Updates"), 1);
	                break;
	            case "852826560725778442":
	                if (options.includes("tvOS Updates")) options.splice(options.indexOf("tvOS Updates"), 1);
	                break;
	            case "852826607286878228":
	                if (options.includes("macOS Updates")) options.splice(options.indexOf("macOS Updates"), 1);
	                break;
	            case "852824497202659348":
	                if (options.includes("macOS InstallAssistant.pkg Links")) options.splice(options.indexOf("macOS InstallAssistant.pkg Links"), 1);
	                break;
	            case "852825269705113610":
	                if (options.includes("Bot Updates")) options.splice(options.indexOf("Bot Updates"), 1);
	                break;
	            default:
	                break;
	        }

	        (options.length > 0) ? msg.edit(updates_part_2(selected_channel, options.join(", "))) : msg.edit(updates_part_2(selected_channel, "Your selected options will appear here"));
	    });

	    collector.on('end', async collected => {
	        if (warning != undefined) warning.delete();
	        if (options.length < 1) return message.channel.send(error_embed("You did not react to the message within 1 minutes so the command was cancelled."));

	        if (options.includes("Bot Updates")) await bot_database.update({ [`${selected_channel.guild.id}`]: `${selected_channel.id}` });
	        else await bot_database.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });

	        if (options.includes("iOS Updates")) await ios_database.update({ [`${selected_channel.guild.id}`]: `${selected_channel.id}` });
	        else await ios_database.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });

	        if (options.includes("iPadOS Updates")) await ipados_database.update({ [`${selected_channel.guild.id}`]: `${selected_channel.id}` });
	        else await ipados_database.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });

	        if (options.includes("watchOS Updates")) await watchos_database.update({ [`${selected_channel.guild.id}`]: `${selected_channel.id}` });
	        else await watchos_database.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });

	        if (options.includes("audioOS Updates")) await audioos_database.update({ [`${selected_channel.guild.id}`]: `${selected_channel.id}` }); 
	        else await audioos_database.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });

	        if (options.includes("macOS Updates")) await macos_database.update({ [`${selected_channel.guild.id}`]: `${selected_channel.id}` }); 
	        else await macos_database.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });

	        if (options.includes("tvOS Updates")) await tvos_database.update({ [`${selected_channel.guild.id}`]: `${selected_channel.id}` });
	        else await tvos_database.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });

	        if (options.includes("macOS InstallAssistant.pkg Links")) await pkg_database.update({ [`${selected_channel.guild.id}`]: `${selected_channel.id}` }); 
	        else await pkg_database.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });

	        if (msg != undefined) msg.delete();
	        message.channel.send(updates_overall(`<#${selected_channel.id}>`, options.join(", ")));

	        const tip_embed = new Discord.MessageEmbed().setDescription(`**Helpful Tip: If you want to be pinged when a new update is available, you can set up a Notification Role.**\n- To set up a notification role, type \`apple!setup role add\`\n- To remove a notification role, type \`apple!setup role remove\`\n- To list your server's configured notification roles, type \`apple!setup role list\``).setColor("#f07800");
	        return message.channel.send({ embeds: [tip_embed] });
	    });
	}
}