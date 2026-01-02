// Fetch updates for each Apple OS

const devices = require("../assets/devices.json");
const catalogs = require("../assets/catalogs.json");
const audiences = require("../assets/audiences.json");

require('./fetch/fetch.js')();
require('./utils/error.js')();

const UPDATE_CONFIGS = [
    // -------------------------------------------------------------------------
    // macOS Updates
    // -------------------------------------------------------------------------
    {
        os: 'macOS',
        audience: audiences.macos_13_beta,
        device: devices.macos,
        dname: 'beta',
        beta: true,
        enabled: true,
        description: 'macOS Ventura Beta'
    },
    {
        os: 'macOS',
        audience: audiences.macos_14_beta,
        device: devices.macos,
        dname: 'beta',
        beta: true,
        enabled: true,
        description: 'macOS Sonoma Beta'
    },
    {
        os: 'macOS',
        audience: audiences.macos_15_beta,
        device: devices.macos,
        dname: 'beta',
        beta: true,
        enabled: true,
        description: 'macOS Sequoia Beta'
    },
    {
        os: 'macOS',
        audience: audiences.macos_26_beta,
        device: devices.macos,
        dname: 'beta',
        beta: true,
        enabled: true,
        description: 'macOS Tahoe Beta'
    },
    {
        os: 'macOS',
        audience: audiences.macos_release,
        device: devices.macos,
        dname: 'public',
        beta: false,
        enabled: true,
        description: 'macOS Release'
    },

    // -------------------------------------------------------------------------
    // iOS Updates
    // -------------------------------------------------------------------------
    {
        os: 'iOS',
        audience: audiences.ios_18_beta,
        device: devices.ios,
        dname: 'beta',
        beta: true,
        enabled: true,
        description: 'iOS 18 Beta'
    },
    {
        os: 'iOS',
        audience: audiences.ios_26_beta,
        device: devices.ios,
        dname: 'beta',
        beta: true,
        enabled: true,
        description: 'iOS 26 Beta'
    },
    {
        os: 'iOS',
        audience: audiences.ios_release,
        device: { build: "19G71", model: "D101AP", prodtype: "iPhone9,3", version: "15.6" },
        dname: 'public',
        beta: false,
        enabled: true,
        description: 'iOS 15 (Legacy)'
    },
    {
        os: 'iOS',
        audience: audiences.ios_release,
        device: devices.ios,
        dname: 'public',
        beta: false,
        enabled: true,
        description: 'iOS Release'
    },

    // -------------------------------------------------------------------------
    // iPadOS Updates
    // -------------------------------------------------------------------------
    {
        os: 'iPadOS',
        audience: audiences.ios_18_beta,
        device: devices.ipados,
        dname: 'beta',
        beta: true,
        enabled: true,
        description: 'iPadOS 18 Beta'
    },
    {
        os: 'iPadOS',
        audience: audiences.ios_26_beta,
        device: devices.ipados,
        dname: 'beta',
        beta: true,
        enabled: true,
        description: 'iPadOS 26 Beta'
    },
    {
        os: 'iPadOS',
        audience: audiences.ios_release,
        device: { build: "19G71", model: "J81AP", prodtype: "iPad5,3", version: "15.6" },
        dname: 'public',
        beta: false,
        enabled: true,
        description: 'iPadOS 15 (Legacy)'
    },
    {
        os: 'iPadOS',
        audience: audiences.ios_release,
        device: devices.ipados,
        dname: 'public',
        beta: false,
        enabled: true,
        description: 'iPadOS Release'
    },

    // -------------------------------------------------------------------------
    // watchOS Updates
    // -------------------------------------------------------------------------
    {
        os: 'watchOS',
        audience: audiences.watchos_11_beta,
        device: devices.watchos,
        dname: 'beta',
        beta: true,
        enabled: true,
        description: 'watchOS 11 Beta'
    },
    {
        os: 'watchOS',
        audience: audiences.watchos_26_beta,
        device: devices.watchos,
        dname: 'beta',
        beta: true,
        enabled: true,
        description: 'watchOS 26 Beta'
    },
    {
        os: 'watchOS',
        audience: audiences.watchos_release,
        device: devices.watchos,
        dname: 'public',
        beta: false,
        enabled: true,
        description: 'watchOS Release'
    },

    // -------------------------------------------------------------------------
    // audioOS Updates
    // -------------------------------------------------------------------------
    {
        os: 'audioOS',
        audience: audiences.audioos_18_beta,
        device: devices.audioos,
        dname: 'beta',
        beta: true,
        enabled: true,
        description: 'audioOS 18 Beta'
    },
    {
        os: 'audioOS',
        audience: audiences.audioos_26_beta,
        device: devices.audioos,
        dname: 'beta',
        beta: true,
        enabled: true,
        description: 'audioOS 26 Beta'
    },
    {
        os: 'audioOS',
        audience: audiences.audioos_release,
        device: devices.audioos,
        dname: 'public',
        beta: false,
        enabled: true,
        description: 'audioOS Release'
    },

    // -------------------------------------------------------------------------
    // tvOS Updates
    // -------------------------------------------------------------------------
    {
        os: 'tvOS',
        audience: audiences.tvos_18_beta,
        device: devices.tvos,
        dname: 'beta',
        beta: true,
        enabled: true,
        description: 'tvOS 18 Beta'
    },
    {
        os: 'tvOS',
        audience: audiences.tvos_26_beta,
        device: devices.tvos,
        dname: 'beta',
        beta: true,
        enabled: true,
        description: 'tvOS 26 Beta'
    },
    {
        os: 'tvOS',
        audience: audiences.tvos_release,
        device: devices.tvos,
        dname: 'public',
        beta: false,
        enabled: true,
        description: 'tvOS Release'
    }
];

const INSTALLER_CONFIGS = [
    {
        catalog: catalogs.macos_beta,
        beta: true,
        dname: 'beta_pkg',
        enabled: true,
        description: 'macOS Beta Installers'
    },
    {
        catalog: catalogs.macos_public,
        beta: false,
        dname: 'public_pkg',
        enabled: true,
        description: 'macOS Public Installers'
    }
];

// =============================================================================
// POLLING FUNCTIONS
// =============================================================================

module.exports = function () {
    this.updates_polling = async function () {
        for (const config of UPDATE_CONFIGS) {
            if (!config.enabled) continue;

            await check_for_updates(
                config.os,
                config.audience,
                config.device.build,
                config.device.model,
                config.device.prodtype,
                config.device.version,
                config.dname,
                config.beta
            );
        }
    };

    this.installers_polling = async function () {
        for (const config of INSTALLER_CONFIGS) {
            if (!config.enabled) continue;
            await check_for_installers(config.catalog, config.beta, config.dname);
        }
    };
}