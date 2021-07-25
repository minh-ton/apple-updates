// Fetch updates for each Apple OS

require('./main/manager.js')();
require('./error.js')();

// AssetAudiences
let macos_audience_public = "60b55e25-a8ed-4f45-826c-c1495a4ccc65";
let macos_audience_beta = "ca60afc6-5954-46fd-8cb9-60dde6ac39fd";
let macos_new_audience_beta = "298e518d-b45e-4d36-94be-34a63d6777ec"; // macOS Monterey

let ios_audience_public = "01c1d682-6e8f-4908-b724-5501fe3f5e5c";
let ios_audience_beta = "84da8706-e267-4554-8207-865ae0c3a120";
let ios_new_audience_beta = "ce48f60c-f590-4157-a96f-41179ca08278"; // iOS 15

let watchos_audience_public = "b82fcf9c-c284-41c9-8eb2-e69bf5a5269f";
let watchos_audience_beta = "ff6df985-3cbe-4d54-ba5f-50d02428d2a3";
let watchos_new_audience_beta = "b407c130-d8af-42fc-ad7a-171efea5a3d0"; // watchOS 8

let tvos_audience_public = "356d9da0-eee4-4c6c-bbe5-99b60eadddf0";
let tvos_audience_beta = "65254ac3-f331-4c19-8559-cbe22f5bc1a6";
let tvos_new_audience_beta = "4d0dcdf7-12f2-4ebf-9672-ac4a4459a8bc"; // tvOS 15

let audioos_audience_public = "0322d49d-d558-4ddf-bdff-c0443d0e6fac";
let audioos_audience_beta = "b05ddb59-b26d-4c89-9d09-5fda15e99207";
let audioos_new_audience_beta = "58ff8d56-1d77-4473-ba88-ee1690475e40"; // audioOS 15

// Catalog XMLs
let macos_public_catalog = "https://swscan.apple.com/content/catalogs/others/index-11-10.15-10.14-10.13-10.12-10.11-10.10-10.9-mountainlion-lion-snowleopard-leopard.merged-1.sucatalog";
let macos_beta_catalog = "https://swscan.apple.com/content/catalogs/others/index-10.16beta-10.16-10.15-10.14-10.13-10.12-10.11-10.10-10.9-mountainlion-lion-snowleopard-leopard.merged-1.sucatalog"
let macos_new_beta_catalog = "https://swscan.apple.com/content/catalogs/others/index-12seed-12-10.16-10.15-10.14-10.13-10.12-10.11-10.10-10.9-mountainlion-lion-snowleopard-leopard.merged-1.sucatalog"; // macOS Monterey

// Device info 

let ios_version = "14.5.1";
let ios_build = "18E212";
let ios_device = "iPhone13,4"; // iPhone 12 Pro Max
let ios_hw = "D54pAP";

let watchos_version = "7.4";
let watchos_build = "18T195";
let watch_device = "Watch6,4"; // Apple Watch Series 6
let watch_hw = "N158bAP";

let audioos_version = "14.5";
let audioos_build = "18L203";
let homepod_device = "AudioAccessory5,1"; // HomePod mini
let homepod_hw = "B520AP";

