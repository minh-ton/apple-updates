// Fetch updates from Apple's Pallas server (gdmf.apple.com)
// Resource: https://gist.github.com/Siguza/0331c183c8c59e4850cd0b62fd501424

const axios = require('axios');
const firebase = require("firebase-admin");

require('./embed.js')();
require('./error.js')();
require('./doc.js')();
require('./misc.js')();

const asset_type = {
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

let db = firebase.firestore();

module.exports = function () {
    this.fetch_macos_ota = async function (assetaud, dname, beta) {
        axios.post('https://gdmf.apple.com/v2/assets', {
            AssetAudience: assetaud,
            HWModelStr: "Mac-06F11F11946D27C5",
            CertIssuanceDay: "2019-09-06",
            ClientVersion: 2,
            AssetType: "com.apple.MobileAsset.MacSoftwareUpdate"
        }).then(async res => {
            var arr = res.data.split(".");
            let buff = new Buffer.from(arr[1], 'base64');
            let text = JSON.parse(buff.toString('utf8'));

            const macos_database = db.collection("macos").doc(dname);
            const macos_data = await macos_database.get();
            const macos_build_array = macos_data.data();

            var updates = [];
            for (let build in macos_build_array) updates.push(build);

            if (!updates.includes(text.Assets[0].Build)) {

                // Send message here
                let pkgurl = `${text.Assets[0].__BaseURL}${text.Assets[0].__RelativePath}`;
                let version = text.Assets[0].OSVersion;
                let build = text.Assets[0].Build;
                let size = text.Assets[0]._DownloadSize;
                let updateid = text.Assets[0].SUDocumentationID;

                var changelog;

                // Boring beta release notes, so it's better to not to include that
                if (!beta) {
                    changelog = await get_changelog(assetaud, "Mac-06F11F11946D27C5", updateid, "Mac", "com.apple.MobileAsset.SoftwareUpdateDocumentation");
                    if (changelog == undefined) changelog = "Release note is not available.";
                }

                (beta) ? send_macos_beta(version, build, size, formatUpdatesName(updateid, version, "macOS")) : send_macos_public(version, build, size, changelog);

                send_macos_delta(pkgurl, version, build, beta)

                db.collection("macos").doc(dname).update({
                    [`${text.Assets[0].Build}`]: `${text.Assets[0].Build}`
                }).catch(err => {
                    send_error(err, "gdmf.js", `fetch_macos_ota`, `adding new build number to the database`);
                });
            }
        }).catch(function (error) {
            send_error(error, "gdmf.js", `fetch_macos_ota`, `politely asking gdmf.apple.com for updates`);
        });
    };

    this.fetch_other_updates = async function (assetaud, build, hwm, prodtype, prodversion, cname, dname, beta) {
        axios.post('https://gdmf.apple.com/v2/assets', {
            AssetAudience: assetaud,
            CertIssuanceDay: "2020-09-29",
            ClientVersion: 2,
            AssetType: "com.apple.MobileAsset.SoftwareUpdate",
            BuildVersion: build,
            HWModelStr: hwm,
            ProductType: prodtype,
            ProductVersion: prodversion,
        }).then(async res => {
            var arr = res.data.split(".");
            let buff = new Buffer.from(arr[1], 'base64');
            let text = JSON.parse(buff.toString('utf8'));

            const os_database = db.collection(cname.toLowerCase()).doc(dname);
            const os_data = await os_database.get();
            const os_build_array = os_data.data();

            var updates = [];
            for (let build in os_build_array) updates.push(build);

            if (!updates.includes(text.Assets[0].Build)) {
                // Send message here
                let version = text.Assets[0].OSVersion.replace('9.9.', ''); // remove 9.9. in ota updates version
                let build = text.Assets[0].Build;
                let size = text.Assets[0]._DownloadSize;
                let updateid = text.Assets[0].SUDocumentationID;

                var changelog;

                // Boring beta release notes, so it's better to not to include that
                if (!beta) {
                    if (cname.toLowerCase() == "tvos") {
                        changelog = undefined;
                    } else {
                        changelog = await get_changelog(assetaud, hwm, updateid, device_name[cname.toLowerCase()], asset_type[cname.toLowerCase()]);
                    }
                    if (changelog == undefined) changelog = "Release note is not available.";
                }

                if (beta) {
                    // Beta
                    send_other_beta_updates(cname, version, build, size, formatUpdatesName(updateid, version, cname));
                    // Merge iOS & iPadOS
                    if (cname.toLowerCase() === "ios") {
                        send_other_beta_updates('iPadOS', version, build, size, formatUpdatesName(updateid, version, cname));
                    }
                } else {
                    // Public
                    send_other_updates(cname, version, build, size, changelog);
                    // Merge iOS & iPadOS
                    if (cname.toLowerCase() === "ios") {
                        changelog = await get_changelog(assetaud, "J523xAP", updateid.replace('iOS', 'iPadOS'), "iPad", asset_type[cname.toLowerCase()]);
                        send_other_updates('iPadOS', version, build, size, changelog);
                    }
                }

                db.collection(cname.toLowerCase()).doc(dname).update({
                    [`${text.Assets[0].Build}`]: `${text.Assets[0].Build}`
                }).catch(err => {
                    send_error(err, "gdmf.js", `fetch_other_updates - ${cname} ${dname}`, `adding new build number to the database`);
                });
            }
        }).catch(function (error) {
            send_error(error, "gdmf.js", `fetch_other_updates - ${cname} ${dname}`, `politely asking gdmf.apple.com for updates`);
        });
    };
};