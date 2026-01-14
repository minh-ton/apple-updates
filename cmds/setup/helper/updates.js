const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ChannelType, ChannelSelectMenuBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const firebase = require("firebase-admin");

const db = firebase.firestore();

require("./misc/embeds.js")();

// *Update Jan 14, 2026*:
// Thanks to vibe-coding, I can finally pull this
// separate public/beta and config migration system
// after procrastinating for years. I don't like the 
// sophistication that AI have done here, but at least
// it gets the job done as I've been way too lazy to do
// all of this myself.

// Legacy databases (for backward compatibility)
const ios_database = db.collection('discord').doc('ios');
const ipados_database = db.collection('discord').doc('ipados');
const watchos_database = db.collection('discord').doc('watchos');
const tvos_database = db.collection('discord').doc('tvos');
const audioos_database = db.collection('discord').doc('audioos');
const macos_database = db.collection('discord').doc('macos');

// New beta databases
const ios_beta_database = db.collection('discord').doc('ios_beta');
const ipados_beta_database = db.collection('discord').doc('ipados_beta');
const watchos_beta_database = db.collection('discord').doc('watchos_beta');
const tvos_beta_database = db.collection('discord').doc('tvos_beta');
const audioos_beta_database = db.collection('discord').doc('audioos_beta');
const macos_beta_database = db.collection('discord').doc('macos_beta');

// New public databases
const ios_public_database = db.collection('discord').doc('ios_public');
const ipados_public_database = db.collection('discord').doc('ipados_public');
const watchos_public_database = db.collection('discord').doc('watchos_public');
const tvos_public_database = db.collection('discord').doc('tvos_public');
const audioos_public_database = db.collection('discord').doc('audioos_public');
const macos_public_database = db.collection('discord').doc('macos_public');

// Special databases (no beta/public separation)
const pkg_database = db.collection('discord').doc('pkg');
const bot_database = db.collection('discord').doc('bot');

// Database mappings
const os_databases = {
	'ios': ios_database,
	'ipados': ipados_database,
	'watchos': watchos_database,
	'tvos': tvos_database,
	'audioos': audioos_database,
	'macos': macos_database,
	'ios_beta': ios_beta_database,
	'ipados_beta': ipados_beta_database,
	'watchos_beta': watchos_beta_database,
	'tvos_beta': tvos_beta_database,
	'audioos_beta': audioos_beta_database,
	'macos_beta': macos_beta_database,
	'ios_public': ios_public_database,
	'ipados_public': ipados_public_database,
	'watchos_public': watchos_public_database,
	'tvos_public': tvos_public_database,
	'audioos_public': audioos_public_database,
	'macos_public': macos_public_database,
	'pkg': pkg_database,
	'bot': bot_database
};

const os_options = [
	{ label: "iOS Updates (Beta)", value: "ios_beta" },
	{ label: "iOS Updates (Public)", value: "ios_public" },
	{ label: "iPadOS Updates (Beta)", value: "ipados_beta" },
	{ label: "iPadOS Updates (Public)", value: "ipados_public" },
	{ label: "watchOS Updates (Beta)", value: "watchos_beta" },
	{ label: "watchOS Updates (Public)", value: "watchos_public" },
	{ label: "macOS Updates (Beta)", value: "macos_beta" },
	{ label: "macOS Updates (Public)", value: "macos_public" },
	{ label: "tvOS Updates (Beta)", value: "tvos_beta" },
	{ label: "tvOS Updates (Public)", value: "tvos_public" },
	{ label: "HomePod Software Updates (Beta)", value: "audioos_beta" },
	{ label: "HomePod Software Updates (Public)", value: "audioos_public" },
	{ label: "macOS Installer Package Releases", value: "pkg" },
	{ label: "Bot Announcements", value: "bot" },
];

