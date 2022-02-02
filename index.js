// Created by Minh on May 19th, 2021

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

global.BETA_RELEASE = false;
global.UPDATE_MODE = false;
global.SAVE_MODE = false;
global.BOT_VERSION = "3.0.1";
global.BOT_UPDATED = "February 2nd, 2022"

const Discord = require('discord.js');
const fs = require("fs");
const firebase = require("firebase-admin");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

firebase.initializeApp({
    credential: firebase.credential.cert(JSON.parse(process.env.firebase))
});

require("./applesilicon/updates.js")();
require("./applesilicon/embed.js")();

global.bot = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS], partials: [ 'CHANNEL' ] });
global.bot.login(process.env.bot_token);

// ============= DISCORD BOT ============

global.bot.on("ready", async () => {
    if (global.bot.user.id == process.env.beta_id) console.log("[RUNNING BETA BOT INSTANCE]");
    console.log(`Logged in as ${global.bot.user.tag}!`);
    console.log(`Currently in ${global.bot.guilds.cache.size} servers!`);
    console.log('Bot has started!');
    global.bot.user.setActivity(`/help`, { type: "PLAYING" });
});

global.bot.commands = new Discord.Collection();
global.bot.cooldowns = new Discord.Collection();

const commands = fs.readdirSync('./secureenclave');
const command_collection = [];

for (const category of commands) {
    const cmd_files = fs.readdirSync(`./secureenclave/${category}`).filter(file => file.endsWith('.js'));
    for (const file of cmd_files) {
        const command = require(`./secureenclave/${category}/${file}`);
        global.bot.commands.set(command.name, command);
        if (category == "owner") continue;
        command_collection.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '9' }).setToken(process.env.bot_token);
(async() => {
    try { 
        if (global.BETA_RELEASE) await rest.put(Routes.applicationGuildCommands(process.env.client_id, process.env.server_id), { body: command_collection });
        else await rest.put(Routes.applicationCommands(process.env.client_id), { body: command_collection });
    } catch (error) {
        console.error(error);
    }
})();

global.bot.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    // Get command
    const cmd = global.bot.commands.get(interaction.commandName);
    if (!cmd) return;

    // Command cooldowns
    if (interaction.member.id != process.env.owner_id) {
        const { cooldowns } = global.bot;
        if (!cooldowns.has(cmd.name)) cooldowns.set(cmd.name, new Discord.Collection());
        const now = Date.now(), timestamps = cooldowns.get(cmd.name), amount = (cmd.cooldown || 4) * 1000;
        if (timestamps.has(interaction.member.id)) {
            const exp_time = timestamps.get(interaction.member.id) + amount;
            if (now < exp_time) {
                const remaining = (exp_time - now) / 1000;
                return interaction.reply(error_alert(`I need to rest a little bit! Please wait **${remaining.toFixed(1)} more seconds** to use \`${cmd.name}\`!`));
            }
        }
        timestamps.set(interaction.member.id, now);
        setTimeout(() => timestamps.delete(interaction.member.id), amount);
    }

    // Execute command
    try {
        await interaction.deferReply();
        await cmd.execute(interaction);
    } catch (e) {
        console.error(e);
        await (error_alert(`An unknown error occured while running \`${cmd.name}\``));
    }
});

global.bot.on("messageCreate", async message => {
    // Bot prefix
    if (!message.content.startsWith("apple!")) return;

    // Deprecation notice
    if (message.channel.type != "DM") return message.channel.send(deprecation_notice());

    // Run bot commands in DM - Owner only
    // For use with eval, echo, bash, etc
    let isBotOwner = message.author.id == process.env.owner_id;
    if (!isBotOwner) return;

    // Get commands
    const args = message.content.slice(6).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = global.bot.commands.get(command);
    if (!cmd) return;    

    // Run commands
    try {
        cmd.execute(message, args);
    } catch (error) {
        console.log(error);
        message.reply(error_alert(error));
    }
});

// ============= UPDATES FETCH =============

fetch_gdmf(true, true, true, true, true, true);
fetch_xml();

setInterval(function () {
    fetch_gdmf(true, true, true, true, true, true);
    fetch_xml();
}, 60000);
