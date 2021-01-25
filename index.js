process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Role IDs
/*
announcements: 757663043126820991
ios: 742679465276211312
*/

// Set up webhook client
const Discord = require('discord.js');
const config = require("./config.json");
const client = new Discord.WebhookClient(config.id, config.token);

// Dependencies
const fetch = require("node-fetch");
const request = require('request');
const convert = require('xml-js');
const plist = require('plist');
const quickdb = require('quick.db');
const https = require('https');
const fs = require('fs');
const axios = require('axios');
const firebase = require("firebase-admin");
const credentials = require("./firebase.json");

// Init firebase database

firebase.initializeApp({
  credential: firebase.credential.cert(credentials),
});

let db = firebase.firestore();

// Format bytes
function formatBytes(bytes) {
  var marker = 1024;
  var decimal = 1;
  var kiloBytes = marker;
  var megaBytes = marker * marker;
  var gigaBytes = marker * marker * marker;
  var teraBytes = marker * marker * marker * marker;

  if (bytes < kiloBytes) return bytes + " Bytes";
  else if (bytes < megaBytes) return (bytes / kiloBytes).toFixed(decimal) + " KB";
  else if (bytes < gigaBytes) return (bytes / megaBytes).toFixed(decimal) + " MB";
  else return (bytes / gigaBytes).toFixed(decimal) + " GB";
}

// List of catalogs

let ios_catalog_url = `https://api.ipsw.me/v4/device/iPhone12,1?type=ipsw`;
let ipados_catalog_url = `https://api.ipsw.me/v4/device/iPad8,10?type=ipsw`;
let tvos_catalog_url = `https://api.ipsw.me/v4/device/AppleTV6,2?type=ota`;
let audioos_catalog_url = `https://api.ipsw.me/v4/device/AudioAccessory1,1?type=ota`;
let macos_ipswme_api = `https://api.ipsw.me/v4/device/MacBookPro17,1?type=ipsw`

let ios_beta_catalog_url = `https://mesu.apple.com/assets/iOS14DeveloperSeed/com_apple_MobileAsset_SoftwareUpdate/com_apple_MobileAsset_SoftwareUpdate.xml`;
let ipados_beta_catalog_url = `https://mesu.apple.com/assets/iOS14DeveloperSeed/com_apple_MobileAsset_SoftwareUpdate/com_apple_MobileAsset_SoftwareUpdate.xml`;

let macos_public_url = `https://swscan.apple.com/content/catalogs/others/index-11-10.15-10.14-10.13-10.12-10.11-10.10-10.9-mountainlion-lion-snowleopard-leopard.merged-1.sucatalog`;

// ========

// These uses IPSW.ME API, so it's not buggy
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

// tvOS Public Releases
function pull_tvos_public_api() {
  console.log('Pulling tvOS Public API...');

  update_existed_values();
  fetch(tvos_catalog_url).then(function(tvos) {
    return tvos.json();
  }).then(function(send_tvos) {
    if (!tvos_public_value) {
      quickdb.set('tvos_public_build', send_tvos.firmwares[0].buildid);
      return;
    }
    if (tvos_public_value == send_tvos.firmwares[0].buildid) return;
    const randomColor = "#000000".replace(/0/g, function() {
      return (~~(Math.random() * 16)).toString(16);
    });
    const embed = new Discord.MessageEmbed()
      .setTitle(`📺 New tvOS Public Release!`)
      .setAuthor(`macOS on Unsupported Macs`, `https://i.imgur.com/5JatAyq.png`)
      .addField(`Version`, send_tvos.firmwares[0].version, true)
      .addField(`Build`, send_tvos.firmwares[0].buildid, true)
      .addField(`Size`, formatBytes(send_tvos.firmwares[0].filesize), true)
      .setThumbnail(`https://ipsw.me/assets/devices/AppleTV5,3.png`)
      .setColor(randomColor)
      .setTimestamp();
    client.send(embed);
    quickdb.set('tvos_public_build', send_tvos.firmwares[0].buildid);
  }).catch(function(err) {
    console.log(err);
  });
}

