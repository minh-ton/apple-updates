process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'

const Discord = require('discord.js');
const config = require("./config.json");
const client = new Discord.WebhookClient(config.real_id, config.real_token);
const fetch = require("node-fetch");
const request = require('request');
const convert = require('xml-js');
var plist = require('plist');
const quickdb = require('quick.db');
var https = require('https');
const fs = require('fs');
const axios = require('axios');
const lineReader = require('line-reader');

// https://discordapp.com/api/webhooks/750862907683766272/CC4hBTJWfm7xZzV25uhLqsoEadUNzApJOugIU3zpQtQdyi3vqeavmgAHuIddu6c39gv-

let days = 0;
let week = 0;

// URL: https://discordapp.com/api/webhooks/752155183290646548/JB7C4Oj7rkEDWXHTiZ2ZZ1VAzRmc2U1d7rwhd7YnPyH2H5puZXdqcwbip8QRAL77pdpg

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

let ios_catalog_url = `https://api.ipsw.me/v4/device/iPhone12,1?type=ipsw`;
let ipados_catalog_url = `https://api.ipsw.me/v4/device/iPad8,10?type=ipsw`;
let tvos_catalog_url = `https://api.ipsw.me/v4/device/AppleTV6,2?type=ota`;
let audioos_catalog_url = `https://api.ipsw.me/v4/device/AudioAccessory1,1?type=ota`;
let macos_catalog_url = `https://api.ipsw.me/v4/device/MacBookPro17,1?type=ipsw`
let ios_beta_catalog_url = `https://mesu.apple.com/assets/iOS14DeveloperSeed/com_apple_MobileAsset_SoftwareUpdate/com_apple_MobileAsset_SoftwareUpdate.xml`;
let ipados_beta_catalog_url = `https://mesu.apple.com/assets/iOS14DeveloperSeed/com_apple_MobileAsset_SoftwareUpdate/com_apple_MobileAsset_SoftwareUpdate.xml`;
let macos_beta_catalog_url = `https://swscan.apple.com/content/catalogs/others/index-10.16seed-10.16-10.15-10.14-10.13-10.12-10.11-10.10-10.9-mountainlion-lion-snowleopard-leopard.merged-1.sucatalog`;
let macos_public_url = `https://swscan.apple.com/content/catalogs/others/index-11-10.15-10.14-10.13-10.12-10.11-10.10-10.9-mountainlion-lion-snowleopard-leopard.merged-1.sucatalog`;

var ios_public_value = quickdb.fetch(`ios_public_build`);
var ipados_public_value = quickdb.fetch(`ipados_public_build`);
var tvos_public_value = quickdb.fetch(`tvos_public_build`);
var audioos_public_value = quickdb.fetch(`audioos_public_build`);
var macos_public_value = quickdb.fetch(`macos_public_build`);
var macos_beta_value = quickdb.fetch(`macos_beta_version`);
var macos_intel_url = quickdb.fetch(`macos_url_version`);
var ios_beta_value = quickdb.fetch(`ios_beta_build`);
var ipados_beta_value = quickdb.fetch(`ipados_beta_build`);

function update_existed_values() {
  ios_public_value = quickdb.fetch(`ios_public_build`);
  ipados_public_value = quickdb.fetch(`ipados_public_build`);
  tvos_public_value = quickdb.fetch(`tvos_public_build`);
  audioos_public_value = quickdb.fetch(`audioos_public_build`);
  macos_public_value = quickdb.fetch(`macos_public_build`);
  macos_beta_value = quickdb.fetch(`macos_beta_version`);
  ios_beta_value = quickdb.fetch(`ios_beta_build`);
  ipados_beta_value = quickdb.fetch(`ipados_beta_build`);
  macos_intel_url = quickdb.fetch(`macos_url_version`);
}

function send_embeds(title, description, type) {
  console.log(`${title} - ${description} (type: ${type})`);
}

