// Save update data for searching

const firebase = require("firebase-admin");

require('./error.js')();

let db = firebase.firestore();

const info_collection_ref = db.collection('other').doc('information');

module.exports = function() {
	this.save_update = async function(os, version, size, build, update_id, changelog, post_date, raw_response, is_beta) {
		let os_collection = info_collection_ref.collection(`${os}${(is_beta) ? "_beta" : "_public"}`);

		if (!build) return;

		let cached_doc = await os_collection.doc(build).get();
		let cached_data = cached_doc.data();

		let update_data = {
			"version": version,
			"size": size,
			"build": build,
			"updateid": update_id,
			"changelog": changelog,
			"postdate": post_date,
			"raw_response": raw_response,
			"beta": is_beta
		};

		try {
			if (cached_data == undefined) await os_collection.doc(build).set(update_data);
			else await os_collection.doc(build).update(update_data);
		} catch(error) {
			return log_error(`Cannot update information`, "info.js", `save_update`, `uploading for ${os}.`);
		}
	}

	this.save_package = async function(os, build, version, size, package_url, post_date, is_beta) {
		let os_collection = info_collection_ref.collection(`${os}${(is_beta) ? "_beta" : "_public"}`);

		if (!build) return;

		let cached_doc = await os_collection.doc(build).get();
		let cached_data = cached_doc.data();

		let package_data = {
			"version": version,
			"build": build,
			"package": package_url,
			"packagesize": size,
			"postdate": post_date,
			"beta": is_beta
		};

		try {
			if (cached_data == undefined) await os_collection.doc(build).set(package_data);
			else await os_collection.doc(build).update(package_data);
		} catch(error) {
			return log_error(`Cannot update information`, "info.js", `save_package`, `uploading for ${os}.`);
		}
	}
}