// iOS Public Releases
function pull_ios_public_api() {
  console.log('Pulling iOS Public API...');

  update_existed_values();
  fetch(ios_catalog_url).then(function(ios) {
    return ios.json()
  }).then(function(send_ios) {
    if (!ios_public_value) {
      quickdb.set('ios_public_build', send_ios.firmwares[0].buildid);
      return;
    }
    if (ios_public_value == send_ios.firmwares[0].buildid) return;
    const randomColor = "#000000".replace(/0/g, function() {
      return (~~(Math.random() * 16)).toString(16);
    });
    const embed = new Discord.MessageEmbed()
      .setTitle(`📱 New iOS Public Release!`)
      .setAuthor(`macOS on Unsupported Macs`, `https://i.imgur.com/5JatAyq.png`)
      .addField(`Version`, send_ios.firmwares[0].version, true)
      .addField(`Build`, send_ios.firmwares[0].buildid, true)
      .addField(`Size`, formatBytes(send_ios.firmwares[0].filesize), true)
      .setThumbnail(`https://ipsw.me/assets/devices/iPhone13,4.png`)
      .setColor(randomColor)
      .setTimestamp();
    client.send(embed);
    client.send(`<@&742679465276211312>`);
    quickdb.set('ios_public_build', send_ios.firmwares[0].buildid);

  }).catch(function(err) {
    console.log(err);
  });
}

// iPadOS Public Releases
function pull_ipados_public_api() {
  console.log('Pulling iPadOS Public API...');

  update_existed_values();
  fetch(ipados_catalog_url).then(function(ipados) {
    return ipados.json()
  }).then(function(send_ipados) {
    if (!ipados_public_value) {
      quickdb.set('ipados_public_build', send_ipados.firmwares[0].buildid);
      return;
    }
    if (ipados_public_value == send_ipados.firmwares[0].buildid) return;
    const randomColor = "#000000".replace(/0/g, function() {
      return (~~(Math.random() * 16)).toString(16);
    });
    const embed = new Discord.MessageEmbed()
      .setTitle(`🎉 New iPadOS Public Release!`)
      .setAuthor(`macOS on Unsupported Macs`, `https://i.imgur.com/5JatAyq.png`)
      .addField(`Version`, send_ipados.firmwares[0].version, true)
      .addField(`Build`, send_ipados.firmwares[0].buildid, true)
      .addField(`Size`, formatBytes(send_ipados.firmwares[0].filesize), true)
      .setThumbnail(`https://ipsw.me/assets/devices/iPad8,10.png`)
      .setColor(randomColor)
      .setTimestamp();
    client.send(embed);
    quickdb.set('ipados_public_build', send_ipados.firmwares[0].buildid);

  }).catch(function(err) {
    console.log(err);
  });
}

// AudioOS Public Releases
function pull_audioos_public_api() {
  console.log('Pulling AudioOS Public API...');

  update_existed_values();
  fetch(audioos_catalog_url).then(function(audioos) {
    return audioos.json()
  }).then(function(send_audioos) {
    if (!audioos_public_value) {
      quickdb.set('audioos_public_build', send_audioos.firmwares[0].buildid);
      return;
    }
    if (audioos_public_value == send_audioos.firmwares[0].buildid) return;
    const randomColor = "#000000".replace(/0/g, function() {
      return (~~(Math.random() * 16)).toString(16);
    });
    const embed = new Discord.MessageEmbed()
      .setTitle(`🔊 New audioOS Public Release!`)
      .setAuthor(`macOS on Unsupported Macs`, `https://i.imgur.com/5JatAyq.png`)
      .addField(`Version`, send_audioos.firmwares[0].version.substring(4), true)
      .addField(`Build`, send_audioos.firmwares[0].buildid, true)
      .addField(`Size`, formatBytes(send_audioos.firmwares[0].filesize), true)
      .setThumbnail(`https://ipsw.me/assets/devices/AudioAccessory1,1.png`)
      .setColor(randomColor)
      .setTimestamp();
    client.send(embed);
    quickdb.set('audioos_public_build', send_audioos.firmwares[0].buildid);

  }).catch(function(err) {
    console.log(err);
  });
}

