// Fetch updates from Apple's Pallas server (gdmf.apple.com)

const axios_instance = require('../axios.js');
const { ASSET_TYPES } = require('../../constants.js');

require('../../utils/error.js')();
require('./documentation.js')();

module.exports = function () {
    this.get_pallas_updates = async function (os, asset_audience, build, hw_model, product_type, product_version, is_beta) {
        const asset_type = ASSET_TYPES[os];
        const doc_name = is_beta ? "beta" : "public";

        const response = await axios_instance.post('https://gdmf.apple.com/v2/assets', {
            AssetAudience: asset_audience,
            ClientVersion: 2,
            AssetType: asset_type,
            BuildVersion: build,
            HWModelStr: hw_model,
            ProductType: product_type,
            ProductVersion: product_version,
        }).catch(function (error) {
            const context = `get_pallas_updates ${os} ${doc_name}`;
            return log_error(error, "software.js", context, `politely asking gdmf.apple.com for updates`);
        });

        if (!response) {
            const context = `get_pallas_updates ${os} ${doc_name}`;
            return log_error("No data available.", "software.js", context, `politely asking gdmf.apple.com for updates`);
        }

        var jwt_parts = response.data.split(".");
        let jwt_payload_buffer = new Buffer.from(jwt_parts[1], 'base64');
        let asset_data = JSON.parse(jwt_payload_buffer.toString('utf8'));

        if (!asset_data.Assets || asset_data.Assets.length === 0) {
            const context = `get_pallas_updates ${os} ${doc_name}`;
            return log_error(`No assets available`, "software.js", context, `update not available for ${asset_audience}.`);
        }

        const builds_map = {};
        
        for (let asset_index = 0; asset_index < asset_data.Assets.length; asset_index++) {
            const asset = asset_data.Assets[asset_index];
            const build_number = asset.Build;
            
            if (!builds_map[build_number]) {
                builds_map[build_number] = asset;
            } else {
                const current_doc_id = builds_map[build_number].SUDocumentationID;
                const new_doc_id = asset.SUDocumentationID;
                
                const current_has_long = current_doc_id && current_doc_id.includes('Long');
                const current_has_short = current_doc_id && current_doc_id.includes('Short');
                const new_has_long = new_doc_id && new_doc_id.includes('Long');
                const new_has_short = new_doc_id && new_doc_id.includes('Short');
                
                if (new_has_long && !current_has_long) {
                    builds_map[build_number] = asset;
                } else if (!new_has_long && !new_has_short && current_has_short) {
                    builds_map[build_number] = asset;
                }
            }
        }

        let updates = [];

        for (let build_number in builds_map) {
            const asset = builds_map[build_number];

            let update = {
                os_version: asset.OSVersion.replace('9.9.', ''),
                os_build: asset.Build,
                os_size: asset._DownloadSize,
                os_updateid: asset.SUDocumentationID,
                os_postdate: asset_data.PostingDate,
            }

            updates.push(update);
        }

        return updates;
    };
};