// Fetch updates for each Apple OS

const devices = require("../assets/devices.json");
const catalogs = require("../assets/catalogs.json");
const audiences = require("../assets/audiences.json");

require('./apple/manager.js')();
require('./error.js')();

module.exports = function () {
    this.fetch_gdmf = async function (macos, ios, ipados, watchos, audioos, tvos) { // for debugging purposes
        global.BOT_STATUS = "Working";

        // Beta macOS
        if (macos) await fetch_macos_updates(audiences.macos_11_beta, devices.macos.build, devices.macos.model, devices.macos.prodtype, devices.macos.version, 'beta', true); // macOS Big Sur Beta
        if (macos) await fetch_macos_updates(audiences.macos_12_beta, devices.macos.build, devices.macos.model, devices.macos.prodtype, devices.macos.version, 'beta', true); // macOS Monterey Beta
        if (macos) await fetch_macos_updates(audiences.macos_13_beta, devices.macos.build, devices.macos.model, devices.macos.prodtype, devices.macos.version, 'beta', true); // macOS Ventura Beta
        if (macos) await fetch_macos_updates(audiences.macos_14_beta, devices.macos.build, devices.macos.model, devices.macos.prodtype, devices.macos.version, 'beta', true); // macOS Sonoma Beta
        if (macos) await fetch_macos_updates(audiences.macos_15_beta, devices.macos.build, devices.macos.model, devices.macos.prodtype, devices.macos.version, 'beta', true); // macOS Squoia Beta
        // Public macOS
        if (macos) await fetch_macos_updates(audiences.macos_release, devices.macos.build, devices.macos.model, devices.macos.prodtype, devices.macos.version, 'public', false); // macOS Release

        // Beta iOS
        if (ios) await fetch_other_updates(audiences.ios_15_beta, "19G71", "D101AP", "iPhone9,3", "15.6", "iOS", "beta", true); // iOS 15 Beta
        if (ios) await fetch_other_updates(audiences.ios_16_beta, devices.ios.build, devices.ios.model, devices.ios.prodtype, devices.ios.version, "iOS", "beta", true); // iOS 16 Beta
        if (ios) await fetch_other_updates(audiences.ios_17_beta, devices.ios.build, devices.ios.model, devices.ios.prodtype, devices.ios.version, "iOS", "beta", true); // iOS 17 Beta
        if (ios) await fetch_other_updates(audiences.ios_18_beta, devices.ios.build, devices.ios.model, devices.ios.prodtype, devices.ios.version, "iOS", "beta", true); // iOS 18 Beta
        // Public iOS
        if (ios) await fetch_other_updates(audiences.ios_release, "19G71", "D101AP", "iPhone9,3", "15.6", "iOS", "public", false); // iOS 15
        if (ios) await fetch_other_updates(audiences.ios_release, devices.ios.build, devices.ios.model, devices.ios.prodtype, devices.ios.version, "iOS", "public", false); // iOS Release

        // Beta iPadOS
        if (ipados) await fetch_other_updates(audiences.ios_15_beta, "19G71", "J81AP", "iPad5,3", "15.6", "iPadOS", "beta", true); // iPadOS 15 Beta
        if (ipados) await fetch_other_updates(audiences.ios_16_beta, devices.ipados.build, devices.ipados.model, devices.ipados.prodtype, devices.ipados.version, "iPadOS", "beta", true); // iPadOS 16 Beta
        if (ipados) await fetch_other_updates(audiences.ios_17_beta, devices.ipados.build, devices.ipados.model, devices.ipados.prodtype, devices.ipados.version, "iPadOS", "beta", true); // iPadOS 17 Beta
        if (ipados) await fetch_other_updates(audiences.ios_18_beta, devices.ipados.build, devices.ipados.model, devices.ipados.prodtype, devices.ipados.version, "iPadOS", "beta", true); // iPadOS 18 Beta
        // Public iPadOS
        if (ipados) await fetch_other_updates(audiences.ios_release, "19G71", "J81AP", "iPad5,3", "15.6", "iPadOS", "public", false); // iPadOS 15
        if (ipados) await fetch_other_updates(audiences.ios_release, devices.ipados.build, devices.ipados.model, devices.ipados.prodtype, devices.ipados.version, "iPadOS", "public", false); // iPadOS Release

        // Beta watchOS
        if (watchos) await fetch_other_updates(audiences.watchos_8_beta, devices.watchos.build, devices.watchos.model, devices.watchos.prodtype, devices.watchos.version, "watchOS", "beta", true); // watchOS 8 Beta
        if (watchos) await fetch_other_updates(audiences.watchos_9_beta, devices.watchos.build, devices.watchos.model, devices.watchos.prodtype, devices.watchos.version, "watchOS", "beta", true); // watchOS 9 Beta
        if (watchos) await fetch_other_updates(audiences.watchos_10_beta, devices.watchos.build, devices.watchos.model, devices.watchos.prodtype, devices.watchos.version, "watchOS", "beta", true); // watchOS 10 Beta
        if (watchos) await fetch_other_updates(audiences.watchos_11_beta, devices.watchos.build, devices.watchos.model, devices.watchos.prodtype, devices.watchos.version, "watchOS", "beta", true); // watchOS 11 Beta
        // Public watchOS
        if (watchos) await fetch_other_updates(audiences.watchos_release, devices.watchos.build, devices.watchos.model, devices.watchos.prodtype, devices.watchos.version, "watchOS", "public", false); // watchOS Release

        // Beta audioOS
        if (audioos) await fetch_other_updates(audiences.audioos_15_beta, devices.audioos.build, devices.audioos.model, devices.audioos.prodtype, devices.audioos.version, "audioOS", "beta", true); // audioOS 15 Beta
        if (audioos) await fetch_other_updates(audiences.audioos_16_beta, devices.audioos.build, devices.audioos.model, devices.audioos.prodtype, devices.audioos.version, "audioOS", "beta", true); // audioOS 16 Beta
        if (audioos) await fetch_other_updates(audiences.audioos_17_beta, devices.audioos.build, devices.audioos.model, devices.audioos.prodtype, devices.audioos.version, "audioOS", "beta", true); // audioOS 17 Beta
        if (audioos) await fetch_other_updates(audiences.audioos_18_beta, devices.audioos.build, devices.audioos.model, devices.audioos.prodtype, devices.audioos.version, "audioOS", "beta", true); // audioOS 18 Beta
        // Public audioOS
        if (audioos) await fetch_other_updates(audiences.audioos_release, devices.audioos.build, devices.audioos.model, devices.audioos.prodtype, devices.audioos.version, "audioOS", "public", false); // audioOS Release

        // Beta tvOS
        if (tvos) await fetch_other_updates(audiences.tvos_15_beta, devices.tvos.build, devices.tvos.model, devices.tvos.prodtype, devices.tvos.version, "tvOS", "beta", true); // tvOS 15 Beta
        if (tvos) await fetch_other_updates(audiences.tvos_16_beta, devices.tvos.build, devices.tvos.model, devices.tvos.prodtype, devices.tvos.version, "tvOS", "beta", true); // tvOS 16 Beta
        if (tvos) await fetch_other_updates(audiences.tvos_17_beta, devices.tvos.build, devices.tvos.model, devices.tvos.prodtype, devices.tvos.version, "tvOS", "beta", true); // tvOS 17 Beta
        if (tvos) await fetch_other_updates(audiences.tvos_18_beta, devices.tvos.build, devices.tvos.model, devices.tvos.prodtype, devices.tvos.version, "tvOS", "beta", true); // tvOS 18 Beta
        // Public tvOS
        if (tvos) await fetch_other_updates(audiences.tvos_release, devices.tvos.build, devices.tvos.model, devices.tvos.prodtype, devices.tvos.version, "tvOS", "public", false); // tvOS Release
        
        global.BOT_STATUS = "Idling";
    };

    this.fetch_xml = async function () {
        global.BOT_STATUS = "Working";

        await fetch_macos_pkg(catalogs.macos_beta, true, 'beta_pkg');
        await fetch_macos_pkg(catalogs.macos_public, false, 'public_pkg');

        global.BOT_STATUS = "Idling";
    };
}