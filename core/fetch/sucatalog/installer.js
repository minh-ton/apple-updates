// Fetch updates from Apple's XML Catalog

const axios_instance = require('../axios.js');
const axios = require('axios');
const xmljs = require('xml-js');
const plist = require('apple-plist');

require('../../utils/error.js')();

module.exports = async function () {
    this.get_sucatalog_installers = async function (catalog_url) {
        let response = await axios_instance.get(catalog_url).catch(function (error) {
            return log_error(error, "installer.js", `get_sucatalog_installers`, `fetching the catalog for new updates`);
        });

        if (!response) return log_error("No XML response availble.", "installer.js", `get_sucatalog_installers`, `fetching the catalog for new updates`);

        let catalog_content = plist.parse(response.data).data;

        let packages = [];

        for (let product in catalog_content.Products) for (let package in catalog_content.Products[product].Packages) if (catalog_content.Products[product].Packages[package].URL.endsWith('InstallAssistant.pkg')) {

            let pkg_info_url = catalog_content.Products[product].Distributions.English;

            let pkg_info = await axios.get(pkg_info_url).catch(function (error) {
                return log_error(error, "installer.js", `get_sucatalog_installers`, `getting InstallAssistant.pkg info from the distribution file`);
            });

            if (!pkg_info) return log_error("No product info available.", "installer.js", `get_sucatalog_installers`, `getting InstallAssistant.pkg info from the distribution file`);

            const package_info = JSON.parse(xmljs.xml2json(pkg_info.data, { compact: true, spaces: 2 }));

            let xml_update = {
                xml_pkg: catalog_content.Products[product].Packages[package].URL,
                xml_version: package_info['installer-gui-script'].auxinfo.dict.string[1]._text.replace('9.9.', ''),
                xml_build: package_info['installer-gui-script'].auxinfo.dict.string[0]._text,
                xml_size: catalog_content.Products[product].Packages[package].Size,
                xml_postdate: catalog_content.Products[product].PostDate
            }

            packages.push(xml_update);
        }

        return packages;
    }
}
