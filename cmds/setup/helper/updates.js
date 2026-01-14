const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ChannelType, ChannelSelectMenuBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
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

const os_options = [
	{ label: "iOS Updates", value: "ios" },
	{ label: "iPadOS Updates", value: "ipados" },
	{ label: "watchOS Updates", value: "watchos" },
	{ label: "macOS Updates", value: "macos" },
	{ label: "tvOS Updates", value: "tvos" },
	{ label: "audioOS Updates", value: "audioos" },
	{ label: "macOS InstallAssistant.pkg Links", value: "pkg" },
	{ label: "Bot Announcements", value: "bot" },
];

const os_value_to_name = {
	ios: "iOS Updates",
	ipados: "iPadOS Updates",
	watchos: "watchOS Updates",
	macos: "macOS Updates",
	tvos: "tvOS Updates",
	audioos: "audioOS Updates",
	pkg: "macOS InstallAssistant.pkg Links",
	bot: "Bot Updates",
};

async function get_existing_setup(guild_id) {
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
		if (dataset[guild_id] != undefined) configuration.push(os[i].full);
	}

	return configuration;
}

module.exports = function () {
	this.setup_updates = async function (interaction) {
		const custom_id_prefix = `setup_${interaction.id}`;

		const existing_setup = await get_existing_setup(interaction.guild.id);

		// Part 1: Channel selection
		const channel_select = new ActionRowBuilder().addComponents(
			new ChannelSelectMenuBuilder()
				.setCustomId(`${custom_id_prefix}_channel`)
				.setPlaceholder('Select a channel')
				.setChannelTypes([ChannelType.GuildText, ChannelType.GuildAnnouncement])
		);

		await interaction.editReply({ embeds: [updates_part_1(existing_setup)], components: [channel_select] });

		const channel_filter = (i) => {
			return i.user.id === interaction.user.id && i.customId === `${custom_id_prefix}_channel`;
		};

		const channel_response = await interaction.channel.awaitMessageComponent({ 
			filter: channel_filter, 
			componentType: ComponentType.ChannelSelect, 
			time: 60000 
		}).catch(() => null);

		if (!channel_response) {
			return interaction.editReply(error_embed("You did not select a channel within 1 minute so the command was cancelled."));
		}

		await channel_response.deferUpdate();

		const selected_channel = channel_response.channels.first();

		// Part 2: OS selection
		const os_select = new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder()
				.setCustomId(`${custom_id_prefix}_os`)
				.setPlaceholder('Select the updates you want to receive')
				.setMinValues(1)
				.setMaxValues(os_options.length)
				.addOptions(os_options)
		);

		await interaction.editReply({ embeds: [updates_part_2(selected_channel)], components: [os_select] });

		const os_filter = (i) => {
			return i.user.id === interaction.user.id && i.customId === `${custom_id_prefix}_os`;
		};

		const os_response = await interaction.channel.awaitMessageComponent({ 
			filter: os_filter, 
			componentType: ComponentType.StringSelect, 
			time: 60000 
		}).catch(() => null);

		if (!os_response) {
			return interaction.editReply(error_embed("You did not select any updates within 1 minute so the command was cancelled."));
		}

		await os_response.deferUpdate();

		const selected_os_values = os_response.values;
		const selected_os_names = selected_os_values.map(v => os_value_to_name[v]);

		// Save to database
		if (selected_os_values.includes("bot")) await bot_database.update({ [`${selected_channel.guild.id}`]: `${selected_channel.id}` });
		else await bot_database.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });

		if (selected_os_values.includes("ios")) await ios_database.update({ [`${selected_channel.guild.id}`]: `${selected_channel.id}` });
		else await ios_database.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });

		if (selected_os_values.includes("ipados")) await ipados_database.update({ [`${selected_channel.guild.id}`]: `${selected_channel.id}` });
		else await ipados_database.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });

		if (selected_os_values.includes("watchos")) await watchos_database.update({ [`${selected_channel.guild.id}`]: `${selected_channel.id}` });
		else await watchos_database.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });

		if (selected_os_values.includes("audioos")) await audioos_database.update({ [`${selected_channel.guild.id}`]: `${selected_channel.id}` }); 
		else await audioos_database.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });

		if (selected_os_values.includes("macos")) await macos_database.update({ [`${selected_channel.guild.id}`]: `${selected_channel.id}` }); 
		else await macos_database.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });

		if (selected_os_values.includes("tvos")) await tvos_database.update({ [`${selected_channel.guild.id}`]: `${selected_channel.id}` });
		else await tvos_database.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });

		if (selected_os_values.includes("pkg")) await pkg_database.update({ [`${selected_channel.guild.id}`]: `${selected_channel.id}` }); 
		else await pkg_database.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });

		const button = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setURL("https://discord.gg/ktHmcbpMNU")
				.setLabel('Join support server')
				.setStyle(ButtonStyle.Link)
		);

		const tip_embed = new EmbedBuilder()
			.setDescription(`**Helpful Tip: If you want to be pinged when a new update is available, you can set up a Notification Role.**\n- To set up a notification role, use \`/setup role add\`\n- To remove a notification role, use \`/setup role remove\`\n- To list your server's configured notification roles, use \`/setup role list\``)
			.setColor("#f07800");

		return interaction.editReply({ 
			embeds: [updates_overall(`<#${selected_channel.id}>`, selected_os_names.join(", ")), tip_embed], 
			components: [button] 
		});
	}
}