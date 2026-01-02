// Monitor the updates check process.

const firebase = require("firebase-admin");

require('../notification/staging.js')();
require('../utils/error.js')();
require('../utils/utils.js')();
require('./pallas/documentation.js')();
require('./pallas/software.js')();
require('./sucatalog/installer.js')();
require('../utils/data.js')();

let db = firebase.firestore();

module.exports = function () {
    this.check_for_updates = async function (osType, assetaud, build, hwm, prodtype, prodversion, dname, beta) {
        const isMacOS = osType.toLowerCase() === 'macos';
        let update_data = await get_pallas_updates(osType, assetaud, build, hwm, prodtype, prodversion, beta, osType, dname);

        if (isMacOS) {
            if (!update_data || update_data.length == 0) return log_error(`No asset available.`, "fetch.js", `check_for_updates`, `update not available for ${assetaud}.`);
            
            for (let item in update_data) {
                const database = db.collection("macos").doc(dname);
                const data = await database.get();
                const build_array = data.data();

                var updates = [];
                for (let build in build_array) updates.push(build);

                const version = update_data[item]['mac_version'];
                const size = update_data[item]['mac_size'];
                const build = update_data[item]['mac_build'];
                const updateid = update_data[item]['mac_updateid'];
                const changelog = update_data[item]['mac_changelog'];
                const postdate = update_data[item]['mac_postdate'];
                const raw_response = update_data[item]['mac_raw_response'];

                if (global.SAVE_MODE) {
                    console.log("[BUILD_DATABASE] - UPLOADING UPDATE OF MACOS");
                    console.log(`[BUILD_DATABASE] MACOS ${version} (${build})`);
                    await save_update("macos", version, size, build, updateid, changelog, postdate, raw_response, beta);
                    continue;
                }

                if (updates.includes(build)) return;

                send_os_updates('macOS', version, build, size, beta, beta ? formatUpdatesName(updateid, version, "macOS") : null, beta ? null : changelog);

                db.collection("macos").doc(dname).update({
                    [`${build}`]: `${build}`
                }).catch(err => {
                    log_error(err, "fetch.js", `check_for_updates`, `adding new build number to the database`);
                });
            }
        } else {
            if (!update_data) return log_error(`No asset (${osType} - ${dname}) available.`, "fetch.js", `check_for_updates`, `update not available for ${assetaud}.`);

            const database = db.collection(osType.toLowerCase()).doc(dname);
            const data = await database.get();
            const build_array = data.data();

            var updates = [];
            for (let build in build_array) updates.push(build);

            const version = update_data['os_version'];
            const size = update_data['os_size'];
            const build = update_data['os_build'];
            const updateid = update_data['os_updateid'];
            const changelog = update_data['os_changelog'];
            const postdate = update_data['os_postdate'];
            const raw_response = update_data['os_raw_response'];

            if (global.SAVE_MODE) {
                console.log("[BUILD_DATABASE] - UPLOADING UPDATE OF " + osType.toUpperCase());
                console.log(`[BUILD_DATABASE] ${osType.toUpperCase()} ${version} (${build})`);
                return await save_update(osType, version, size, build, updateid, changelog, postdate, raw_response, beta);
            }

            if (updates.includes(build)) return;

            send_os_updates(osType, version, build, size, beta, beta ? formatUpdatesName(updateid, version, osType) : null, beta ? null : changelog);

            db.collection(osType.toLowerCase()).doc(dname).update({
                [`${build}`]: `${build}`
            }).catch(err => {
                log_error(err, "fetch.js", `check_for_updates - ${osType} ${dname}`, `adding new build number to the database`);
            });
        }
    };

    this.check_for_installers = async function (url, beta, dname) {
        let xml_update = await get_sucatalog_installers(url, dname);

        if (!xml_update || xml_update.length == 0) return log_error(`No asset (macos - ${dname}) available.`, "fetch.js", `check_for_installers`, `update not available for ${url}.`);

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
            let postdate = xml_update[update]['xml_postdate'];

            if (global.SAVE_MODE) {
                console.log("[BUILD_DATABASE] - UPLOADING PACKAGE OF MACOS");
                console.log(`[BUILD_DATABASE] MACOS ${version} (${build})`);
                await save_package("macos", build, version, size, pkgurl, postdate, beta);
                continue;
            }

            if (updates.includes(build)) continue;

            send_macos_installer(pkgurl, version, build, size, beta);

            db.collection("macos").doc(dname).update({
                [`${build}`]: `${build}`
            }).catch(err => {
                log_error(err, "fetch.js", `check_for_installers - ${dname}`, `adding new build number to the database`);
            });
        }
    }
}