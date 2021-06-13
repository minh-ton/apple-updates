const firebase = require("firebase-admin");

require('./error.js')();

let db = firebase.firestore();

const ios_database = db.collection('discord').doc('ios');
const ipados_database = db.collection('discord').doc('ipados');
const watchos_database = db.collection('discord').doc('watchos');
const tvos_database = db.collection('discord').doc('tvos');
const audioos_database = db.collection('discord').doc('audioos');
const macos_database = db.collection('discord').doc('macos');
const pkg_database = db.collection('discord').doc('pkg');
const delta_database = db.collection('discord').doc('delta');
const bot_database = db.collection('discord').doc('bot');

module.exports = function () {
    this.send_to_servers = async function (os, embed) {
        switch (os.toLowerCase()) {
            case "tvos":
                const tvos = await tvos_database.get();
                const tvos_guilds = tvos.data();
                for (let channel in tvos.data()) if (global.bot.channels.cache.get(tvos_guilds[channel]) != undefined) global.bot.channels.cache.get(tvos_guilds[channel]).send(embed).catch(function (error) { send_error(error, "send.js", `send_tvos`, `send tvos update to channels`); });
                break;
            case "audioos":
                const audioos = await audioos_database.get();
                const audioos_guilds = audioos.data();
                for (let channel in audioos.data()) if (global.bot.channels.cache.get(audioos_guilds[channel]) != undefined) global.bot.channels.cache.get(audioos_guilds[channel]).send(embed).catch(function (error) { send_error(error, "send.js", `send_audioos`, `send audioos update to channels`); });
                break;
            case "macos":
                const macos = await macos_database.get();
                const macos_guilds = macos.data();
                for (let channel in macos.data()) if (global.bot.channels.cache.get(macos_guilds[channel]) != undefined) global.bot.channels.cache.get(macos_guilds[channel]).send(embed).catch(function (error) { send_error(error, "send.js", `send_macos`, `send macos update to channels`); });
                break;
            case "ios":
                const ios = await ios_database.get();
                const ios_guilds = ios.data();
                for (let channel in ios.data()) if (global.bot.channels.cache.get(ios_guilds[channel]) != undefined) global.bot.channels.cache.get(ios_guilds[channel]).send(embed).catch(function (error) { send_error(error, "send.js", `send_ios`, `send ios update to channels`); });
                break;
            case "ipados":
                const ipados = await ipados_database.get();
                const ipados_guilds = ipados.data();
                for (let channel in ipados.data()) if (global.bot.channels.cache.get(ipados_guilds[channel]) != undefined) global.bot.channels.cache.get(ipados_guilds[channel]).send(embed).catch(function (error) { send_error(error, "send.js", `send_ipados`, `send ipados update to channels`); });
                break;
            case "watchos":
                const watchos = await watchos_database.get();
                const watchos_guilds = watchos.data();
                for (let channel in watchos.data()) if (global.bot.channels.cache.get(watchos_guilds[channel]) != undefined) global.bot.channels.cache.get(watchos_guilds[channel]).send(embed).catch(function (error) { send_error(error, "send.js", `send_watchos`, `send watchos update to channels`); });
                break;
            case "pkg":
                const pkg = await pkg_database.get();
                const pkg_guilds = pkg.data();
                for (let channel in pkg.data()) if (global.bot.channels.cache.get(pkg_guilds[channel]) != undefined) global.bot.channels.cache.get(pkg_guilds[channel]).send(embed).catch(function (error) { send_error(error, "send.js", `send_pkg`, `send pkg link to channels`); });
                break;
            case "delta":
                const delta = await delta_database.get();
                const delta_guilds = delta.data();
                for (let channel in delta.data()) if (global.bot.channels.cache.get(delta_guilds[channel]) != undefined) global.bot.channels.cache.get(delta_guilds[channel]).send(embed).catch(function (error) { send_error(error, "send.js", `send_delta`, `send delta link to channels`); });
                break;
            case "bot":
                const bot = await bot_database.get();
                const bot_guilds = bot.data();
                for (let channel in bot.data()) if (global.bot.channels.cache.get(bot_guilds[channel]) != undefined) global.bot.channels.cache.get(bot_guilds[channel]).send(embed).catch(function (error) { send_error(error, "send.js", `send_bot`, `send bot update to channels`); });
                break;
            default:
                return;
        }
    }
}