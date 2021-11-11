// Fetch updates from Apple's XML Catalog

const axios = require('axios');
const xmljs = require('xml-js');
const plist = require('plist');

require('../error.js')();

module.exports = async function () {
    this.fetch_macos_xml = async function (url, dname) {
        let response = await axios.get(url).catch(function (error) {
            return send_error(error, "xml.js", `fetch_macos_pkg - ${dname}`, `fetching the catalog for new updates`);
        });

        if (!response) return send_error("No XML response availble.", "xml.js", `fetch_macos_pkg - ${dname}`, `fetching the catalog for new updates`);

        let catalog_content = plist.parse(response.data);

        let packages = [];

        for (let product in catalog_content.Products) for (let package in catalog_content.Products[product].Packages) if (catalog_content.Products[product].Packages[package].URL.endsWith('InstallAssistant.pkg')) {

            let pkg_info = catalog_content.Products[product].Distributions.English;

            let info = await axios.get(pkg_info).catch(function (error) {
                return send_error(error, "xml.js", `fetch_macos_pkg - ${dname}`, `getting InstallAssistant.pkg info from the distribution file`);
            });

            if (!info) return send_error("No product info available.", "xml.js", `fetch_macos_pkg - ${dname}`, `getting InstallAssistant.pkg info from the distribution file`);

            const packageinfo = JSON.parse(xmljs.xml2json(info.data, { compact: true, spaces: 2 }));

            let xml_update = {
                xml_pkg: catalog_content.Products[product].Packages[package].URL,
                xml_version: packageinfo['installer-gui-script'].auxinfo.dict.string[1]._text.replace('9.9.', ''),
                xml_build: packageinfo['installer-gui-script'].auxinfo.dict.string[0]._text,
                xml_size: catalog_content.Products[product].Packages[package].Size
            }

            packages.push(xml_update);
        }

        return packages;
    }
}