// iOS Beta Releases
function pull_ios_beta_catalog() {
  console.log('Pulling iOS Beta Release...');

  request.get(ios_beta_catalog_url, function(error, response, body) {
    let catalog_content = plist.parse(body);
    for (assets = 0; assets < catalog_content.Assets.length; assets++) {
      for (let devices in catalog_content.Assets[assets].SupportedDevices) {
        if (catalog_content.Assets[assets].SupportedDevices[0] == "iPhone12,8") { // iPhone SE 2020
          let beta_ios_version = catalog_content.Assets[assets].OSVersion.substring(4);
          let beta_ios_build = catalog_content.Assets[assets].Build;
          let beta_ios_id = catalog_content.Assets[assets].SUDocumentationID;
          let beta_ios_size = catalog_content.Assets[assets]._DownloadSize;
          let beta_ios_release_type = catalog_content.Assets[assets].ReleaseType;

          db.collection("AppleUpdates").doc('ios_beta').get().then(doc => {
            let builds = doc.data();

            var updates = [];

            // Put all build numbers into an array
            for (let category in builds) {
              updates.push(builds[category]);
            }

            if (!updates.includes(beta_ios_build) && beta_ios_release_type != 'Beta') {
              // Send a message first
              const randomColor = "#000000".replace(/0/g, function() {
                return (~~(Math.random() * 16)).toString(16);
              });
              const embed = new Discord.MessageEmbed()
                .setTitle(`📱 New iOS Beta Release!`)
                .setAuthor(`macOS on Unsupported Macs`, `https://i.imgur.com/5JatAyq.png`)
                .addField(`Version`, `iOS ${beta_ios_version} (${beta_ios_id})`, true)
                .addField(`Build`, beta_ios_build, true)
                .addField(`Size`, formatBytes(beta_ios_size), true)
                .setThumbnail(`https://ipsw.me/assets/devices/iPhone13,4.png`)
                .setColor(randomColor)
                .setTimestamp();
              client.send(embed);
              client.send(`<@&742679465276211312>`);

              // Add new value
              db.collection("AppleUpdates").doc('ios_beta').update({
                [`${beta_ios_build}`]: `${beta_ios_build}`
              });
            }
          });
        }
      }
    }
  });

  console.log('Done getting beta iOS.');
}

// iPadOS Beta Releases
function pull_ipados_beta_catalog() {
  console.log('Pulling iPadOS Beta Release...');

  request.get(ipados_beta_catalog_url, function(error, response, body) {
    let catalog_content = plist.parse(body);
    for (assets = 0; assets < catalog_content.Assets.length; assets++) {
      for (let devices in catalog_content.Assets[assets].SupportedDevices) {
        if (catalog_content.Assets[assets].SupportedDevices[0] == "iPad11,6") { // iPad 6th Gen (WiFi)
          let beta_ipados_version = catalog_content.Assets[assets].OSVersion.substring(4);
          let beta_ipados_build = catalog_content.Assets[assets].Build;
          let beta_ipados_id = catalog_content.Assets[assets].SUDocumentationID;
          let beta_ipados_size = catalog_content.Assets[assets]._DownloadSize;
          let beta_ipados_release_type = catalog_content.Assets[assets].ReleaseType;

          db.collection("AppleUpdates").doc('ipados_beta').get()
            .then(doc => {
              let builds = doc.data();

              var updates = [];

              // Put all build numbers into an array
              for (let category in builds) {
                updates.push(builds[category]);
              }

              if (!updates.includes(beta_ipados_build) && beta_ipados_release_type != 'Beta') {

                // Send a message first
                const randomColor = "#000000".replace(/0/g, function() {
                  return (~~(Math.random() * 16)).toString(16);
                });
                const embed = new Discord.MessageEmbed()
                  .setTitle(`🎉 New iPadOS Beta Release!`)
                  .setAuthor(`macOS on Unsupported Macs`, `https://i.imgur.com/5JatAyq.png`)
                  .addField(`Version`, `iPadOS ${beta_ipados_version} (${beta_ipados_id})`, true)
                  .addField(`Build`, beta_ipados_build, true)
                  .addField(`Size`, formatBytes(beta_ipados_size), true)
                  .setThumbnail(`https://ipsw.me/assets/devices/iPad8,10.png`)
                  .setColor(randomColor)
                  .setTimestamp();
                client.send(embed);

                // Add new value
                db.collection("AppleUpdates").doc('ipados_beta').update({
                  [`${beta_ipados_build}`]: `${beta_ipados_build}`
                });
              }
            });
        }
      }
    }
  });

  console.log('Done getting beta iPadOS.');
}

