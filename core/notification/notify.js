// Send update embeds to servers & ping notification roles

const firebase = require("firebase-admin");

require('../utils/error.js')();

let db = firebase.firestore();

// Legacy databases (for backward compatibility with non-migrated servers)
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

const role_database = db.collection('discord').doc('roles').collection('servers');

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

const os_role_messages = {
    'ios': (version) => `**iOS ${version}** has been released!`,
    'ipados': (version) => `**iPadOS ${version}** has been released!`,
    'watchos': (version) => `**watchOS ${version}** has been released!`,
    'tvos': (version) => `**tvOS ${version}** has been released!`,
    'audioos': (version) => `**HomePod Software ${version}** has been released!`,
    'macos': (version) => `**macOS ${version}** has been released!`,
    'pkg': (version) => `**macOS ${version}** Installer Package is available!`,
    'bot': () => `New announcements!`
};

// Helper function to send notification to a single guild
async function send_to_guild(guild_id, channel_id, embed, version, os) {
    const channel = global.bot.channels.cache.get(channel_id);
    if (!channel) return;
    
    const server = global.bot.guilds.cache.get(guild_id);
    if (!server) return;
    
    channel.send({ 
        embeds: [embed.setAuthor({ name: server.name, iconURL: server.iconURL() })] 
    }).catch(error => {
        log_error(error, "notify.js", `send_to_guild`, `send ${os} update to channel ${channel_id}`);
    });
    
    try {
        const role_doc = await role_database.doc(guild_id).get();
        const role_data = role_doc.data();
        
        // Use the base OS name for role lookup
        if (role_data && role_data[os]) {
            const role = server.roles.cache.get(role_data[os]);
            if (role && version) {
                const message = os_role_messages[os](version);
                channel.send(`<@&${role_data[os]}> ${message}`).catch(error => {
                    log_error(error, "notify.js", `send_to_guild`, `send ${os} role mention to channel ${channel_id}`);
                });
            }
        }
    } catch (error) {
        log_error(error, "notify.js", `send_to_guild`, `fetch role data for guild ${guild_id}`);
    }
}

module.exports = function () {
    this.notify_all_servers = async function (os, embed, version, is_beta) {
        if (global.UPDATE_MODE) return;
        
        // Handle special cases that don't have beta/public separation
        if (os === 'pkg' || os === 'bot') {
            const database = os_databases[os];
            if (!database) {
                log_error(`Unknown OS type: ${os}`, "notify.js", `notify_all_servers`, `invalid OS type`);
                return;
            }
            
            try {
                const guild_snapshot = await database.get();
                const guilds = guild_snapshot.data();
                
                if (!guilds) return;
                
                for (let guild_id in guilds) {
                    await send_to_guild(guild_id, guilds[guild_id], embed, version, os);
                }
            } catch (error) {
                log_error(error, "notify.js", `notify_all_servers`, `fetch ${os} database`);
            }
            return;
        }
        
        // Determine which new document to query based on is_beta
        const new_doc_key = is_beta ? `${os}_beta` : `${os}_public`;
        const new_database = os_databases[new_doc_key];
        const legacy_database = os_databases[os];
        
        if (!new_database || !legacy_database) {
            log_error(`Unknown OS type: ${os}`, "notify.js", `notify_all_servers`, `invalid OS type`);
            return;
        }
        
        const notified_guilds = new Set();
        
        try {
            // First, fetch from new document (migrated servers)
            const new_snapshot = await new_database.get();
            const new_guilds = new_snapshot.data() || {};
            
            for (let guild_id in new_guilds) {
                await send_to_guild(guild_id, new_guilds[guild_id], embed, version, os);
                notified_guilds.add(guild_id);
            }
            
            // Then, fetch from legacy document (non-migrated servers)
            // Skip guilds that were already notified from new document
            const legacy_snapshot = await legacy_database.get();
            const legacy_guilds = legacy_snapshot.data() || {};
            
            for (let guild_id in legacy_guilds) {
                if (notified_guilds.has(guild_id)) continue; // Already notified
                await send_to_guild(guild_id, legacy_guilds[guild_id], embed, version, os);
            }
        } catch (error) {
            log_error(error, "notify.js", `notify_all_servers`, `fetch ${os} databases`);
        }
    }
}