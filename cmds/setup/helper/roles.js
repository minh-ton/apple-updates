const { ActionRowBuilder, StringSelectMenuBuilder, RoleSelectMenuBuilder, ComponentType } = require('discord.js');
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
    bot: "Bot Announcements",
    pkg: "macOS InstallAssistant.pkg Links",
};
 
const database = db.collection('discord').doc('roles').collection('servers');

module.exports = function () {
	this.setup_roles = async function (interaction) {
		const custom_id_prefix = `setup_roles_${interaction.id}`;
		const option = interaction.options.getString('option');

		if (option.includes("add")) {
			// Part 1: OS selection
			const os_components = [];
			for (let os in os_updates) {
				os_components.push({ label: os_updates[os], value: os });
			}

			const os_select = new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder()
					.setCustomId(`${custom_id_prefix}_os`)
					.setPlaceholder('Select an update type')
					.addOptions(os_components)
			);

			await interaction.editReply({ embeds: [roles_part_1()], components: [os_select] });

			const os_filter = (i) => {
				return i.user.id === interaction.user.id && i.customId === `${custom_id_prefix}_os`;
			};

			const os_response = await interaction.channel.awaitMessageComponent({ 
				filter: os_filter, 
				componentType: ComponentType.StringSelect, 
				time: 60000 
			}).catch(() => null);

			if (!os_response) {
				return interaction.editReply(error_embed("You did not select an update name within 1 minute so the command was cancelled."));
			}

			await os_response.deferUpdate();

			const selected_os = os_response.values[0];

			// Part 2: Role selection
			const role_select = new ActionRowBuilder().addComponents(
				new RoleSelectMenuBuilder()
					.setCustomId(`${custom_id_prefix}_role`)
					.setPlaceholder('Select a role to ping')
			);

			await interaction.editReply({ embeds: [roles_part_2(os_updates[selected_os].slice(0, -1))], components: [role_select] });

			const role_filter = (i) => {
				return i.user.id === interaction.user.id && i.customId === `${custom_id_prefix}_role`;
			};

			const role_response = await interaction.channel.awaitMessageComponent({ 
				filter: role_filter, 
				componentType: ComponentType.RoleSelect, 
				time: 60000 
			}).catch(() => null);

			if (!role_response) {
				return interaction.editReply(error_embed("You did not select a role within 1 minute so the command was cancelled."));
			}

			await role_response.deferUpdate();

			const selected_role = role_response.roles.first();

			// Save to database
			let roles_database = await database.doc(interaction.guild.id).get();
			let roles_data = roles_database.data();

			if (roles_data == undefined) {
				await database.doc(interaction.guild.id).set({
					[`${selected_os}`]: `${selected_role.id}`
				});
			} else {
				await database.doc(interaction.guild.id).update({
					[`${selected_os}`]: `${selected_role.id}`
				});
			}

			return interaction.editReply(roles_overall(`<@&${selected_role.id}>`, os_updates[selected_os].slice(0, -1), true));

		} else if (option.includes("remove")) {
			// Get existing roles configuration
			let roles = await database.doc(interaction.guild.id).get();
			let data = roles.data();

			if (!data || Object.keys(data).length < 1) {
				return interaction.editReply(error_embed("Your server has no notification roles configured!"));
			}

			const os_components = [];
			const arr = [];

			for (let os in data) {
				const role = interaction.guild.roles.cache.get(data[os]);
				const role_name = role ? role.name : "Unknown Role";
				arr.push(`**${os_updates[os]}**: <@&${data[os]}>`);
				os_components.push({ 
					label: os_updates[os], 
					value: os, 
					description: `@${role_name}` 
				});
			}

			const os_select = new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder()
					.setCustomId(`${custom_id_prefix}_os_remove`)
					.setPlaceholder('Select an update type to remove')
					.addOptions(os_components)
			);

			await interaction.editReply({ embeds: [roles_remove(arr)], components: [os_select] });

			const os_filter = (i) => {
				return i.user.id === interaction.user.id && i.customId === `${custom_id_prefix}_os_remove`;
			};

			const os_response = await interaction.channel.awaitMessageComponent({ 
				filter: os_filter, 
				componentType: ComponentType.StringSelect, 
				time: 60000 
			}).catch(() => null);

			if (!os_response) {
				return interaction.editReply(error_embed("You did not select an update name within 1 minute so the command was cancelled."));
			}

			await os_response.deferUpdate();

			const selected_os = os_response.values[0];
			const role_id = data[selected_os];
			const selected_role = interaction.guild.roles.cache.get(role_id);

			// Remove from database
			await database.doc(interaction.guild.id).update({
				[`${selected_os}`]: firebase.firestore.FieldValue.delete()
			});

			return interaction.editReply(roles_overall(`<@&${selected_role ? selected_role.id : role_id}>`, os_updates[selected_os].slice(0, -1), false));

		} else if (option.includes("list")) {
			let roles = await database.doc(interaction.guild.id).get();
			let data = roles.data();

			if (!data || Object.keys(data).length < 1) {
				return interaction.editReply(error_embed("Your server has no notification roles configured!"));
			}

			const arr = [];
			for (let os in data) {
				arr.push(`**${os_updates[os]}**: <@&${data[os]}>`);
			}

			return interaction.editReply(roles_list(arr));
		}
	}
}