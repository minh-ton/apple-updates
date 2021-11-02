// Get update documentation/changelog

const axios = require('axios');
const admzip = require('adm-zip');
const sanitizeHtml = require('sanitize-html');

require('../error.js')();

module.exports = function () {
    this.get_changelog = async function (audience, hw, sudocumentationid, device, assettype) {
        const res = await axios.post('https://gdmf.apple.com/v2/assets', {
            AssetAudience: audience,
            HWModelStr: hw,
            SUDocumentationID: sudocumentationid,
            CertIssuanceDay: "2019-09-06",
            ClientVersion: 2,
            DeviceName: device,
            AssetType: assettype,
        }).catch(function (error) {
            return send_error(error, "doc.js", `${device} changelog`, `getting changelog from apple server.`);
        });

        var arr = res.data.split(".");
        let buff = new Buffer.from(arr[1], 'base64');
        let text = JSON.parse(buff.toString('utf8'));

        if (!text.Assets[0]) return "Release note is not available."

        var file_url = `${text.Assets[0].__BaseURL}${text.Assets[0].__RelativePath}`;

        const file = await axios.request({
            method: 'GET',
            url: file_url,
            responseType: 'arraybuffer',
            responseEncoding: null,
        });

        var zip = new admzip(file.data);
        var zipEntries = zip.getEntries();

        let changelog = zipEntries.map(function (entry) {
            if (entry.entryName == "AssetData/en.lproj/ReadMeSummary.html") return entry;
        }).filter(function (entry) { return entry; })[0];

        const clean = sanitizeHtml(zip.readAsText(changelog).replace(/(.|\n)*<body.*>/, '').replace(/<\/body(.|\n)*/g, ''), {
            allowedTags: ['li'],
        });

        var arr = clean.split("\r\n");

        for (var i = 0; i < arr.length; i++) arr[i] = arr[i].replace(/\t/g, "").replace(/<li>/g, "- ").replace(/<[^>]+>/g, '').replace(/\&amp;/g,'&').trimStart();

        let notes = arr.join('\n').replace(/\n\s*\n\s*\n/g, '\n\n');

        if (notes.length > 4000) notes = notes.substring(0, 4000) + '...\n\n*[Release notes have been truncated]*';

        return notes;
    };
}