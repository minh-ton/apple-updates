const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ChannelType, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const firebase = require("firebase-admin");
const uniqid = require('uniqid'); 

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

async function get_existing_setup(guildID) {
	const configuration = [];
	const os = [
		{ name: "ios", full: "iOS Updates" }, { name: "ipados", full: "iPadOS Updates" }, 
		{ name: "watchos", full: "watchOS Updates" }, { name: "tvos", full: "tvOS Updates" }, 
		{ name: "audioos", full: "audioOS Updates" }, { name: "macos", full: "macOS Updates" }, 
		{ name: "pkg", full: "macOS InstallAssistant.pkg Links"}, { name: "bot", full: "Bot Updates"}
	];

	for (let i in os) {
		const set = await db.collection('discord').doc(os[i].name).get();
		const dataset = set.data();
		if (dataset[guildID] != undefined) configuration.push(os[i].full);
	}

	return configuration;
}

module.exports = function () {
	this.setup_updates = async function (interaction) {	
		const sessionIDs = [];

		const channels_list = interaction.member.guild.channels.cache.filter(ch => ch.type === ChannelType.GuildText || ch.type === ChannelType.GuildNews);
		const channel_components = [];

		const existing_setup = await get_existing_setup(interaction.member.guild.id);

		channels_list.forEach(channel => { 
			if (global.bot.channels.cache.get(channel.parentId) != undefined) {
				channel_components.push({ "label": `#${channel.name}`, "value": channel.id, "description": global.bot.channels.cache.get(channel.parentId).name.toLowerCase() }); 
			} else {
				channel_components.push({ "label": `#${channel.name}`, "value": channel.id }); 
			}
		});

		const channel_multiple_components = [];

		while (channel_components.length) {
			let sessionID = uniqid(); sessionIDs.push(sessionID);
			channel_multiple_components.push(new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId(sessionID).setPlaceholder('No channel selected').addOptions(channel_components.splice(0, 20))));
		}

		await interaction.editReply({ embeds: [updates_part_1(existing_setup)], components: channel_multiple_components });

		const channel_filter = ch => {
			ch.deferUpdate();
			return ch.member.id == interaction.member.id && sessionIDs.includes(ch.customId);
		}

		const response = await interaction.channel.awaitMessageComponent({ 
			filter: channel_filter, 
			max: 1, 
			componentType: ComponentType.StringSelect, 
			time: 60000 
		}).catch(err => { return; });
		if (response == undefined) return interaction.editReply(error_embed("You did not select a channel within 1 minute so the command was cancelled."));

		const selected_channel = global.bot.channels.cache.get(response.values[0]);
		
		const warning_embed = new EmbedBuilder().setDescription("**PLEASE WAIT FOR THE REACTIONS TO FULLY-LOAD BEFORE REACTING TO THE MESSAGE OR YOUR OPTIONS WON'T BE RECORDED.**").setColor("#f07800");

		const msg = await interaction.editReply({ embeds: [updates_part_2(selected_channel, "Your selected options will appear here"), warning_embed], components: [] });

	    await msg.react("852824816092315678");
	    await msg.react("852824860089516033");
	    await msg.react("852824628921499688");
	    await msg.react("852824690166333440");
	    await msg.react("852826560725778442");
	    await msg.react("852826607286878228");
	    await msg.react("852824497202659348");
	    await msg.react("852825269705113610");

	    await interaction.editReply({ embeds: [updates_part_2(selected_channel, "Your selected options will appear here")], components: [] });

	    const filter = (reaction, user) => {
        	return user.id == interaction.member.id;
    	}

	    const collector = msg.createReactionCollector({ filter, time: 60000, dispose: true });

	    let options = [];

	    collector.on("collect", (reaction, user) => {
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

	        interaction.editReply({ embeds: [updates_part_2(selected_channel, options.join(", "))] });
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

	        if (options.length > 0) interaction.editReply({ embeds: [updates_part_2(selected_channel, options.join(", "))] });
	        else interaction.editReply({ embeds: [updates_part_2(selected_channel, "Your selected options will appear here")] });
	    });

	    collector.on('end', async collected => {
	        await msg.reactions.removeAll().catch();
	        if (options.length < 1) return interaction.editReply(error_embed("You did not react to the message within 1 minute so the command was cancelled."));

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

	        const button = new ActionRowBuilder().addComponents(
	            new ButtonBuilder()
	                .setURL("https://discord.gg/ktHmcbpMNU")
	                .setLabel('Join support server')
	                .setStyle(ButtonStyle.Link));
	       	const tip_embed = new EmbedBuilder().setDescription(`**Helpful Tip: If you want to be pinged when a new update is available, you can set up a Notification Role.**\n- To set up a notification role, use \`/setup role add\`\n- To remove a notification role, use \`/setup role remove\`\n- To list your server's configured notification roles, use \`/setup role list\``).setColor("#f07800");
	        return interaction.editReply({ embeds: [updates_overall(`<#${selected_channel.id}>`, options.join(", ")), tip_embed], components: [button] });
	    });
	}
}