// macOS InstallAssistant.pkg Public
function pull_macos_public_url() {
  console.log('Pulling macOS Public InstallAssistant.pkg...');

  request(macos_public_url, function(error, response, body) {
    let catalog_content = plist.parse(body);
    for (let product in catalog_content.Products) {
      for (let package in catalog_content.Products[product].Packages) {
        if (catalog_content.Products[product].Packages[package].URL.endsWith('InstallAssistant.pkg')) {

          const pkg_info = catalog_content.Products[product].Distributions.English;

          https.get(pkg_info, function(result) {
            result.on('data', function(data) {
              const jsonData = JSON.parse(convert.xml2json(data, {
                compact: true,
                spaces: 2
              }));

              db.collection("AppleUpdates").doc('macos_bigsur_pkg').get()
                .then(doc => {
                  let builds = doc.data();

                  var updates = [];

                  // Put all build numbers into an array
                  for (let category in builds) {
                    updates.push(builds[category]);
                  }

                  if (!updates.includes(jsonData['installer-gui-script'].auxinfo.dict.string[0]._text)) {
                    // Send a message first
                    const randomColor = "#000000".replace(/0/g, function() {
                      return (~~(Math.random() * 16)).toString(16);
                    });

                    const embed = new Discord.MessageEmbed()
                      .setTitle(`💻 New macOS Public Release!`)
                      .setDescription(`Installer Package:\n> ${catalog_content.Products[product].Packages[package].URL}`)
                      .setAuthor(`macOS on Unsupported Macs`, `https://i.imgur.com/5JatAyq.png`)
                      .addField(`Version`, jsonData['installer-gui-script'].auxinfo.dict.string[1]._text, true)
                      .addField(`Build`, jsonData['installer-gui-script'].auxinfo.dict.string[0]._text, true)
                      .addField(`Size`, formatBytes(catalog_content.Products[product].Packages[package].Size), true)
                      .setThumbnail(`https://ipsw.me/assets/devices/MacBookPro17,1.png`)
                      .setColor(randomColor)
                      .setTimestamp();
                    client.send(embed);
                    client.send(`> ${catalog_content.Products[product].Packages[package].URL}`);
                    client.send("<@&757663043126820991>");

                    // Add new value
                    db.collection("AppleUpdates").doc('macos_bigsur_pkg').update({
                      [`${jsonData['installer-gui-script'].auxinfo.dict.string[0]._text}`]: `${jsonData['installer-gui-script'].auxinfo.dict.string[0]._text}`
                    });
                  }
                });
            });
          });
        }
      }
    }
  });

  console.log('Done getting InstallAssistant.pkg.');
}

