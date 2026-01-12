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
    'audioos': (version) => `**HomePod Software ${version}** has been released!`,
    'macos': (version) => `**macOS ${version}** has been released!`,
    'pkg': (version) => `**macOS ${version}** Full Installer Package is available!`,
    'bot': () => `New announcements!`
};

module.exports = function () {
    this.notify_all_servers = async function (os, embed, version) {
        if (global.UPDATE_MODE) return;
        
        const os_key = os.toLowerCase();
        const database = os_databases[os_key];
        
        if (!database) {
            log_error(`Unknown OS type: ${os}`, "notify.js", `notify_all_servers`, `invalid OS type`);
            return;
        }
        
        try {
            const guild_snapshot = await database.get();
            const guilds = guild_snapshot.data();
            
            if (!guilds) return;
            
            for (let guild_id in guilds) {
                const channel_id = guilds[guild_id];
                const channel = global.bot.channels.cache.get(channel_id);
                
                if (!channel) continue;
                
                const server = global.bot.guilds.cache.get(guild_id);
                if (!server) continue;
                
                channel.send({ 
                    embeds: [embed.setAuthor({ name: server.name, iconURL: server.iconURL() })] 
                }).catch(error => {
                    log_error(error, "notify.js", `notify_all_servers`, `send ${os_key} update to channel ${channel_id}`);
                });
                
                try {
                    const role_doc = await role_database.doc(guild_id).get();
                    const role_data = role_doc.data();
                    
                    if (role_data && role_data[os_key]) {
                        const role = server.roles.cache.get(role_data[os_key]);
                        if (role && version) {
                            const message = os_role_messages[os_key](version);
                            channel.send(`<@&${role_data[os_key]}> ${message}`).catch(error => {
                                log_error(error, "notify.js", `notify_all_servers`, `send ${os_key} role mention to channel ${channel_id}`);
                            });
                        }
                    }
                } catch (error) {
                    log_error(error, "notify.js", `notify_all_servers`, `fetch role data for guild ${guild_id}`);
                }
            }
        } catch (error) {
            log_error(error, "notify.js", `notify_all_servers`, `fetch ${os_key} database`);
        }
    }
}