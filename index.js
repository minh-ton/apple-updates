// Created by Minh on May 19th, 2021

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const Discord = require('discord.js');
const Enmap = require("enmap");
const fs = require("fs");
const config = require("./bootrom/config.json");

const firebase = require("firebase-admin");
const credentials = require("./bootrom/firebase.json");

firebase.initializeApp({
    credential: firebase.credential.cert(credentials)
});

require("./applesilicon/updates.js")();

global.bot = new Discord.Client();
global.bot.login(config.bot_token);

// ============= MONITOR BOT ============

global.bot.on("ready", async () => {
    console.log(`Logged in as ${global.bot.user.tag}!`);
    console.log('Bot has started!');
    global.bot.user.setActivity("with Apple", { type: "PLAYING" });
});

global.bot.commands = new Enmap();
fs.readdir("./secureenclave/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./secureenclave/${file}`);
        let commandName = file.split(".")[0];
        global.bot.commands.set(commandName, props);
    });
    console.log(`Commands loaded.`);
});

global.bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.mentions.everyone) return;
    if (message.channel.type === "dm") return;
    if (!message.content.startsWith('apple!')) return;

    const args = message.content.slice(6).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = global.bot.commands.get(command);
    if (!cmd) return;
    cmd.run(message, args);
});

// ============= UPDATES FETCH =============

fetch_gdmf(true, true, true, true, true);
fetch_xml();

setInterval(function () {
    fetch_gdmf(true, true, true, true, true);
    fetch_xml();
}, 60000);