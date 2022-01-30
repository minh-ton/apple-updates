// Created by Minh on May 19th, 2021

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

global.BETA_RELEASE = false;
global.UPDATE_MODE = false;
global.BOT_VERSION = "2.6.0";
global.BOT_UPDATED = "January 30th, 2022"

const Discord = require('discord.js');
const fs = require("fs");
const firebase = require("firebase-admin");

firebase.initializeApp({
    credential: firebase.credential.cert(JSON.parse(process.env.firebase))
});

require("./applesilicon/updates.js")();
require("./applesilicon/embed.js")();

global.bot = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
global.bot.login(process.env.bot_token);

// ============= DISCORD BOT ============

global.bot.on("ready", async () => {
    if (global.BETA_RELEASE) console.log("[RUNNING BETA BOT INSTANCE]");
    console.log(`Logged in as ${global.bot.user.tag}!`);
    console.log(`Currently in ${global.bot.guilds.cache.size} servers!`);
    console.log('Bot has started!');
    global.bot.user.setActivity(`apple!help`, { type: "PLAYING" });
});

global.bot.commands = new Discord.Collection();
global.bot.cooldowns = new Discord.Collection();

const commands = fs.readdirSync('./secureenclave');

for (const category of commands) {
    const cmd_files = fs.readdirSync(`./secureenclave/${category}`).filter(file => file.endsWith('.js'));
    for (const file of cmd_files) {
        const command = require(`./secureenclave/${category}/${file}`);
        global.bot.commands.set(command.name, command);
    }
}

global.bot.on("messageCreate", async message => {
    if (message.author.bot) return;
    if (message.mentions.everyone) return;
    if (message.channel.type === "DM") return;

    // Bot prefix
    let prefixes = (global.BETA_RELEASE) ? ["beta!", "<@852896210267275324>", "<@!852896210267275324>"] : ["apple!", "<@852378577063116820>", "<@!852378577063116820>"];
    var prefix = (global.BETA_RELEASE) ? "beta!" : "apple!"; // default prefix
    for (const i of prefixes) if (message.content.toLowerCase().startsWith(i)) prefix = i;
    if (!message.content.startsWith(prefix)) return;

    // Get commands
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = global.bot.commands.get(command);
    if (!cmd) return;

    // Command cooldowns (owner can bypass this)
    if (message.author.id != '589324103463338007') {
        const { cooldowns } = global.bot;
        if (!cooldowns.has(cmd.name)) cooldowns.set(cmd.name, new Discord.Collection());
        // 4s cooldown by default
        const now = Date.now(), timestamps = cooldowns.get(cmd.name), amount = (cmd.cooldown || 4) * 1000;
        if (timestamps.has(message.author.id)) {
            const exp_time = timestamps.get(message.author.id) + amount;
            if (now < exp_time) {
                const remaining = (exp_time - now) / 1000;
                return message.channel.send(error_alert(`I need to rest a little bit! Please wait **${remaining.toFixed(1)} more seconds** to use \`apple!${cmd.name}\`!`));
            }
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), amount);
    }

    // Run commands
    try {
        cmd.execute(message, args);
    } catch (error) {
        console.log(error);
        message.channel.send(error_alert(`An unknown error occured while running \`apple!${cmd.name}\``));
    }
});

// ============= UPDATES FETCH =============

fetch_gdmf(true, true, true, true, true, true);
fetch_xml();

setInterval(function () {
    fetch_gdmf(true, true, true, true, true, true);
    fetch_xml();
}, 60000);
