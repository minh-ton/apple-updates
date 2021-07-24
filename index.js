// Created by Minh on May 19th, 2021

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

global.beta_release = false; // switch mode
global.bot_version = "2.2.3";
global.bot_updatedate = "July 24th, 2021"
global.script_path = process.cwd();

const Discord = require('discord.js');
const Enmap = require("enmap");
const fs = require("fs");
const config = require("./bootrom/config.json");
const firebase = require("firebase-admin");

const credentials = require("./bootrom/firebase.json");
const credentials_beta = require("./bootrom/firebase_beta.json");

(global.beta_release) ? firebase.initializeApp({
    credential: firebase.credential.cert(credentials_beta)
}) : firebase.initializeApp({
    credential: firebase.credential.cert(credentials)
});

require("./applesilicon/updates.js")();

global.bot = new Discord.Client();
(global.beta_release) ? global.bot.login(config.bot_beta_token) : global.bot.login(config.bot_token);

// ============= DISCORD BOT ============

global.bot.on("ready", async () => {
    if (global.beta_release) console.log("RUNNING IN BETA MODE.");
    console.log(`Logged in as ${global.bot.user.tag}!`);
    console.log('Bot has started!');
    setInterval(() => {
        (global.beta_release) ? global.bot.user.setActivity("Prefix: beta!", { type: "PLAYING" }) : global.bot.user.setActivity(`apple!help | ${global.bot.guilds.cache.size}`, { type: "WATCHING" });
    }, 10000);
});

global.bot.commands = new Enmap();

const commands = fs.readdirSync('./secureenclave');

for (const category of commands) {
	const cmd_files = fs.readdirSync(`./secureenclave/${category}`).filter(file => file.endsWith('.js'));
	for (const file of cmd_files) {
		const command = require(`./secureenclave/${category}/${file}`);
		global.bot.commands.set(command.name, command);
	}
}

global.bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.mentions.everyone) return;
    if (message.channel.type === "dm") return;

    var prefix;
    (global.beta_release) ? prefix = "beta!" : prefix = "apple!";

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = global.bot.commands.get(command);
    if (!cmd) return;
    cmd.execute(message, args);
});

// ============= UPDATES FETCH =============

fetch_gdmf(true, true, true, true, true);
fetch_xml();

setInterval(function () {
    fetch_gdmf(true, true, true, true, true);
    fetch_xml();
}, 60000);