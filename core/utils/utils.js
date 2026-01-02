// Some miscellaneous functions

module.exports = function () {
  this.formatUpdatesName = function (updateid, version, cname) {
    // tvOS SUDocumentationID is always "PreRelease"...
    if (cname.toLowerCase() === "tvos") {
      return "Beta";
    }

    if (!updateid.includes('Long') && !updateid.includes('Short') && !updateid.includes('RC')) {
      // Format & sanitize SUDocumentationID
      if (version.endsWith(".0")) version = version.substring(0, version.length - 2);
      let name_prefix = cname + version.replace('.', '');
      var document_id = (updateid.includes(name_prefix)) ? updateid.replace(name_prefix, '') : updateid.replace(cname + version.split('.')[0], '');

      document_id = document_id.replace(version.replace('.', ''), ''); // workaround for audioOS, weird

      // Get beta number from SUDocumentationID
      let beta_name = `Beta ${parseInt(document_id.replace(/[^0-9]/g, ""))}`;
      return beta_name;
    } else {
      // Release Candidate Updates
      return "Release Candidate";
    }
  }

  // generate bright/vibrant colors for embeds
  this.randomColor = function () {
    // Generate RGB values with high saturation and brightness
    const hue = Math.random() * 360;
    const saturation = 70 + Math.random() * 30; // 70-100%
    const lightness = 50 + Math.random() * 20; // 50-70%
    
    // Convert HSL to RGB
    const c = (1 - Math.abs(2 * lightness / 100 - 1)) * saturation / 100;
    const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
    const m = lightness / 100 - c / 2;
    
    let r, g, b;
    if (hue < 60) { r = c; g = x; b = 0; }
    else if (hue < 120) { r = x; g = c; b = 0; }
    else if (hue < 180) { r = 0; g = c; b = x; }
    else if (hue < 240) { r = 0; g = x; b = c; }
    else if (hue < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    
    // Convert to hex
    const toHex = (val) => {
      const hex = Math.round((val + m) * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return parseInt(toHex(r) + toHex(g) + toHex(b), 16);
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
