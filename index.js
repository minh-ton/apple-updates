// Created by Minh on May 19th, 2021

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

require('dotenv').config()

global.BETA_RELEASE = process.env.NODE_ENV != "production";
global.UPDATE_MODE = false;
global.SAVE_MODE = false;
global.CPU_USAGE = process.cpuUsage();

const { Client, Collection, GatewayIntentBits, Partials, Options } = require('discord.js');
const fs = require("fs");
const firebase = require("firebase-admin");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

var firebase_token = (BETA_RELEASE) ? process.env.firebase_beta : process.env.firebase;
var bot_token = (BETA_RELEASE) ? process.env.bot_beta_token : process.env.bot_token;

firebase.initializeApp({
    credential: firebase.credential.cert(JSON.parse(firebase_token))
});

require("./core/updates.js")();
require("./core/utils/error.js")();

global.bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Channel],
    sweepers: {
        messages: {
            interval: 300,
            lifetime: 180,
        },
    },
    makeCache: Options.cacheWithLimits({
        MessageManager: 50,
        PresenceManager: 0,
        GuildMemberManager: 0,
        ReactionManager: 50,
        GuildBanManager: 0,
        VoiceStateManager: 0,
        StageInstanceManager: 0,
        GuildScheduledEventManager: 0,
    }),
});
global.bot.login(bot_token);

global.bot.on("clientReady", async () => {
    if (global.bot.user.id == process.env.beta_id) console.log("[RUNNING BETA BOT INSTANCE]");
    console.log(`Logged in as ${global.bot.user.tag}!`);
    console.log(`Currently in ${global.bot.guilds.cache.size} servers!`);
    console.log('Bot has started!');
    global.bot.user.setActivity(`/help`);
    start_polling();
});

global.bot.commands = new Collection();
global.bot.cooldowns = new Collection();

const commands = fs.readdirSync('./cmds');
const command_collection = [];

for (const category of commands) {
    const cmd_files = fs.readdirSync(`./cmds/${category}`).filter(file => file.endsWith('.js'));
    for (const file of cmd_files) {
        const command = require(`./cmds/${category}/${file}`);
        global.bot.commands.set(command.name, command);
        if (category == "owner") continue;
        command_collection.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '10' }).setToken(bot_token);
(async () => {
    try {
        if (global.BETA_RELEASE) await rest.put(Routes.applicationGuildCommands(process.env.beta_id, process.env.server_id), { body: command_collection });
        else await rest.put(Routes.applicationCommands(process.env.client_id), { body: command_collection });
    } catch (error) {
        console.error(error);
    }
})();

global.bot.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    if (!interaction.guildId) return interaction.reply(error_alert(`I am unable to run this command in a DM.`));

    // Get command
    const cmd = global.bot.commands.get(interaction.commandName);
    if (!cmd) return;

    await interaction.deferReply({ ephemeral: (cmd.ephemeral != undefined) ? cmd.ephemeral : true });

    // Command cooldowns
    if (interaction.member.id != process.env.owner_id) {
        const { cooldowns } = global.bot;
        if (!cooldowns.has(cmd.name)) cooldowns.set(cmd.name, new Collection());
        const now = Date.now(), timestamps = cooldowns.get(cmd.name), amount = (cmd.cooldown || 4) * 1000;
        if (timestamps.has(interaction.member.id)) {
            const exp_time = timestamps.get(interaction.member.id) + amount;
            if (now < exp_time) {
                const remaining = (exp_time - now) / 1000;
                return interaction.editReply(error_alert(`I need to rest a little bit! Please wait **${remaining.toFixed(0)} more seconds** to use \`${cmd.name}\`!`));
            }
        }
        timestamps.set(interaction.member.id, now);
        setTimeout(() => timestamps.delete(interaction.member.id), amount);
    }

    // Execute command
    try {
        await cmd.execute(interaction);
    } catch (e) {
        console.error(e);
        await interaction.editReply(error_alert(`An unknown error occured while running \`${cmd.name}\`.`, e));
    }
});

global.bot.on("messageCreate", async message => {
    if (message.author.bot) return;
    if (message.mentions.everyone) return;
    if (message.channel.isDMBased()) return;

    // Bot prefix
    const prefixes = [`<@${global.bot.user.id}>`, `<@!${global.bot.user.id}>`];
    if (!message.mentions.has(global.bot.user)) return;
    if (!prefixes.includes(message.content.split(" ")[0])) return;

    // Run bot commands with @mention - Owner only
    let isBotOwner = message.author.id == process.env.owner_id;
    if (!isBotOwner) return;

    // Get commands
    const args = message.content.substring(message.content.indexOf(" ") + 1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = global.bot.commands.get(command);
    if (!cmd) return;

    // For use with eval, echo, bash, etc
    if (!["bash", "echo", "eval", "killall"].includes(cmd.name)) return;

    // Run commands
    try {
        cmd.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply(error_alert(error));
    }
});

setInterval(() => {
    const now = Date.now();
    global.bot.cooldowns.forEach((timestamps, commandName) => {
        timestamps.sweep((timestamp, userId) => { return (now - timestamp) > 300000 });
        if (timestamps.size === 0) global.bot.cooldowns.delete(commandName)
    });
}, 600000);