function pull_tvos_public_catalog() {
  update_existed_values();
  fetch(tvos_catalog_url).then(function(tvos) {
    return tvos.json();
  }).then(function(send_tvos) {
    send_embeds(`Pulling tvOS Public Updates...`, `tvOS Public_ OLD: ${tvos_public_value}; New: ${send_tvos.firmwares[0].buildid}`, `tvos_public`);
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
      .setAuthor(`macOS on Unsupported Macs`, `https://i.imgur.com/71KNcHE.png`)
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

function pull_ios_public_catalog() {
  update_existed_values();
  fetch(ios_catalog_url).then(function(ios) {
    return ios.json()
  }).then(function(send_ios) {
    send_embeds(`Pulling iOS Public Updates...`, `iOS Public_ OLD: ${ios_public_value}; New: ${send_ios.firmwares[0].buildid}`, `ios_public`);
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
      .setAuthor(`macOS on Unsupported Macs`, `https://i.imgur.com/71KNcHE.png`)
      .addField(`Version`, send_ios.firmwares[0].version, true)
      .addField(`Build`, send_ios.firmwares[0].buildid, true)
      .addField(`Size`, formatBytes(send_ios.firmwares[0].filesize), true)
      .setThumbnail(`https://ipsw.me/assets/devices/iPhone12,8.png`)
      .setColor(randomColor)
      .setTimestamp();
    client.send(embed);
    client.send(`<@&742679465276211312>`);
    quickdb.set('ios_public_build', send_ios.firmwares[0].buildid);

  }).catch(function(err) {
    console.log(err);
  });
}

function pull_ipados_public_catalog() {
  update_existed_values();
  fetch(ipados_catalog_url).then(function(ipados) {
    return ipados.json()
  }).then(function(send_ipados) {
    send_embeds(`Pulling iPadOS Public Updates...`, `iPadOS Public_ OLD: ${ipados_public_value}; New: ${send_ipados.firmwares[0].buildid}`, `ipados_public`);
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
      .setAuthor(`macOS on Unsupported Macs`, `https://i.imgur.com/71KNcHE.png`)
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

function pull_audioos_public_catalog() {
  update_existed_values();
  fetch(audioos_catalog_url).then(function(audioos) {
    return audioos.json()
  }).then(function(send_audioos) {
    send_embeds(`Pulling audioOS Public Updates...`, `audioOS Public_ OLD: ${audioos_public_value}; New: ${send_audioos.firmwares[0].buildid}`, `audioos_public`);
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
      .setAuthor(`macOS on Unsupported Macs`, `https://i.imgur.com/71KNcHE.png`)
      .addField(`Version`, send_audioos.firmwares[0].version, true)
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

function pull_ios_beta_catalog() {
  update_existed_values();
  request.get(ios_beta_catalog_url, function(error, response, body) {
    var count = 0
    let catalog_content = plist.parse(body);
    for (assets = 0; assets < catalog_content.Assets.length; assets++) {
      for (let devices in catalog_content.Assets[assets].SupportedDevices) {
        if (catalog_content.Assets[assets].SupportedDevices[0] == "iPhone12,1") {
          if (count == 1) break;
          let beta_ios_version = catalog_content.Assets[assets].OSVersion;
          let beta_ios_build = catalog_content.Assets[assets].Build;
          let beta_ios_id = catalog_content.Assets[assets].SUDocumentationID;
          let beta_ios_size = catalog_content.Assets[assets]._DownloadSize;

          send_embeds(`Pulling iOS Beta Updates...`, `iOS Beta_ OLD: ${ios_beta_value}; New: ${beta_ios_build}`, `ios_beta`);
          if (!ios_beta_value) {
            quickdb.set('ios_beta_build', beta_ios_build);
            return;
          }
          if (ios_beta_value == beta_ios_build) return;

          const randomColor = "#000000".replace(/0/g, function() {
            return (~~(Math.random() * 16)).toString(16);
          });
          const embed = new Discord.MessageEmbed()
            .setTitle(`📱 New iOS Beta Release!`)
            .setAuthor(`macOS on Unsupported Macs`, `https://i.imgur.com/71KNcHE.png`)
            .addField(`Name`, `iOS 14 Developer Beta ${beta_ios_id}`, true)
            .addField(`Version`, beta_ios_version)
            .addField(`Build`, beta_ios_build, true)
            .addField(`Size`, formatBytes(beta_ios_size))
            .setThumbnail(`https://ipsw.me/assets/devices/iPhone12,8.png`)
            .setColor(randomColor)
            .setTimestamp();
          client.send(embed);
          client.send(`<@&742679465276211312>`);
          quickdb.set('ios_beta_build', beta_ios_build);

          count = 1;
        }
        break;
      }
    }
  });
}

function pull_ipados_beta_catalog() {
  update_existed_values();
  request.get(ipados_beta_catalog_url, function(error, response, body) {
    var count = 0;
    let catalog_content = plist.parse(body);
    for (assets = 0; assets < catalog_content.Assets.length; assets++) {
      for (let devices in catalog_content.Assets[assets].SupportedDevices) {
        if (catalog_content.Assets[assets].SupportedDevices[0] == "iPad8,10") {
          if (count == 1) break;
          let beta_ipados_version = catalog_content.Assets[assets].OSVersion;
          let beta_ipados_build = catalog_content.Assets[assets].Build;
          let beta_ipados_id = catalog_content.Assets[assets].SUDocumentationID;
          let beta_ipados_size = catalog_content.Assets[assets]._DownloadSize;

          send_embeds(`Pulling iPadOS Beta Updates...`, `iPadOS Beta_ OLD: ${ipados_beta_value}; New: ${beta_ipados_build}`, `ipados_beta`);
          if (!ipados_beta_value) {
            quickdb.set('ipados_beta_build', beta_ipados_build);
            return;
          }
          if (ipados_beta_value == beta_ipados_build) return;

          const randomColor = "#000000".replace(/0/g, function() {
            return (~~(Math.random() * 16)).toString(16);
          });
          const embed = new Discord.MessageEmbed()
            .setTitle(`🎉 New iPadOS Beta Release!`)
            .setAuthor(`macOS on Unsupported Macs`, `https://i.imgur.com/71KNcHE.png`)
            .addField(`Name`, `iPadOS 14 Developer Beta ${beta_ipados_id}`, true)
            .addField(`Version`, beta_ipados_version)
            .addField(`Build`, beta_ipados_build, true)
            .addField(`Size`, formatBytes(beta_ipados_size))
            .setThumbnail(`https://ipsw.me/assets/devices/iPad8,10.png`)
            .setColor(randomColor)
            .setTimestamp();
          client.send(embed);
          quickdb.set('ipados_beta_build', beta_ipados_build);

          count = 1;
        }
        break;
      }
    }
  });
}

/* function pull_macos_beta_catalog() {
  update_existed_values();

  request(macos_beta_catalog_url, function(error, response, body) {
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

              send_embeds(`Pulling macOS Beta Updates...`, `macOS Beta_ OLD: ${macos_beta_value}; New: ${jsonData['installer-gui-script'].auxinfo.dict.string[1]._text}`, `macos_beta`);

              if (!macos_beta_value) {
                quickdb.set('macos_beta_version', jsonData['installer-gui-script'].auxinfo.dict.string[1]._text);
                return;
              }

              if (macos_beta_value <= jsonData['installer-gui-script'].auxinfo.dict.string[1]._text) return;

              const randomColor = "#000000".replace(/0/g, function() {
                return (~~(Math.random() * 16)).toString(16);
              });

              const embed = new Discord.MessageEmbed()
                .setTitle(`💻 New macOS Beta Release!`)
                .setDescription(`> For Intel Macs: ${catalog_content.Products[product].Packages[package].URL}`)
                .setAuthor(`macOS on Unsupported Macs`, `https://i.imgur.com/71KNcHE.png`)
                .addField(`Version`, jsonData['installer-gui-script'].auxinfo.dict.string[1]._text, true)
                .addField(`Build`, jsonData['installer-gui-script'].auxinfo.dict.string[0]._text, true)
                .addField(`Size`, formatBytes(catalog_content.Products[product].Packages[package].Size), true)
                .setThumbnail(`https://ipsw.me/assets/devices/MacBookPro17,1.png`)
                .setColor(randomColor)
                .setTimestamp();
              client.send(embed);
              client.send("<@&757663043126820991>");
              quickdb.set('macos_beta_version', jsonData['installer-gui-script'].auxinfo.dict.string[1]._text);
            });
          });

        }
      }
    }
  });
} */

/* function pull_macos_public_url() {
  update_existed_values();

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

              send_embeds(`Pulling macOS Public URL Updates...`, `macOS URL_ OLD: ${macos_intel_url}; New: ${jsonData['installer-gui-script'].auxinfo.dict.string[1]._text}`, `macos_url`);

              if (!macos_intel_url) {
                quickdb.set('macos_url_version', jsonData['installer-gui-script'].auxinfo.dict.string[1]._text);
                return;
              }

              if (macos_intel_url <= jsonData['installer-gui-script'].auxinfo.dict.string[1]._text) return;

              const randomColor = "#000000".replace(/0/g, function() {
                return (~~(Math.random() * 16)).toString(16);
              });

              const embed = new Discord.MessageEmbed()
                .setTitle(`💻 New macOS Public Release [Intel] !`)
                .setDescription(`> ${catalog_content.Products[product].Packages[package].URL}`)
                .setAuthor(`macOS on Unsupported Macs`, `https://i.imgur.com/71KNcHE.png`)
                .addField(`Version`, jsonData['installer-gui-script'].auxinfo.dict.string[1]._text, true)
                .addField(`Build`, jsonData['installer-gui-script'].auxinfo.dict.string[0]._text, true)
                .addField(`Size`, formatBytes(catalog_content.Products[product].Packages[package].Size), true)
                .setThumbnail(`https://ipsw.me/assets/devices/MacBookPro17,1.png`)
                .setColor(randomColor)
                .setTimestamp();
              client.send(embed);
              client.send("<@&757663043126820991>");
              quickdb.set('macos_url_version', jsonData['installer-gui-script'].auxinfo.dict.string[1]._text);
            });
          });

        }
      }
    }
  });
} */

function pull_macos_public_catalog() {
  update_existed_values();

  fetch(macos_catalog_url).then(function(macos) {
    return macos.json()
  }).then(function(send_macos) {
    send_embeds(`Pulling macOS Public Updates...`, `macOS Public_ OLD: ${macos_public_value}; New: ${send_macos.firmwares[0].buildid}`, `macos_public`);
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
      .setAuthor(`macOS on Unsupported Macs`, `https://i.imgur.com/71KNcHE.png`)
      .addField(`Version`, send_macos.firmwares[0].version, true)
      .addField(`Build`, send_macos.firmwares[0].buildid, true)
      .addField(`Size`, formatBytes(send_macos.firmwares[0].filesize), true)
      .setThumbnail(`https://ipsw.me/assets/devices/MacBookPro17,1.png`)
      .setColor(randomColor)
      .setTimestamp();
    client.send(embed);
    // client.send("<@&757663043126820991>");
    quickdb.set('macos_public_build', send_macos.firmwares[0].buildid);

  }).catch(function(err) {
    console.log(err);
  });
}

function pull_download_links() {
  // Beta OTA
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
      const randomColor = "#000000".replace(/0/g, function() {
        return (~~(Math.random() * 16)).toString(16);
      });

      fs.readFile('./seenlist_ota.txt', 'utf8', function (err,data) {
        if (err) return console.log(err);

        if (!data.includes(text.Assets[0].Build)) {
          // Send a message first

          const embed = new Discord.MessageEmbed()
            .setTitle(`💻 New macOS Beta Release!`)
            .setAuthor(`macOS on Unsupported Macs`, `https://i.imgur.com/71KNcHE.png`)
            .addField(`Version`, `macOS ${text.Assets[0].OSVersion} (${text.Assets[0].SUDocumentationID})`, true)
            .addField(`Build`, text.Assets[0].Build, true)
            .addField(`Size`, formatBytes(text.Assets[0]._DownloadSize), true)
            .setDescription(`OTA Update Package:\n> ${text.Assets[0].__BaseURL}${text.Assets[0].__RelativePath}`)
            .setThumbnail(`https://i.imgur.com/nxTPLLH.png`)
            .setColor(randomColor)
            .setTimestamp();
          client.send(embed);
          client.send("<@&757663043126820991>");

          // write the new build to file
          fs.appendFile('./seenlist_ota.txt', `\n${text.Assets[0].Build}`, (err) => {
            if (err) throw err;
          });
        }

      });
    })
    .catch(error => {
      console.error(error)
    });
}

function update_all() {
  pull_tvos_public_catalog();
  pull_ios_public_catalog();
  pull_ipados_public_catalog();
  pull_audioos_public_catalog();
  pull_macos_public_catalog();
  pull_download_links();
}

// STARTED....

update_all();

setInterval(function() {
  console.log(`----------------------------------------------`);
  update_all();
}, 10000);
