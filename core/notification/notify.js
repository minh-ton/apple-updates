// Send update embeds to servers & ping notification roles

const firebase = require("firebase-admin");

require('../utils/error.js')();

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

const os_databases = {
    'ios': ios_database,
    'ipados': ipados_database,
    'watchos': watchos_database,
    'tvos': tvos_database,
    'audioos': audioos_database,
    'macos': macos_database,
    'pkg': pkg_database,
    'bot': bot_database
};

const os_role_messages = {
    'ios': (version) => `**iOS ${version}** has been released!`,
    'ipados': (version) => `**iPadOS ${version}** has been released!`,
    'watchos': (version) => `**watchOS ${version}** has been released!`,
    'tvos': (version) => `**tvOS ${version}** has been released!`,
    'audioos': (version) => `**audioOS ${version}** has been released!`,
    'macos': (version) => `**macOS ${version}** has been released!`,
    'pkg': (version) => `**macOS ${version}** Full Installer Package is available!`,
    'bot': () => `New announcements!`
};

module.exports = function () {
    this.notify_all_servers = async function (os, embed, version) {
        if (global.UPDATE_MODE) return;
        
        const osKey = os.toLowerCase();
        const database = os_databases[osKey];
        
        if (!database) {
            log_error(`Unknown OS type: ${os}`, "notify.js", `notify_all_servers`, `invalid OS type`);
            return;
        }
        
        try {
            const snapshot = await database.get();
            const guilds = snapshot.data();
            
            if (!guilds) return;
            
            for (let guildId in guilds) {
                const channelId = guilds[guildId];
                const channel = global.bot.channels.cache.get(channelId);
                
                if (!channel) continue;
                
                const server = global.bot.guilds.cache.get(guildId);
                if (!server) continue;
                
                channel.send({ 
                    embeds: [embed.setAuthor({ name: server.name, iconURL: server.iconURL() })] 
                }).catch(error => {
                    log_error(error, "notify.js", `notify_all_servers`, `send ${osKey} update to channel ${channelId}`);
                });
                
                try {
                    const roleDoc = await role_database.doc(guildId).get();
                    const roleData = roleDoc.data();
                    
                    if (roleData && roleData[osKey]) {
                        const role = server.roles.cache.get(roleData[osKey]);
                        if (role && version) {
                            const message = os_role_messages[osKey](version);
                            channel.send(`<@&${roleData[osKey]}> ${message}`).catch(error => {
                                log_error(error, "notify.js", `notify_all_servers`, `send ${osKey} role mention to channel ${channelId}`);
                            });
                        }
                    }
                } catch (error) {
                    log_error(error, "notify.js", `notify_all_servers`, `fetch role data for guild ${guildId}`);
                }
            }
        } catch (error) {
            log_error(error, "notify.js", `notify_all_servers`, `fetch ${osKey} database`);
        }
    }
}