const os_value_to_name = {
	ios_beta: "iOS Updates (Beta)",
	ios_public: "iOS Updates (Public)",
	ipados_beta: "iPadOS Updates (Beta)",
	ipados_public: "iPadOS Updates (Public)",
	watchos_beta: "watchOS Updates (Beta)",
	watchos_public: "watchOS Updates (Public)",
	macos_beta: "macOS Updates (Beta)",
	macos_public: "macOS Updates (Public)",
	tvos_beta: "tvOS Updates (Beta)",
	tvos_public: "tvOS Updates (Public)",
	audioos_beta: "HomePod Software Updates (Beta)",
	audioos_public: "HomePod Software Updates (Public)",
	pkg: "macOS Installer Package Releases",
	bot: "Bot Announcements",
};

async function get_existing_setup(guild_id) {
	const configuration = [];
	const legacy_guilds = []; // Track which legacy docs have this guild (for migration)
	
	const os_docs = [
		{ name: "ios", full: "iOS Updates (All Releases)", is_legacy: true },
		{ name: "ipados", full: "iPadOS Updates (All Releases)", is_legacy: true },
		{ name: "watchos", full: "watchOS Updates (All Releases)", is_legacy: true },
		{ name: "tvos", full: "tvOS Updates (All Releases)", is_legacy: true },
		{ name: "audioos", full: "HomePod Software Updates (All Releases)", is_legacy: true },
		{ name: "macos", full: "macOS Updates (All Releases)", is_legacy: true },
		{ name: "ios_beta", full: "iOS Updates (Beta)", is_legacy: false },
		{ name: "ipados_beta", full: "iPadOS Updates (Beta)", is_legacy: false },
		{ name: "watchos_beta", full: "watchOS Updates (Beta)", is_legacy: false },
		{ name: "tvos_beta", full: "tvOS Updates (Beta)", is_legacy: false },
		{ name: "audioos_beta", full: "HomePod Software Updates (Beta)", is_legacy: false },
		{ name: "macos_beta", full: "macOS Updates (Beta)", is_legacy: false },
		{ name: "ios_public", full: "iOS Updates (Public)", is_legacy: false },
		{ name: "ipados_public", full: "iPadOS Updates (Public)", is_legacy: false },
		{ name: "watchos_public", full: "watchOS Updates (Public)", is_legacy: false },
		{ name: "tvos_public", full: "tvOS Updates (Public)", is_legacy: false },
		{ name: "audioos_public", full: "HomePod Software Updates (Public)", is_legacy: false },
		{ name: "macos_public", full: "macOS Updates (Public)", is_legacy: false },
		{ name: "pkg", full: "macOS Installer Package Releases", is_legacy: false },
		{ name: "bot", full: "Bot Announcements", is_legacy: false }
	];

	for (let i in os_docs) {
		const set = await db.collection('discord').doc(os_docs[i].name).get();
		const dataset = set.data();
		if (dataset && dataset[guild_id] != undefined) {
			configuration.push(os_docs[i].full);
			if (os_docs[i].is_legacy) legacy_guilds.push(os_docs[i].name);
		}
	}

	return { configuration, legacy_guilds };
}

module.exports = function () {
	this.setup_updates = async function (interaction) {
		const custom_id_prefix = `setup_${interaction.id}`;

		const { configuration: existing_setup, legacy_guilds } = await get_existing_setup(interaction.guild.id);

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

		// Migration: Delete entries from legacy documents if they exist
		for (const legacy_os of legacy_guilds) {
			const legacy_db = os_databases[legacy_os];
			if (legacy_db) {
				await legacy_db.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });
			}
		}

		// Save to new beta/public databases
		const all_os_keys = [
			'ios_beta', 'ios_public',
			'ipados_beta', 'ipados_public',
			'watchos_beta', 'watchos_public',
			'macos_beta', 'macos_public',
			'tvos_beta', 'tvos_public',
			'audioos_beta', 'audioos_public',
			'pkg', 'bot'
		];

		for (const os_key of all_os_keys) {
			const database = os_databases[os_key];
			if (!database) continue;

			if (selected_os_values.includes(os_key)) {
				await database.update({ [`${selected_channel.guild.id}`]: `${selected_channel.id}` });
			} else {
				await database.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });
			}
		}

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