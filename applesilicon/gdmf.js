// Fetch updates from Apple's Pallas server (gdmf.apple.com)
// Resource: https://gist.github.com/Siguza/0331c183c8c59e4850cd0b62fd501424

const axios = require('axios');
const firebase = require("firebase-admin");

require('./embed.js')();
require('./error.js')();

let db = firebase.firestore();

// Format the update name
// It's still buggy, but IT JUST WORKS
async function update_name(updateid, version, cname) {
    if (cname.toLowerCase() === "tvos") {
        return updateid;
    } // tvOS SUDocumentationID is always "Prelease", so I just return back the old value anyways...
    if (version.endsWith(".0")) version = version.substring(0, version.length - 2); // for macOS 12.0
    let name_prefix = cname + version.replace('.', '');
    var document_id = updateid.replace(name_prefix, '').replace(version.replace('.', ''), ''); // workaround for audioOS

    if (!document_id.includes('Long') && !document_id.includes('Short') && !document_id.includes('RC')) {
        // Get the beta number (iOS145Beta1 => Beta 1)
        let beta_name = `Beta ${parseInt(document_id.replace(/[^0-9]/g, ""))}`;
        return beta_name;
    } else {
        // This is much more complicated, to number RC updates
        return db.collection("other").doc("updates_count").get().then(doc => {
            let stuff = doc.data()[`${updateid}`];
            if (stuff) {
                return db.collection("other").doc("updates_count").update({
                    [`${updateid}`]: `${parseInt(stuff) + 1}`
                }).then(() => {
                    if (document_id.includes('RC')) return `RC ${stuff}`;
                    if (document_id.includes("Long") || document_id.includes("Short")) {
                        return `RC ${stuff}`;
                    }
                }).catch(err => {
                    send_error(err, "gdmf.js", `update_name`, `number a RC update - increasing update number in the database by 1`);
                });
            } else {
                return db.collection("other").doc("updates_count").update({
                    [`${updateid}`]: `2`
                }).then(() => {
                    if (document_id.includes('RC')) return `RC`;
                    if (document_id.includes("Long") || document_id.includes("Short")) {
                        return `RC`;
                    }
                }).catch(err => {
                    send_error(err, "gdmf.js", `update_name`, `number a RC update for the first time - adding 2 to the database`);
                });
            }
        }).catch(err => {
            send_error(err, "gdmf.js", `update_name`, `get the RC update number from the database before processing`);
        });
    }
}

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

                (beta) ? update_name(updateid, version, "macOS").then(function (sudocumentationid) {
                    send_macos_beta(version, build, size, sudocumentationid);
                }) : send_macos_public(version, build, size);

                send_macos_delta(pkgurl, version, build)

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

                if (beta) {
                    update_name(updateid, version, cname).then(function (sudocumentationid) {
                        send_other_beta_updates(cname, version, build, size, sudocumentationid);
                        // Merge iOS & iPadOS
                        if (cname.toLowerCase() === "ios") send_other_beta_updates('iPadOS', version, build, size, sudocumentationid);
                    });
                } else {
                    send_other_updates(cname, version, build, size);
                    // Merge iOS & iPadOS
                    if (cname.toLowerCase() === "ios") send_other_updates('iPadOS', version, build, size);
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