// macOS Public Releases (based on IPSW.ME API)
function pull_macos_public_api() {
  console.log('Pulling macOS Public API...');
  update_existed_values();
  fetch(macos_ipswme_api).then(function(macos) {
    return macos.json()
  }).then(function(send_macos) {
    if (!macos_public_value) {
      quickdb.set('macos_public_build', send_macos.firmwares[0].buildid);
      return;
    }
    if (macos_public_value == send_macos.firmwares[0].buildid) return;
    const randomColor = "#000000".replace(/0/g, function() {
      return (~~(Math.random() * 16)).toString(16);
    });
    // .setDescription(`> ${send_macos.firmwares[0].url}`)
    const embed = new Discord.MessageEmbed()
      .setTitle(`💻 New macOS Public Release!`)
      .setAuthor(`macOS on Unsupported Macs`, `https://i.imgur.com/5JatAyq.png`)
      .addField(`Version`, send_macos.firmwares[0].version, true)
      .addField(`Build`, send_macos.firmwares[0].buildid, true)
      .addField(`Size`, formatBytes(send_macos.firmwares[0].filesize), true)
      .setThumbnail(`https://ipsw.me/assets/devices/MacBookPro17,1.png`)
      .setColor(randomColor)
      .setTimestamp();
    client.send(embed);
    quickdb.set('macos_public_build', send_macos.firmwares[0].buildid);

  }).catch(function(err) {
    console.log(err);
  });
}

// Pull beta macOS beta OTA packages
function pull_macos_beta_ota() {
  console.log('Pulling macOS Beta OTA...');

  axios.post('https://gdmf.apple.com/v2/assets', {
      AssetAudience: "ca60afc6-5954-46fd-8cb9-60dde6ac39fd",
      HWModelStr: "Mac-06F11F11946D27C5",
      CertIssuanceDay: "2019-09-06",
      ClientVersion: 2,
      AssetType: "com.apple.MobileAsset.MacSoftwareUpdate"
    })
    .then(res => {
      var arr = res.data.split(".");
      let buff = new Buffer.from(arr[1], 'base64');
      let text = JSON.parse(buff.toString('utf8'));

      db.collection("AppleUpdates").doc('macos_ota').get()
        .then(doc => {
          let builds = doc.data();

          var updates = [];

          // Putting updates into an array
          for (let category in builds) {
            updates.push(builds[category]);
          }

          if (!updates.includes(text.Assets[0].Build)) {

            // Send a message first
            const randomColor = "#000000".replace(/0/g, function() {
              return (~~(Math.random() * 16)).toString(16);
            });

            const embed = new Discord.MessageEmbed()
              .setTitle(`💻 New macOS Beta Release!`)
              .setAuthor(`macOS on Unsupported Macs`, `https://i.imgur.com/5JatAyq.png`)
              .addField(`Version`, `macOS ${text.Assets[0].OSVersion} (${text.Assets[0].SUDocumentationID})`, true)
              .addField(`Build`, text.Assets[0].Build, true)
              .addField(`Size`, formatBytes(text.Assets[0]._DownloadSize), true)
              .setDescription(`OTA Update Package:\n> ${text.Assets[0].__BaseURL}${text.Assets[0].__RelativePath}`)
              .setThumbnail(`https://i.imgur.com/nxTPLLH.png`)
              .setColor(randomColor)
              .setTimestamp();
            client.send(embed);
            client.send("<@&757663043126820991>");

            // Add new value
            db.collection("AppleUpdates").doc('macos_ota').update({
              [`${text.Assets[0].Build}`]: `${text.Assets[0].Build}`
            });
          }
        });
    })
    .catch(error => {
      console.error(error)
    });

    console.log('Done getting macOS OTAs.');
}

function update_all() {
  console.log('\n======= FETCHING ========\n\n');

  console.log(`\n=== IOS/IPADOS ===\n`)
  // iOS/iPadOS
  pull_ios_public_api();
  pull_ipados_public_api();
  pull_ios_beta_catalog();
  pull_ipados_beta_catalog();

  console.log(`\n=== MISC. ===\n`)
  // Misc Operating Systems
  pull_tvos_public_api();
  pull_audioos_public_api();

  console.log(`\n=== MACOS ===\n`)
  // macOS
  pull_macos_public_api();
  pull_macos_public_url();
  pull_macos_beta_ota();
}

// Start the process
console.log(`Webhook has started!`);
update_all();

// Update interval (20s)
setInterval(function() {
  update_all();
}, 25000);
