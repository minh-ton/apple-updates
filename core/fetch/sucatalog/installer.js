// Fetch updates from Apple's XML Catalog

const http = require('http'); 
const https = require('https');
const axios = require('axios');
const xmljs = require('xml-js');
const plist = require('plist');

require('../../utils/error.js')();

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

module.exports = async function () {
    this.get_sucatalog_installers = async function (url, dname) {
        let response = await axiosInstance.get(url).catch(function (error) {
            return log_error(error, "installer.js", `get_sucatalog_installers - ${dname}`, `fetching the catalog for new updates`);
        });

        if (!response) return log_error("No XML response availble.", "installer.js", `get_sucatalog_installers - ${dname}`, `fetching the catalog for new updates`);

        let catalog_content = plist.parse(response.data);

        let packages = [];

        for (let product in catalog_content.Products) for (let package in catalog_content.Products[product].Packages) if (catalog_content.Products[product].Packages[package].URL.endsWith('InstallAssistant.pkg')) {

            let pkg_info = catalog_content.Products[product].Distributions.English;

            let info = await axios.get(pkg_info).catch(function (error) {
                return log_error(error, "installer.js", `get_sucatalog_installers - ${dname}`, `getting InstallAssistant.pkg info from the distribution file`);
            });

            if (!info) return log_error("No product info available.", "installer.js", `get_sucatalog_installers - ${dname}`, `getting InstallAssistant.pkg info from the distribution file`);

            const packageinfo = JSON.parse(xmljs.xml2json(info.data, { compact: true, spaces: 2 }));

            let xml_update = {
                xml_pkg: catalog_content.Products[product].Packages[package].URL,
                xml_version: packageinfo['installer-gui-script'].auxinfo.dict.string[1]._text.replace('9.9.', ''),
                xml_build: packageinfo['installer-gui-script'].auxinfo.dict.string[0]._text,
                xml_size: catalog_content.Products[product].Packages[package].Size,
                xml_postdate: catalog_content.Products[product].PostDate
            }

            packages.push(xml_update);
        }

        return packages;
    }
}
