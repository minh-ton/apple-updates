// Some miscellaneous functions

const prettyBytes = require('pretty-bytes');

module.exports = function () {
  // turn bytes into human-readable
  this.formatBytes = function (bytes) {
    return prettyBytes(bytes);
  };

  this.formatUpdatesName = function (updateid, version, cname) {
    // tvOS SUDocumentationID is always "PreRelease"...
    if (cname.toLowerCase() === "tvos") {
      return "Beta";
    }

    if (!updateid.includes('Long') && !updateid.includes('Short') && !updateid.includes('RC')) {
      // Format & sanitize SUDocumentationID
      if (version.endsWith(".0")) version = version.substring(0, version.length - 2);
      let name_prefix = cname + version.replace('.', '');
      var document_id = updateid.replace(name_prefix, '').replace(version.replace('.', ''), ''); // workaround for audioOS

      // Get beta number from SUDocumentationID
      let beta_name = `Beta ${parseInt(document_id.replace(/[^0-9]/g, ""))}`;
      return beta_name;
    } else {
      // Release Candidate Updates
      return "Release Candidate";
    }
  }

  // generate random colors for the embeds
  this.randomColor = function () {
    var color = Math.floor(Math.random() * 16777215).toString(16);
    return color;
  };

  // device icons for os updates embeds
  this.getThumbnail = function (os) {
    let link = 'https://minh-ton.github.io/apple-updates/icons/';
    let extension = '.png';

    var thumb = link + os.toLowerCase() + extension;
    return thumb;
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
