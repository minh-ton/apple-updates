// Some miscellaneous functions

const prettyBytes = require('pretty-bytes');

module.exports = function () {
  // turn bytes into human-readable
  this.formatBytes = function (bytes) {
    return prettyBytes(bytes);
  };

  // generate random colors for the embeds
  this.randomColor = function () {
    var color = Math.floor(Math.random() * 16777215).toString(16);
    return color;
  };

  // device icons for os updates embeds
  this.getthumbnail = function (os) {
    switch (os.toLowerCase()) {
      case "tvos":
        return "https://i.imgur.com/cgzrNrw.png";
      case "audioos":
        return "https://ipsw.me/assets/devices/AudioAccessory5,1.png";
      case "macos":
        return "https://ipsw.me/assets/devices/MacBookPro17,1.png";
      case "ios":
        return "https://ipsw.me/assets/devices/iPhone13,4.png";
      case "ipados":
        return "https://ipsw.me/assets/devices/iPad13,6.png";
      case "watchos":
        return "https://ipsw.me/assets/devices/Watch5,4.png";
      default:
        return;
    }
  };

  // get time in a timezone
  this.getCurrentTime = function (timezone) {
    let nz_date_string = new Date().toLocaleString("en-US", { timeZone: timezone });
    let date_nz = new Date(nz_date_string);
    let year = date_nz.getFullYear();
    let month = ("0" + (date_nz.getMonth() + 1)).slice(-2);
    let date = ("0" + date_nz.getDate()).slice(-2);
    let hours = ("0" + date_nz.getHours()).slice(-2);
    let minutes = ("0" + date_nz.getMinutes()).slice(-2);
    let seconds = ("0" + date_nz.getSeconds()).slice(-2);
    let date_time = date + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds;
    return date_time;
  }
}