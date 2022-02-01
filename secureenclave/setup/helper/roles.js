const Discord = require('discord.js');
const firebase = require("firebase-admin");

const db = firebase.firestore();

require("./misc/embeds.js")();

const os_updates = {
    ios: "iOS Updates",
    ipados: "iPadOS Updates",
    watchos: "watchOS Updates",
    macos: "macOS Updates",
    tvos: "tvOS Updates",
    audioos: "audioOS Updates",
    bot: `Bot Announcements`,
    pkg: "macOS InstallAssistant.pkg Links",
}
 
const database = db.collection('discord').doc('roles').collection('servers');

module.exports = function () {
	this.setup_roles = async function (interaction) {
		if (interaction.options.getString('option').includes("add")) {
			const os_components = [];
			for (let os in os_updates) { os_components.push({ "label": os_updates[os], "value": os}); }
			const os_input = new Discord.MessageActionRow().addComponents(new Discord.MessageSelectMenu().setCustomId("os").setPlaceholder('Nothing selected').addOptions(os_components));

			await interaction.editReply({ embeds: [roles_part_1()], components: [os_input] });

		} else if (interaction.options.getString('option').includes("remove")) {
			const os_components = [];
			let roles = await database.doc(interaction.member.guild.id).get();
			let data = roles.data();
			let arr = [];
			for (let os in data) {
				arr.push(`**${os_updates[os]}**: <@&${data[os]}>`);
				os_components.push({ "label": os_updates[os], "value": os, "description": "@" + interaction.member.guild.roles.cache.get(data[os]).name });
			}

        	if (arr.length < 1) return interaction.editReply(error_embed(`Your server has no notification roles configured!`));
			const os_input = new Discord.MessageActionRow().addComponents(new Discord.MessageSelectMenu().setCustomId("os").setPlaceholder('Nothing selected').addOptions(os_components));
        	
        	await interaction.editReply({ embeds: [roles_remove(arr)], components: [os_input] });

		} else if (interaction.options.getString('option').includes("list")) {
			let roles = await database.doc(interaction.member.guild.id).get();
			let data = roles.data();
			let arr = [];
			for (let os in data) arr.push(`**${os_updates[os]}**: <@&${data[os]}> (${os_updates[os]})`);
        	if (arr.length < 1) return interaction.editReply(error_embed(`Your server has no notification roles configured!`));
        	return interaction.editReply(roles_list(arr));
		}

		const filter = ch => {
			ch.deferUpdate();
			return ch.member.id == interaction.member.id;
		}

		const selected_os = (await interaction.channel.awaitMessageComponent({ filter: filter, max: 1, componentType: 'SELECT_MENU', time: 180000 })).values[0];
		
    	const role_components = [];
    	const role_list = interaction.member.guild.roles.cache.filter(ch => ch.name != '@everyone');

    	role_list.forEach(role => { role_components.push({ "label": role.name, "value": role.id }); });

    	const role_input = new Discord.MessageActionRow().addComponents(new Discord.MessageSelectMenu().setCustomId("roles").setPlaceholder('No role selected').addOptions(role_components));
    	var selected_role = undefined;

    	if (interaction.options.getString('option').includes("add")) {
	        await interaction.editReply({ embeds: [roles_part_2(os_updates[selected_os].slice(0, -1))], components: [role_input] });

	        selected_role = interaction.member.guild.roles.cache.get((await interaction.channel.awaitMessageComponent({ filter: filter, max: 1, componentType: 'SELECT_MENU', time: 180000 })).values[0]);

	        let roles_database = await database.doc(interaction.member.guild.id).get();
	        let roles_data = roles_database.data();

	        (roles_data == undefined) ? await database.doc(interaction.member.guild.id).set({
	            [`${selected_os}`]: `${selected_role.id}`
	        }) : await database.doc(interaction.member.guild.id).update({
	            [`${selected_os}`]: `${selected_role.id}`
	        });

	    } else {
	    	let doc = await database.doc(interaction.member.guild.id).get();
	        let data = doc.data();
	        let role_id = data[selected_os];

	        selected_role = interaction.member.guild.roles.cache.get(role_id);

	        await database.doc(interaction.member.guild.id).update({
	            [`${selected_os}`]: firebase.firestore.FieldValue.delete()
	        });
	    }

	    return interaction.editReply(roles_overall(`<@&${(selected_role) ? selected_role.id : "0100"}>`, os_updates[selected_os].slice(0, -1), interaction.options.getString('option').includes("add")));
	}
}