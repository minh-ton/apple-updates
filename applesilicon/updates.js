// Fetch updates for each Apple OS

require('./gdmf.js')();
require('./xml.js')();
require('./error.js')();

// Device info
let macos_audience_public = "60b55e25-a8ed-4f45-826c-c1495a4ccc65";
let macos_audience_beta = "ca60afc6-5954-46fd-8cb9-60dde6ac39fd";
let ios_audience_public = "01c1d682-6e8f-4908-b724-5501fe3f5e5c";
let ios_audience_beta = "84da8706-e267-4554-8207-865ae0c3a120";
let watchos_audience_public = "b82fcf9c-c284-41c9-8eb2-e69bf5a5269f";
let watchos_audience_beta = "ff6df985-3cbe-4d54-ba5f-50d02428d2a3";
let tvos_audience_public = "356d9da0-eee4-4c6c-bbe5-99b60eadddf0";
let tvos_audience_beta = "65254ac3-f331-4c19-8559-cbe22f5bc1a6";
let audioos_audience_public = "0322d49d-d558-4ddf-bdff-c0443d0e6fac";
let audioos_audience_beta = "b05ddb59-b26d-4c89-9d09-5fda15e99207";

// Catalog XMLs
let macos_public_catalog = "https://swscan.apple.com/content/catalogs/others/index-11-10.15-10.14-10.13-10.12-10.11-10.10-10.9-mountainlion-lion-snowleopard-leopard.merged-1.sucatalog";
let macos_beta_catalog = "https://swscan.apple.com/content/catalogs/others/index-10.16beta-10.16-10.15-10.14-10.13-10.12-10.11-10.10-10.9-mountainlion-lion-snowleopard-leopard.merged-1.sucatalog"

let ios_version = "14.4.1";
let ios_build = "18D61";
let ios_device = "iPhone13,4"; // iPhone 12 Pro Max
let ios_hw = "D54pAP";

// let ipados_device = "iPad13,11"; // iPad Pro 5 (12.9")
// let ipados_hw = "J523xAP"

let watchos_version = "7.3.3";
let watchos_build = "18S830";
let watch_device = "Watch6,4"; // Apple Watch Series 6
let watch_hw = "N158bAP";

let audioos_version = "14.4";
let audioos_build = "18K802";
let homepod_device = "AudioAccessory5,1"; // HomePod mini
let homepod_hw = "B520AP";

let tvos_version = "14.4";
let tvos_build = "18K802";
let tv_device = "AppleTV11,1"; // AppleTV 4k 2
let tv_hw = "J305AP";

module.exports = function () {
    this.fetch_gdmf = function (macos, ios, watchos, audioos, tvos) { // this massive number of paramemters is used for debugging
        send_log(`fetch_gdmf`, `Fetching macOS OTA Updates...`, `#f07700`);
        // Beta macOS
        if (macos) fetch_macos_ota(macos_audience_beta, 'beta', true);
        // Public macOS
        if (macos) fetch_macos_ota(macos_audience_public, 'public', false);

        send_log(`fetch_gdmf`, `Fetching iOS/iPadOS OTA Updates...`, `#f07700`);
        // Beta iOS
        if (ios) fetch_other_updates(ios_audience_beta, ios_build, ios_hw, ios_device, ios_version, "iOS", "beta", true);
        // Public iOS
        if (ios) fetch_other_updates(ios_audience_public, ios_build, ios_hw, ios_device, ios_version, "iOS", "public", false);

        send_log(`fetch_gdmf`, `Fetching watchOS OTA Updates...`, `#f07700`);
        // Beta watchOS
        if (watchos) fetch_other_updates(watchos_audience_beta, watchos_build, watch_hw, watch_device, watchos_version, "watchOS", "beta", true);
        // Public watchOS
        if (watchos) fetch_other_updates(watchos_audience_public, watchos_build, watch_hw, watch_device, watchos_version, "watchOS", "public", false);

        send_log(`fetch_gdmf`, `Fetching audioOS OTA Updates...`, `#f07700`);
        // Beta audioOS
        if (audioos) fetch_other_updates(audioos_audience_beta, audioos_build, homepod_hw, homepod_device, audioos_version, "audioOS", "beta", true);
        // Public audioOS
        if (audioos) fetch_other_updates(audioos_audience_public, audioos_build, homepod_hw, homepod_device, audioos_version, "audioOS", "public", false);

        send_log(`fetch_gdmf`, `Fetching tvOS OTA Updates...`, `#f07700`);
        // Beta tvOS
        if (tvos) fetch_other_updates(tvos_audience_beta, tvos_build, tv_hw, tv_device, tvos_version, "tvOS", "beta", true);
        // Public tvOS
        if (tvos) fetch_other_updates(tvos_audience_public, tvos_build, tv_hw, tv_device, tvos_version, "tvOS", "public", false);
    };

    this.fetch_xml = function () {
        send_log(`fetch_xml`, `Fetching InstallAssistant.pkg...`, `#1c95e0`);
        // Beta macOS InstallAssistant.pkg
        fetch_macos_pkg(macos_beta_catalog, true, 'beta_pkg');
        // Public macOS InstallAssistant.pkg
        fetch_macos_pkg(macos_public_catalog, false, 'public_pkg');
    };
}