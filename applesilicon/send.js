// Send update embeds to servers & ping notification roles

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
const bot_database = db.collection('discord').doc('bot');
const role_database = db.collection('discord').doc('roles').collection('servers');

module.exports = function () {
    this.send_to_servers = async function (os, embed, version) {
        if (global.UPDATE_MODE) return;
        switch (os.toLowerCase()) {
            case "tvos":
                const tvos = await tvos_database.get();
                const tvos_guilds = tvos.data();
                for (let channel in tvos.data()) {
                    let chn = global.bot.channels.cache.get(tvos_guilds[channel]);
                    if (chn != undefined) {
                        let role = await role_database.doc(channel).get();
                        let role_data = role.data();
                        let server = global.bot.guilds.cache.get(channel);

                        const has_pingable_roles =
                            role_data &&
                            role_data["tvos"] &&
                            server.roles.cache.get(role_data["tvos"]);

                        if (server) {
                            chn.send(
                                has_pingable_roles
                                    ? `<@&${role_data["tvos"]}> **tvOS ${version}** has been released!`
                                    : null,
                                {
                                    embeds: [embed.setAuthor({ name: server.name, iconURL: server.iconURL() }),],
                                }
                            ).catch(function (error) {
                                send_error(error, "send.js", `send_tvos`, `send tvos update to channels`);
                            });
                        }
                    }
                }
                break;
            case "audioos":
                const audioos = await audioos_database.get();
                const audioos_guilds = audioos.data();
                for (let channel in audioos.data()) {
                    let chn = global.bot.channels.cache.get(audioos_guilds[channel]);
                    if (chn != undefined) {
                        let role = await role_database.doc(channel).get();
                        let role_data = role.data();
                        let server = global.bot.guilds.cache.get(channel);

                        const has_pingable_roles =
                            role_data &&
                            role_data["audioos"] &&
                            server.roles.cache.get(role_data["audioos"]);

                        if (server) {
                            chn.send(has_pingable_roles ? `<@&${role_data['audioos']}> **audioOS ${version}** has been released!` : null { embeds: [embed.setAuthor({ name: server.name, iconURL: server.iconURL() })] }).catch(function (error) {
                                send_error(error, "send.js", `send_audioos`, `send audioos update to channels`);
                            });
                        }
                    }
                }
                break;
            case "macos":
                const macos = await macos_database.get();
                const macos_guilds = macos.data();
                for (let channel in macos.data()) {
                    let chn = global.bot.channels.cache.get(macos_guilds[channel]);
                    if (chn != undefined) {
                        let role = await role_database.doc(channel).get();
                        let role_data = role.data();
                        let server = global.bot.guilds.cache.get(channel);

                        const has_pingable_roles =
                            role_data &&
                            role_data["macos"] &&
                            server.roles.cache.get(role_data["macos"]);

                        if (server) {
                            chn.send(
                                has_pingable_roles
                                    ? `<@&${role_data['macos']}> **macOS ${version}** has been released!`
                                    : null,
                                { embeds: [embed.setAuthor({ name: server.name, iconURL: server.iconURL() })] }
                            ).catch(function (error) {
                                send_error(error, "send.js", `send_macos`, `send macos update to channels`);
                            });
                        }
                    }
                }
                break;
            case "ios":
                const ios = await ios_database.get();
                const ios_guilds = ios.data();
                for (let channel in ios.data()) {
                    let chn = global.bot.channels.cache.get(ios_guilds[channel]);
                    if (chn != undefined) {
                        let role = await role_database.doc(channel).get();
                        let role_data = role.data();
                        let server = global.bot.guilds.cache.get(channel);

                        const has_pingable_roles =
                            role_data &&
                            role_data["ios"] &&
                            server.roles.cache.get(role_data["ios"]);

                        if (server) {
                            chn.send(
                                has_pingable_roles
                                    ? `<@&${role_data['ios']}> **iOS ${version}** has been released!`
                                    : null,
                                { embeds: [embed.setAuthor({ name: server.name, iconURL: server.iconURL() })] }
                            ).catch(function (error) {
                                send_error(error, "send.js", `send_ios`, `send ios update to channels`);
                            });
                        }
                    }
                }
                break;
            case "ipados":
                const ipados = await ipados_database.get();
                const ipados_guilds = ipados.data();
                for (let channel in ipados.data()) {
                    let chn = global.bot.channels.cache.get(ipados_guilds[channel]);
                    if (chn != undefined) {
                        let role = await role_database.doc(channel).get();
                        let role_data = role.data();
                        let server = global.bot.guilds.cache.get(channel);

                        const has_pingable_roles =
                            role_data &&
                            role_data["ipados"] &&
                            server.roles.cache.get(role_data["ipados"]);

                        if (server) {
                            chn.send(
                                has_pingable_roles
                                    ? `<@&${role_data['ipados']}> **iPadOS ${version}** has been released!`
                                    : null, { embeds: [embed.setAuthor({ name: server.name, iconURL: server.iconURL() })] }
                            ).catch(function (error) {
                                send_error(error, "send.js", `send_ipados`, `send ipados update to channels`);
                            });
                        }
                    }
                }
                break;
            case "watchos":
                const watchos = await watchos_database.get();
                const watchos_guilds = watchos.data();
                for (let channel in watchos.data()) {
                    let chn = global.bot.channels.cache.get(watchos_guilds[channel]);
                    if (chn != undefined) {
                        let role = await role_database.doc(channel).get();
                        let role_data = role.data();
                        let server = global.bot.guilds.cache.get(channel);

                        const has_pingable_roles =
                            role_data &&
                            role_data["watchos"] &&
                            server.roles.cache.get(role_data["watchos"]);

                        if (server) {
                            chn.send(
                                has_pingable_roles
                                    ? `<@&${role_data['watchos']}> **watchOS ${version}** has been released!`
                                    : null,
                                { embeds: [embed.setAuthor({ name: server.name, iconURL: server.iconURL() })] }
                            ).catch(function (error) {
                                send_error(error, "send.js", `send_watchos`, `send watchos update to channels`);
                            });
                        }

                    }
                }
                break;
            case "pkg":
                const pkg = await pkg_database.get();
                const pkg_guilds = pkg.data();
                for (let channel in pkg.data()) {
                    let chn = global.bot.channels.cache.get(pkg_guilds[channel]);
                    if (chn != undefined) {
                        let role = await role_database.doc(channel).get();
                        let role_data = role.data();
                        let server = global.bot.guilds.cache.get(channel);

                        const has_pingable_roles =
                            role_data &&
                            role_data["pkg"] &&
                            server.roles.cache.get(role_data["pkg"]);

                        if (server) {
                            chn.send(
                                has_pingable_roles
                                    ? `<@&${role_data['pkg']}> **macOS ${version}** Full Installer Package is available!`
                                    : null,
                                { embeds: [embed.setAuthor({ name: server.name, iconURL: server.iconURL() })] }
                            ).catch(function (error) {
                                send_error(error, "send.js", `send_pkg`, `send pkg link to channels`);
                            });
                        }
                    }
                }
                break;
            case "bot":
                const bot = await bot_database.get();
                const bot_guilds = bot.data();
                for (let channel in bot.data()) {
                    let chn = global.bot.channels.cache.get(bot_guilds[channel]);
                    if (chn != undefined) {
                        let role = await role_database.doc(channel).get();
                        let role_data = role.data();
                        let server = global.bot.guilds.cache.get(channel);

                        const has_pingable_roles =
                            role_data &&
                            role_data["bot"] &&
                            server.roles.cache.get(role_data["bot"]);

                        if (server) {
                            chn.send(
                                has_pingable_roles
                                    ? `<@&${role_data['bot']}> New announcements!`
                                    : null,
                                { embeds: [embed.setAuthor({ name: server.name, iconURL: server.iconURL() })] }
                            ).catch(function (error) {
                                send_error(error, "send.js", `send_bot`, `send bot update to channels`);
                            });
                        }
                    }
                }
                break;
            default:
                return;
        }
    }
}