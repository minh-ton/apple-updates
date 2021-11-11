// Fetch updates from Apple's Pallas server (gdmf.apple.com)

const axios = require('axios');

require('../error.js')();
require('./doc.js')();

const doc_asset_type = {
    ios: "com.apple.MobileAsset.SoftwareUpdateDocumentation",
    ipados: "com.apple.MobileAsset.SoftwareUpdateDocumentation",
    audioos: "com.apple.MobileAsset.SoftwareUpdateDocumentation",
    watchos: "com.apple.MobileAsset.WatchSoftwareUpdateDocumentation"
}

const device_name = {
    ios: "iPhone",
    ipados: "iPad",
    audioos: "AudioAccessory",
    watchos: "Watch"
}

module.exports = function () {
    this.gdmf_macos = async function (assetaud, beta) {
        const res = await axios.post('https://gdmf.apple.com/v2/assets', {
            AssetAudience: assetaud,
            HWModelStr: "Mac-06F11F11946D27C5",
            CertIssuanceDay: "2019-09-06",
            ClientVersion: 2,
            AssetType: "com.apple.MobileAsset.MacSoftwareUpdate"
        }).catch(function (error) {
            return send_error(error, "gdmf.js", `gdmf_macos`, `politely asking gdmf.apple.com for updates`);
        });

        if (!res.data) return send_error("No data available.", "gdmf.js", `gdmf_macos`, `politely asking gdmf.apple.com for updates`);

        var arr = res.data.split(".");
        let buff = new Buffer.from(arr[1], 'base64');
        let text = JSON.parse(buff.toString('utf8'));

        let data = [];

        for (let asset in text.Assets) {
            if (!text.Assets[asset]) {
                return send_error(`Missing text.Asset[${asset}]`, "gdmf.js", `gdmf_macos`, `update not available for ${assetaud}.`);
            }
    
            var changelog;
    
            if (!beta) changelog = await get_changelog(assetaud, "Mac-06F11F11946D27C5", text.Assets[asset].SUDocumentationID, "Mac", "com.apple.MobileAsset.SoftwareUpdateDocumentation");

            if (changelog == undefined) changelog = "Release note is not available.";
    
            let mac_update = {
                mac_pkg: `${text.Assets[asset].__BaseURL}${text.Assets[asset].__RelativePath}`,
                mac_version: text.Assets[asset].OSVersion,
                mac_build: text.Assets[asset].Build,
                mac_size: text.Assets[asset]._DownloadSize,
                mac_updateid: text.Assets[asset].SUDocumentationID,
                mac_changelog: changelog
            }

            data.push(mac_update);
        }

        return data;
    };

    this.gdmf_other = async function (assetaud, build, hwm, prodtype, prodversion, cname, dname, beta) {
        const res = await axios.post('https://gdmf.apple.com/v2/assets', {
            AssetAudience: assetaud,
            CertIssuanceDay: "2020-09-29",
            ClientVersion: 2,
            AssetType: "com.apple.MobileAsset.SoftwareUpdate",
            BuildVersion: build,
            HWModelStr: hwm,
            ProductType: prodtype,
            ProductVersion: prodversion,
        }).catch(function (error) {
            return send_error(error, "gdmf.js", `fetch_other_updates - ${cname} ${dname}`, `politely asking gdmf.apple.com for updates`);
        });

        if (!res.data) return send_error("No data available.", "gdmf.js", `fetch_other_updates - ${cname} ${dname}`, `politely asking gdmf.apple.com for updates`);;

        var arr = res.data.split(".");
        let buff = new Buffer.from(arr[1], 'base64');
        let text = JSON.parse(buff.toString('utf8'));

        if (!text.Assets[0]) {
            return send_error(`Missing text.Asset[0]`, "gdmf.js", `gdmf_other`, `update not available for ${assetaud}.`);
        }

        var changelog;

        if (!beta) {
            (cname.toLowerCase() == "tvos") ? changelog = undefined : changelog = await get_changelog(assetaud, hwm, text.Assets[0].SUDocumentationID, device_name[cname.toLowerCase()], doc_asset_type[cname.toLowerCase()]);
        }

        if (changelog == undefined) changelog = "Release note is not available.";

        let os_update = {
            os_version: text.Assets[0].OSVersion.replace('9.9.', ''),
            os_build: text.Assets[0].Build,
            os_size: text.Assets[0]._DownloadSize,
            os_updateid: text.Assets[0].SUDocumentationID,
            os_changelog: changelog
        }

        return os_update;
    };
};