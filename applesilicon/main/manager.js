// Monitor the updates check process.

const firebase = require("firebase-admin");

require('../embed.js')();
require('../error.js')();
require('../misc.js')();
require('./doc.js')();
require('./gdmf.js')();
require('./xml.js')();

let db = firebase.firestore();

module.exports = function () {
    this.fetch_macos_updates = async function (assetaud, dname, beta) {
        let mac_update = await gdmf_macos(assetaud, beta);

        if (!mac_update || mac_update.length == 0) return send_error(`No asset available.`, "manager.js", `fetch_macos_ota`, `update not available for ${assetaud}.`);

        for (let item in mac_update) {
            const macos_database = db.collection("macos").doc(dname);
            const macos_data = await macos_database.get();
            const macos_build_array = macos_data.data();

            var updates = [];
            for (let build in macos_build_array) updates.push(build);

            const version = mac_update[item]['mac_version'];
            const size = mac_update[item]['mac_size'];
            const build = mac_update[item]['mac_build'];
            const updateid = mac_update[item]['mac_updateid'];
            const changelog = mac_update[item]['mac_changelog'];

            if (updates.includes(build)) return;

            (beta) ? send_macos_beta(version, build, size, formatUpdatesName(updateid, version, "macOS")) : send_macos_public(version, build, size, changelog);

            db.collection("macos").doc(dname).update({
                [`${build}`]: `${build}`
            }).catch(err => {
                send_error(err, "gdmf.js", `fetch_macos_ota`, `adding new build number to the database`);
            });
        }
    };

    this.fetch_other_updates = async function (assetaud, os_build, hwm, prodtype, prodversion, cname, dname, beta) {
        let os_update = await gdmf_other(assetaud, os_build, hwm, prodtype, prodversion, cname, dname, beta);

        if (!os_update || os_update.length == 0) return send_error(`No asset (${cname} - ${dname}) available.`, "manager.js", `fetch_other_updates`, `update not available for ${assetaud}.`);

        for (let item in os_update) {
            const os_database = db.collection(cname.toLowerCase()).doc(dname);
            const os_data = await os_database.get();
            const os_build_array = os_data.data();

            var updates = [];
            for (let build in os_build_array) updates.push(build);

            const version = os_update[item]['os_version'];
            const size = os_update[item]['os_size'];
            const build = os_update[item]['os_build'];
            const updateid = os_update[item]['os_updateid'];
            const changelog = os_update[item]['os_changelog'];

            if (updates.includes(build)) return;

            if (beta) {
                send_other_beta_updates(cname, version, build, size, formatUpdatesName(updateid, version, cname));
                if (cname.toLowerCase() === "ios") send_other_beta_updates('iPadOS', version, build, size, formatUpdatesName(updateid, version, cname));
            } else {
                send_other_updates(cname, version, build, size, changelog);
                if (cname.toLowerCase() === "ios") {
                    ipad_changelog = await get_changelog(assetaud, "J523xAP", updateid.replace('iOS', 'iPadOS'), "iPad", "com.apple.MobileAsset.SoftwareUpdateDocumentation");
                    send_other_updates('iPadOS', version, build, size, ipad_changelog);
                }
            }

            db.collection(cname.toLowerCase()).doc(dname).update({
                [`${build}`]: `${build}`
            }).catch(err => {
                send_error(err, "gdmf.js", `fetch_other_updates - ${cname} ${dname}`, `adding new build number to the database`);
            });
        }
    };

    this.fetch_macos_pkg = async function (url, beta, dname) {
        let xml_update = await fetch_macos_xml(url, dname);

        if (!xml_update || xml_update.length == 0) return send_error(`No asset (macos - ${dname}) available.`, "manager.js", `fetch_macos_pkg`, `update not available for ${url}.`);

        const os_database = db.collection("macos").doc(dname);
        const os_data = await os_database.get();
        const os_build_array = os_data.data();

        var updates = [];
        for (let build in os_build_array) updates.push(build);

        for (let update in xml_update) {
            let pkgurl = xml_update[update]['xml_pkg'];
            let version = xml_update[update]['xml_version'];
            let build = xml_update[update]['xml_build'];
            let size = xml_update[update]['xml_size'];

            if (updates.includes(build)) continue;

            (beta) ? send_macos_pkg_beta(pkgurl, version, build) : send_macos_pkg_public(pkgurl, version, build, size);

            db.collection("macos").doc(dname).update({
                [`${build}`]: `${build}`
            }).catch(err => {
                send_error(err, "xml.js", `fetch_macos_pkg - ${dname}`, `adding new build number to the database`);
            });

        }
    }

    this.get_pkg_assets = async function (url, dname) {
        let xml_update = await fetch_macos_xml(url, dname);
        return xml_update;
    };
}