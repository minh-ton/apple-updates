// Fetch updates for each Apple OS

require('./main/manager.js')();
require('./error.js')();

// AssetAudiences
let macos_audience_public = "60b55e25-a8ed-4f45-826c-c1495a4ccc65";
let macos_audience_beta = "ca60afc6-5954-46fd-8cb9-60dde6ac39fd"; // macOS Big Sur
let macos_new_audience_beta = "298e518d-b45e-4d36-94be-34a63d6777ec"; // macOS Monterey

let ios_audience_public = "01c1d682-6e8f-4908-b724-5501fe3f5e5c";
let ios_audience_beta = "ce48f60c-f590-4157-a96f-41179ca08278";

let watchos_audience_public = "b82fcf9c-c284-41c9-8eb2-e69bf5a5269f";
let watchos_audience_beta = "b407c130-d8af-42fc-ad7a-171efea5a3d0";

let tvos_audience_public = "356d9da0-eee4-4c6c-bbe5-99b60eadddf0";
let tvos_audience_beta = "4d0dcdf7-12f2-4ebf-9672-ac4a4459a8bc";

let audioos_audience_public = "0322d49d-d558-4ddf-bdff-c0443d0e6fac";
let audioos_audience_beta = "58ff8d56-1d77-4473-ba88-ee1690475e40";

// Catalog XMLs
let macos_public_catalog = "https://swscan.apple.com/content/catalogs/others/index-11-10.15-10.14-10.13-10.12-10.11-10.10-10.9-mountainlion-lion-snowleopard-leopard.merged-1.sucatalog";
let macos_beta_catalog = "https://swscan.apple.com/content/catalogs/others/index-10.16beta-10.16-10.15-10.14-10.13-10.12-10.11-10.10-10.9-mountainlion-lion-snowleopard-leopard.merged-1.sucatalog"
let macos_new_public_catalog = "https://swscan.apple.com/content/catalogs/others/index-12-10.16-10.15-10.14-10.13-10.12-10.11-10.10-10.9-mountainlion-lion-snowleopard-leopard.merged-1.sucatalog";
let macos_new_beta_catalog = "https://swscan.apple.com/content/catalogs/others/index-12seed-12-10.16-10.15-10.14-10.13-10.12-10.11-10.10-10.9-mountainlion-lion-snowleopard-leopard.merged-1.sucatalog";

// Device info 

let ios_version = "15.0";
let ios_build = "19A346";
let ios_device = "iPhone13,4"; // iPhone 12 Pro Max
let ios_hw = "D54pAP";

let watchos_version = "8.0";
let watchos_build = "19R346";
let watch_device = "Watch6,4"; // Apple Watch Series 6
let watch_hw = "N158bAP";

let audioos_version = "15.0";
let audioos_build = "19J346";
let homepod_device = "AudioAccessory5,1"; // HomePod mini
let homepod_hw = "B520AP";

let tvos_version = "15.0";
let tvos_build = "19J346";
let tv_device = "AppleTV11,1"; // AppleTV 4k 2
let tv_hw = "J305AP";

module.exports = function () {
    this.fetch_gdmf = function (macos, ios, watchos, audioos, tvos) { // this massive number of args is used for debugging
        // Beta macOS
        if (macos) fetch_macos_updates(macos_audience_beta, 'beta', true);
        if (macos) fetch_macos_updates(macos_new_audience_beta, 'beta', true);
        // Public macOS
        if (macos) fetch_macos_updates(macos_audience_public, 'public', false);

        // Beta iOS
        if (ios) fetch_other_updates(ios_audience_beta, ios_build, ios_hw, ios_device, ios_version, "iOS", "beta", true);
        // Public iOS
        if (ios) fetch_other_updates(ios_audience_public, ios_build, ios_hw, ios_device, ios_version, "iOS", "public", false);

        // Beta watchOS
        if (watchos) fetch_other_updates(watchos_audience_beta, watchos_build, watch_hw, watch_device, watchos_version, "watchOS", "beta", true);
        // Public watchOS
        if (watchos) fetch_other_updates(watchos_audience_public, watchos_build, watch_hw, watch_device, watchos_version, "watchOS", "public", false);

        // Beta audioOS
        if (audioos) fetch_other_updates(audioos_audience_beta, audioos_build, homepod_hw, homepod_device, audioos_version, "audioOS", "beta", true);
        // Public audioOS
        if (audioos) fetch_other_updates(audioos_audience_public, audioos_build, homepod_hw, homepod_device, audioos_version, "audioOS", "public", false);

        // Beta tvOS
        if (tvos) fetch_other_updates(tvos_audience_beta, tvos_build, tv_hw, tv_device, tvos_version, "tvOS", "beta", true);
        // Public tvOS
        if (tvos) fetch_other_updates(tvos_audience_public, tvos_build, tv_hw, tv_device, tvos_version, "tvOS", "public", false);
    };

    this.fetch_xml = function () {
        // Beta macOS InstallAssistant.pkg
        fetch_macos_pkg(macos_beta_catalog, true, 'beta_pkg');
        fetch_macos_pkg(macos_new_beta_catalog, true, 'beta_pkg');
        // Public macOS InstallAssistant.pkg
        fetch_macos_pkg(macos_public_catalog, false, 'public_pkg');
        fetch_macos_pkg(macos_new_public_catalog, false, 'public_pkg');
    };
}