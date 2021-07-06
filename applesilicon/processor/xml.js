// Fetch updates from Apple's XML Catalog

const axios = require('axios');
const xmljs = require('xml-js');
const plist = require('plist');
const firebase = require("firebase-admin");

require('../transceiver/embed.js')();
require('../telemetry/error.js')();

let db = firebase.firestore();

module.exports = async function () {
    this.fetch_macos_pkg = function (url, beta, dname) {
        axios.get(url).then(async (response) => {
            let catalog_content = plist.parse(response.data);
            for (let product in catalog_content.Products) for (let package in catalog_content.Products[product].Packages) if (catalog_content.Products[product].Packages[package].URL.endsWith('InstallAssistant.pkg')) {
                let pkg_info = catalog_content.Products[product].Distributions.English;

                axios.get(pkg_info).then(async (info) => {
                    const packageinfo = JSON.parse(xmljs.xml2json(info.data, { compact: true, spaces: 2 }));

                    const os_database = db.collection("macos").doc(dname);
                    const os_data = await os_database.get();
                    const os_build_array = os_data.data();

                    var updates = [];
                    for (let build in os_build_array) updates.push(build);

                    if (!updates.includes(packageinfo['installer-gui-script'].auxinfo.dict.string[0]._text)) {

                        // Send message here
                        let pkgurl = catalog_content.Products[product].Packages[package].URL;
                        let version = packageinfo['installer-gui-script'].auxinfo.dict.string[1]._text.replace('9.9.', ''); // remove 9.9. in ota updates version
                        let build = packageinfo['installer-gui-script'].auxinfo.dict.string[0]._text;
                        let size = catalog_content.Products[product].Packages[package].Size;

                        (beta) ? send_macos_pkg_beta(pkgurl, version, build) : send_macos_pkg_public(pkgurl, version, build, size);

                        db.collection("macos").doc(dname).update({
                            [`${build}`]: `${build}`
                        }).catch(err => {
                            send_error(err, "xml.js", `fetch_macos_pkg - ${dname}`, `adding new build number to the database`);
                        });
                    }
                }).catch(function (error) {
                    send_error(error, "xml.js", `fetch_macos_pkg - ${dname}`, `getting InstallAssistant.pkg info from the distribution file`);
                });;
            }
        }).catch(function (error) {
            send_error(error, "xml.js", `fetch_macos_pkg - ${dname}`, `fetching the catalog for new updates`);
        });
    };
}