let tvos_version = "14.5";
let tvos_build = "18L204";
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
        if (ios) fetch_other_updates(ios_new_audience_beta, ios_build, ios_hw, ios_device, ios_version, "iOS", "beta", true);
        // Public iOS
        if (ios) fetch_other_updates(ios_audience_public, ios_build, ios_hw, ios_device, ios_version, "iOS", "public", false);

        // Beta watchOS
        if (watchos) fetch_other_updates(watchos_audience_beta, watchos_build, watch_hw, watch_device, watchos_version, "watchOS", "beta", true);
        if (watchos) fetch_other_updates(watchos_new_audience_beta, watchos_build, watch_hw, watch_device, watchos_version, "watchOS", "beta", true);
        // Public watchOS
        if (watchos) fetch_other_updates(watchos_audience_public, watchos_build, watch_hw, watch_device, watchos_version, "watchOS", "public", false);

        // Beta audioOS
        if (audioos) fetch_other_updates(audioos_audience_beta, audioos_build, homepod_hw, homepod_device, audioos_version, "audioOS", "beta", true);
        if (audioos) fetch_other_updates(audioos_new_audience_beta, audioos_build, homepod_hw, homepod_device, audioos_version, "audioOS", "beta", true);
        // Public audioOS
        if (audioos) fetch_other_updates(audioos_audience_public, audioos_build, homepod_hw, homepod_device, audioos_version, "audioOS", "public", false);

        // Beta tvOS
        if (tvos) fetch_other_updates(tvos_audience_beta, tvos_build, tv_hw, tv_device, tvos_version, "tvOS", "beta", true);
        if (tvos) fetch_other_updates(tvos_new_audience_beta, tvos_build, tv_hw, tv_device, tvos_version, "tvOS", "beta", true);
        // Public tvOS
        if (tvos) fetch_other_updates(tvos_audience_public, tvos_build, tv_hw, tv_device, tvos_version, "tvOS", "public", false);
    };

    this.fetch_xml = function () {
        // Beta macOS InstallAssistant.pkg
        fetch_macos_pkg(macos_beta_catalog, true, 'beta_pkg');
        fetch_macos_pkg(macos_new_beta_catalog, true, 'beta_pkg');
        // Public macOS InstallAssistant.pkg
        fetch_macos_pkg(macos_public_catalog, false, 'public_pkg');
    };

    this.get_os_assets = async function (m) {
                
        await m.edit(`Getting macOS Updates...`);
        // Beta macOS
        let macos_beta_data = await get_macos_assets(macos_audience_beta, true); 
        let macos_beta_new_data = await get_macos_assets(macos_new_audience_beta, true);
        // Public macOS
        let macos_public_data = await get_macos_assets(macos_audience_public, false);

        await m.edit(`Getting iOS & iPadOS Updates...`);
        // Beta iOS
        let ios_beta_data = await get_other_assets(ios_audience_beta, ios_build, ios_hw, ios_device, ios_version, "iOS", "beta", true);
        let ios_beta_new_data = await get_other_assets(ios_new_audience_beta, ios_build, ios_hw, ios_device, ios_version, "iOS", "beta", true);
        // Public iOS
        let ios_public_data = await get_other_assets(ios_audience_public, ios_build, ios_hw, ios_device, ios_version, "iOS", "public", false);

        await m.edit(`Getting watchOS Updates...`);
        // Beta watchOS
        let watchos_beta_data = await get_other_assets(watchos_audience_beta, watchos_build, watch_hw, watch_device, watchos_version, "watchOS", "beta", true);
        let watchos_beta_new_data = await get_other_assets(watchos_new_audience_beta, watchos_build, watch_hw, watch_device, watchos_version, "watchOS", "beta", true);
        // Public watchOS
        let watchos_public_data = await get_other_assets(watchos_audience_public, watchos_build, watch_hw, watch_device, watchos_version, "watchOS", "public", false);

        await m.edit(`Getting audioOS Updates...`);
        // Beta audioOS
        let audioos_beta_data = await get_other_assets(audioos_audience_beta, audioos_build, homepod_hw, homepod_device, audioos_version, "audioOS", "beta", true);
        let audioos_beta_new_data = await get_other_assets(audioos_new_audience_beta, audioos_build, homepod_hw, homepod_device, audioos_version, "audioOS", "beta", true);
        // Public audioOS
        let audioos_public_data = await get_other_assets(audioos_audience_public, audioos_build, homepod_hw, homepod_device, audioos_version, "audioOS", "public", false);

        await m.edit(`Getting tvOS Updates...`);
        // Beta tvOS
        let tvos_beta_data = await get_other_assets(tvos_audience_beta, tvos_build, tv_hw, tv_device, tvos_version, "tvOS", "beta", true);
        let tvos_beta_new_data = await get_other_assets(tvos_new_audience_beta, tvos_build, tv_hw, tv_device, tvos_version, "tvOS", "beta", true);
        // Public tvOS
        let tvos_public_data = await get_other_assets(tvos_audience_public, tvos_build, tv_hw, tv_device, tvos_version, "tvOS", "public", false);

        await m.edit(`Getting macOS Full Installer Packages...`);
        // Beta macOS InstallAssistant.pkg
        let pkg_beta_data = await get_pkg_assets(macos_beta_catalog, 'beta_pkg');
        let pkg_beta_new_data = await get_pkg_assets(macos_new_beta_catalog, 'beta_pkg');
        // Public macOS InstallAssistant.pkg
        let pkg_public_data = await get_pkg_assets(macos_public_catalog, 'public_pkg');

        let assets = {
            macos_beta: macos_beta_data,
            macos_beta_new: macos_beta_new_data,
            macos_public: macos_public_data,
            ios_beta: ios_beta_data,
            ios_beta_new: ios_beta_new_data,
            ios_public: ios_public_data,
            watchos_beta: watchos_beta_data,
            watchos_beta_new: watchos_beta_new_data,
            watchos_public: watchos_public_data,
            audioos_beta: audioos_beta_data,
            audioos_beta_new: audioos_beta_new_data,
            audioos_public: audioos_public_data,
            tvos_beta: tvos_beta_data,
            tvos_beta_new: tvos_beta_new_data,
            tvos_public: tvos_public_data,
            pkg_beta: pkg_beta_data,
            pkg_beta_new: pkg_beta_new_data,
            pkg_public: pkg_public_data
        }

        return assets;
    }
}