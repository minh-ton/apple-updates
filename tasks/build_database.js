process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

global.SAVE_MODE = true;

const firebase = require("firebase-admin");

firebase.initializeApp({
    credential: firebase.credential.cert(JSON.parse(process.env.firebase))
});

require("../core/updates.js")();

(async() => {
	await updates_polling();
	await installers_polling();
})();

