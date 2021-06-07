const fetch = require("node-fetch");
const quickdb = require('quick.db');

let ios_api = `https://api.ipsw.me/v4/device/iPhone12,1?type=ipsw`;
let ipados_api = `https://api.ipsw.me/v4/device/iPad8,10?type=ipsw`;
let tvos_api = `https://api.ipsw.me/v4/device/AppleTV5,3?type=ipsw`;
let audioos_api = `https://api.ipsw.me/v4/device/AudioAccessory1,1?type=ota`;
let macos_api = `https://api.ipsw.me/v4/device/MacBookPro17,1?type=ipsw`

var ios_public_value = quickdb.fetch(`ios_public_build`);
var ipados_public_value = quickdb.fetch(`ipados_public_build`);
var tvos_public_value = quickdb.fetch(`tvos_public_build`);
var audioos_public_value = quickdb.fetch(`audioos_public_build`);
var macos_public_value = quickdb.fetch(`macos_public_build`);

function update_existed_values() {
    ios_public_value = quickdb.fetch(`ios_public_build`);
    ipados_public_value = quickdb.fetch(`ipados_public_build`);
    tvos_public_value = quickdb.fetch(`tvos_public_build`);
    audioos_public_value = quickdb.fetch(`audioos_public_build`);
    macos_public_value = quickdb.fetch(`macos_public_build`);
}

module.export = function () {
    this.fetch_ios_public = function () {
        update_existed_values();
        fetch(ios_api).then(function (ios) {
            return ios.json()
        }).then(function (send_ios) {
            if (!ios_public_value) {
                quickdb.set('ios_public_build', send_ios.firmwares[0].buildid);
                return;
            }
            if (ios_public_value == send_ios.firmwares[0].buildid) return;

            // Send message here

            quickdb.set('ios_public_build', send_ios.firmwares[0].buildid);

        }).catch(function (err) {
            console.log(err);
        });
    };

    this.fetch_ipados_public = function () {
        update_existed_values();
        fetch(ipados_api).then(function (ipados) {
            return ipados.json()
        }).then(function (send_ipados) {
            if (!ipados_public_value) {
                quickdb.set('ipados_public_build', send_ipados.firmwares[0].buildid);
                return;
            }
            if (ipados_public_value == send_ipados.firmwares[0].buildid) return;

            // Send message here

            quickdb.set('ipados_public_build', send_ipados.firmwares[0].buildid);

        }).catch(function (err) {
            console.log(err);
        });
    };

    this.fetch_tvos_public = function () {
        update_existed_values();
        fetch(tvos_api).then(function (tvos) {
            return tvos.json();
        }).then(function (send_tvos) {
            if (!tvos_public_value) {
                quickdb.set('tvos_public_build', send_tvos.firmwares[0].buildid);
                return;
            }
            if (tvos_public_value == send_tvos.firmwares[0].buildid) return;

            // Send message here

            quickdb.set('tvos_public_build', send_tvos.firmwares[0].buildid);
        }).catch(function (err) {
            console.log(err);
        });
    };

    this.fetch_audioos_public = function () {
        update_existed_values();
        fetch(audioos_api).then(function (audioos) {
            return audioos.json()
        }).then(function (send_audioos) {
            if (!audioos_public_value) {
                quickdb.set('audioos_public_build', send_audioos.firmwares[0].buildid);
                return;
            }
            if (audioos_public_value == send_audioos.firmwares[0].buildid) return;

            // Send message here 

            quickdb.set('audioos_public_build', send_audioos.firmwares[0].buildid);

        }).catch(function (err) {
            console.log(err);
        });
    };

    this.fetch_macos_public = function () {
        update_existed_values();
        fetch(macos_api).then(function (macos) {
            return macos.json()
        }).then(function (send_macos) {
            if (!macos_public_value) {
                quickdb.set('macos_public_build', send_macos.firmwares[0].buildid);
                return;
            }
            if (macos_public_value == send_macos.firmwares[0].buildid) return;
            
            // Send message here
            
            quickdb.set('macos_public_build', send_macos.firmwares[0].buildid);

        }).catch(function (err) {
            console.log(err);
        });
    }
}