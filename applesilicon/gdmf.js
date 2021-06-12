// Fetch updates from Apple's Pallas server (gdmf.apple.com)
// Resource: https://gist.github.com/Siguza/0331c183c8c59e4850cd0b62fd501424

const axios = require('axios');
const firebase = require("firebase-admin");
const admzip = require('adm-zip');
const sanitizeHtml = require('sanitize-html');

require('./embed.js')();
require('./error.js')();

let db = firebase.firestore();

// Get updates documentation
function clean_response(res) {
    const clean = sanitizeHtml(res.replace(/(.|\n)*<body.*>/, '').replace(/<\/body(.|\n)*/g, ''), {
        allowedTags: ['li'],
    });
    var arr = clean.split("\r\n");

    for (var i = 0; i < arr.length; i++) arr[i] = arr[i].replace(/\t/g,"").replace(/<li>/g, "- ").replace(/<[^>]+>/g, '').trimStart();

    return arr.join('\n');
}

const get_changelog = async (audience, sudocumentationid) => {
    const res = await axios.post('https://gdmf.apple.com/v2/assets', {
        AssetAudience: audience,
        HWModelStr: "Mac-06F11F11946D27C5",
        SUDocumentationID: sudocumentationid,
        CertIssuanceDay: "2019-09-06",
        ClientVersion: 2,
        DeviceName: "Mac",
        AssetType: "com.apple.MobileAsset.SoftwareUpdateDocumentation",
    });

    var arr = res.data.split(".");
    let buff = new Buffer.from(arr[1], 'base64');
    let text = JSON.parse(buff.toString('utf8'));

    if (!text.Assets[0]) return "Documentation is not available."

    var file_url = `${text.Assets[0].__BaseURL}${text.Assets[0].__RelativePath}`;

    const file = await axios.request({
        method: 'GET',
        url: file_url,
        responseType: 'arraybuffer',
        responseEncoding: null,
    });

    var zip = new admzip(file.data);
    var zipEntries = zip.getEntries();

    let changelog = zipEntries.map(function(entry) {
        if (entry.entryName == "AssetData/en.lproj/ReadMeSummary.html") return entry;
    }).filter(function(entry) { return entry; })[0];

    return clean_response(zip.readAsText(changelog));
}   

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
                let changelog = await get_changelog(assetaud, updateid);

                if (changelog == undefined) changelog = "Documentation is not available.";
                
                (beta) ? update_name(updateid, version, "macOS").then(function (sudocumentationid) {
                    send_macos_beta(version, build, size, sudocumentationid, changelog);
                }) : send_macos_public(version, build, size, changelog);

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