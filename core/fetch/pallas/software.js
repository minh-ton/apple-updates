// Fetch updates from Apple's Pallas server (gdmf.apple.com)

const http = require('http'); 
const https = require('https');
const axios = require('axios');

const axiosInstance = axios.create({
    timeout: 15000,
    maxRedirects: 5,
    httpAgent: new http.Agent({ 
        keepAlive: true,
        maxSockets: 10,
        keepAliveMsecs: 30000
    }),
    httpsAgent: new https.Agent({ 
        keepAlive: true,
        maxSockets: 10,
        keepAliveMsecs: 30000
    })
});

require('../../utils/error.js')();
require('./documentation.js')();

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
    this.get_pallas_updates = async function (osType, assetaud, build, hwm, prodtype, prodversion, beta, cname = null, dname = null) {
        const isMacOS = osType.toLowerCase() === 'macos';
        const assetType = isMacOS ? "com.apple.MobileAsset.MacSoftwareUpdate" : "com.apple.MobileAsset.SoftwareUpdate";
        
        const res = await axiosInstance.post('https://gdmf.apple.com/v2/assets', {
            AssetAudience: assetaud,
            CertIssuanceDay: "2020-09-29",
            ClientVersion: 2,
            AssetType: assetType,
            BuildVersion: build,
            HWModelStr: hwm,
            ProductType: prodtype,
            ProductVersion: prodversion,
        }).catch(function (error) {
            const context = isMacOS ? `get_pallas_updates macos` : `get_pallas_updates ${cname} ${dname}`;
            return log_error(error, "software.js", context, `politely asking gdmf.apple.com for updates`);
        });

        if (!res) {
            const context = isMacOS ? `get_pallas_updates macos` : `get_pallas_updates ${cname} ${dname}`;
            return log_error("No data available.", "software.js", context, `politely asking gdmf.apple.com for updates`);
        }

        var arr = res.data.split(".");
        let buff = new Buffer.from(arr[1], 'base64');
        let text = JSON.parse(buff.toString('utf8'));
        
        if (isMacOS) {
            let data = [];

            for (let asset in text.Assets) {
                if (!text.Assets[asset]) {
                    return log_error(`Missing text.Asset[${asset}]`, "software.js", `get_pallas_updates macos`, `update not available for ${assetaud}.`);
                }
        
                var changelog;
        
                if (!beta) changelog = await get_documentation(assetaud, hwm, text.Assets[asset].SUDocumentationID, "Mac", "com.apple.MobileAsset.SoftwareUpdateDocumentation");

                if (changelog == undefined) changelog = "Release note is not available.";
        
                let mac_update = {
                    mac_pkg: `${text.Assets[asset].__BaseURL}${text.Assets[asset].__RelativePath}`,
                    mac_version: text.Assets[asset].OSVersion,
                    mac_build: text.Assets[asset].Build,
                    mac_size: text.Assets[asset]._DownloadSize,
                    mac_updateid: text.Assets[asset].SUDocumentationID,
                    mac_changelog: changelog,
                    mac_postdate: text.PostingDate,
                    mac_raw_response: JSON.stringify(text.Assets[asset])
                }

                data.push(mac_update);
            }

            return data;
        } else {
            if (!text.Assets[0]) {
                return log_error(`Missing text.Asset[0]`, "software.js", `get_pallas_updates ${cname}`, `update not available for ${assetaud}.`);
            }
            
            var changelog;

            if (!beta) {
                (cname.toLowerCase() == "tvos") ? changelog = undefined : changelog = await get_documentation(assetaud, hwm, text.Assets[0].SUDocumentationID, device_name[cname.toLowerCase()], doc_asset_type[cname.toLowerCase()]);
            }

            if (changelog == undefined) changelog = "Release note is not available.";

            let os_update = {
                os_version: text.Assets[0].OSVersion.replace('9.9.', ''),
                os_build: text.Assets[0].Build,
                os_size: text.Assets[0]._DownloadSize,
                os_updateid: text.Assets[0].SUDocumentationID,
                os_changelog: changelog,
                os_postdate: text.PostingDate,
                os_raw_response: JSON.stringify(text.Assets[0])
            }

            return os_update;
        }
    };
};