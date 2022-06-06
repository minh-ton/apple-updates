// Fetch updates for each Apple OS

const devices = require("../bootrom/devices.json");
const catalogs = require("../bootrom/catalogs.json");
const audiences = require("../bootrom/audiences.json");

require('./main/manager.js')();
require('./error.js')();

module.exports = function () {
    this.fetch_gdmf = async function (macos, ios, ipados, watchos, audioos, tvos) { // for debugging purposes
        global.BOT_STATUS = "Working";

        // Beta macOS
        if (macos) await fetch_macos_updates(audiences.macos_11_beta, 'beta', true); // macOS Big Sur Beta
        if (macos) await fetch_macos_updates(audiences.macos_12_beta, 'beta', true); // macOS Monterey Beta
        // Public macOS
        if (macos) await fetch_macos_updates(audiences.macos_release, 'public', false); // macOS Release

        // Beta iOS
        if (ios) await fetch_other_updates(audiences.ios_15_beta, devices.ios.build, devices.ios.model, devices.ios.prodtype, devices.ios.version, "iOS", "beta", true); // iOS 15 Beta
        // Public iOS
        if (ios) await fetch_other_updates(audiences.ios_release, devices.ios.build, devices.ios.model, devices.ios.prodtype, devices.ios.version, "iOS", "public", false); // iOS Release
        if (ios) await fetch_other_updates(audiences.ios_14_security, "18F72", devices.ios.model, devices.ios.prodtype, "14.6", "iOS", "public", false); // iOS 14 Security Updates

        // Beta iPadOS
        if (ipados) await fetch_other_updates(audiences.ios_15_beta, devices.ipados.build, devices.ipados.model, devices.ipados.prodtype, devices.ipados.version, "iPadOS", "beta", true); // iPadOS 15 Beta
        // Public iPadOS
        if (ipados) await fetch_other_updates(audiences.ios_release, devices.ipados.build, devices.ipados.model, devices.ipados.prodtype, devices.ipados.version, "iPadOS", "public", false); // iPadOS Release
        if (ipados) await fetch_other_updates(audiences.ios_14_security, "18F72", devices.ipados.model, devices.ipados.prodtype, "14.6", "iPadOS", "public", false); // iPadOS 14 Security Updates

        // Beta watchOS
        if (watchos) await fetch_other_updates(audiences.watchos_8_beta, devices.watchos.build, devices.watchos.model, devices.watchos.prodtype, devices.watchos.version, "watchOS", "beta", true); // watchOS 8 Beta
        // Public watchOS
        if (watchos) await fetch_other_updates(audiences.watchos_release, devices.watchos.build, devices.watchos.model, devices.watchos.prodtype, devices.watchos.version, "watchOS", "public", false); // watchOS Release

        // Beta audioOS
        if (audioos) await fetch_other_updates(audiences.audioos_15_beta, devices.audioos.build, devices.audioos.model, devices.audioos.prodtype, devices.audioos.version, "audioOS", "beta", true); // audioOS 15 Beta
        // Public audioOS
        if (audioos) await fetch_other_updates(audiences.audioos_release, devices.audioos.build, devices.audioos.model, devices.audioos.prodtype, devices.audioos.version, "audioOS", "public", false); // audioOS Release

        // Beta tvOS
        if (tvos) await fetch_other_updates(audiences.tvos_15_beta, devices.tvos.build, devices.tvos.model, devices.tvos.prodtype, devices.tvos.version, "tvOS", "beta", true); // tvOS 15 Beta
        // Public tvOS
        if (tvos) await fetch_other_updates(audiences.tvos_release, devices.tvos.build, devices.tvos.model, devices.tvos.prodtype, devices.tvos.version, "tvOS", "public", false); // tvOS Release
        
        global.BOT_STATUS = "Idling";
    };

    this.fetch_xml = async function () {
        global.BOT_STATUS = "Working";

        // Beta macOS InstallAssistant.pkg
        await fetch_macos_pkg(catalogs.macos_11_beta, true, 'beta_pkg');
        await fetch_macos_pkg(catalogs.macos_12_beta, true, 'beta_pkg');
        // Public macOS InstallAssistant.pkg
        await fetch_macos_pkg(catalogs.macos_11_public, false, 'public_pkg');
        await fetch_macos_pkg(catalogs.macos_12_public, false, 'public_pkg');

        global.BOT_STATUS = "Idling";
    };
}