// Monitor the updates check process.

const firebase = require("firebase-admin");
const { DOCUMENTATION_ASSET_TYPES, DEVICE_NAMES } = require('../constants.js');

require('../notification/staging.js')();
require('../utils/error.js')();
require('../utils/utils.js')();
require('./pallas/documentation.js')();
require('./pallas/software.js')();
require('./sucatalog/installer.js')();
require('./webpage/tvos_docs.js')();
require('../utils/data.js')();

let db = firebase.firestore();

module.exports = function () {
    this.check_for_updates = async function (os, asset_audience, build, hw_model, product_type, product_version, is_beta, target_version) {
        const doc_name = is_beta ? "beta" : "public";
        let updates_array = await get_pallas_updates(os, asset_audience, build, hw_model, product_type, product_version, is_beta);

        if (!updates_array || updates_array.length === 0) {
            return log_error(`No asset (${os} - ${doc_name}) available.`, "fetch.js", `check_for_updates`, `update not available for ${asset_audience}.`);
        }

        var existing_builds = [];
        var doc_ref;
        if (!global.SAVE_MODE) {
            doc_ref = db.collection(os).doc(doc_name);
            const doc_snapshot = await doc_ref.get();
            const stored_builds = doc_snapshot.data();
            for (let build in stored_builds) existing_builds.push(build);
        }

        for (let update_data of updates_array) {
            const version = update_data['os_version'];
            const size = update_data['os_size'];
            const build_number = update_data['os_build'];
            const update_id = update_data['os_updateid'];
            const post_date = update_data['os_postdate'];

            if (target_version !== null && target_version !== undefined) {
                const major_version = parseInt(version.split('.')[0]);
                if (major_version !== target_version) {
                    continue;
                }
            }

            var changelog = undefined;
            if (global.SAVE_MODE || !existing_builds.includes(build_number)) {
                if (!is_beta) {
                    changelog = os === "tvos" ? await get_tvos_documentation(version) : await get_documentation(asset_audience, hw_model, update_id, DEVICE_NAMES[os], DOCUMENTATION_ASSET_TYPES[os]);
                }
                if (changelog == undefined) changelog = "Release note is not available.";
            }

            if (global.SAVE_MODE) {
                console.log("[BUILD_DATABASE] - UPLOADING UPDATE OF " + os.toUpperCase());
                console.log(`[BUILD_DATABASE] ${os.toUpperCase()} ${version} (${build_number})`);
                await save_update(os, version, size, build_number, update_id, changelog, post_date, is_beta);
                continue;
            }

            if (existing_builds.includes(build_number)) continue;

            send_os_updates(os, version, build_number, size, is_beta, is_beta ? format_documentation_id(update_id, version, os) : null, is_beta ? null : changelog);

            doc_ref.update({
                [`${build_number}`]: `${build_number}`
            }).catch(err => {
                log_error(err, "fetch.js", `check_for_updates - ${os} ${doc_name}`, `adding new build number to the database`);
            });
        }
    };

    this.check_for_installers = async function (catalog_url, is_beta) {
        const doc_name = is_beta ? "beta_pkg" : "public_pkg";
        let installer_packages = await get_sucatalog_installers(catalog_url);

        if (!installer_packages || installer_packages.length == 0) return log_error(`No asset (macos - ${doc_name}) available.`, "fetch.js", `check_for_installers`, `update not available for ${catalog_url}.`);

        var existing_builds = [];
        var doc_ref;
        if (!global.SAVE_MODE) {
            doc_ref = db.collection("macos").doc(doc_name);
            const doc_snapshot = await doc_ref.get();
            const stored_builds = doc_snapshot.data();
            for (let build in stored_builds) existing_builds.push(build);
        }

        for (let installer in installer_packages) {
            let pkg_url = installer_packages[installer]['xml_pkg'];
            let version = installer_packages[installer]['xml_version'];
            let build = installer_packages[installer]['xml_build'];
            let size = installer_packages[installer]['xml_size'];
            let post_date = installer_packages[installer]['xml_postdate'];

            if (global.SAVE_MODE) {
                console.log("[BUILD_DATABASE] - UPLOADING PACKAGE OF MACOS");
                console.log(`[BUILD_DATABASE] MACOS ${version} (${build})`);
                await save_package("macos", build, version, size, pkg_url, post_date, is_beta);
                continue;
            }

            if (existing_builds.includes(build)) continue;

            send_macos_installer(pkg_url, version, build, size, is_beta);

            doc_ref.update({
                [`${build}`]: `${build}`
            }).catch(err => {
                log_error(err, "fetch.js", `check_for_installers - ${doc_name}`, `adding new build number to the database`);
            });
        }
    }
}