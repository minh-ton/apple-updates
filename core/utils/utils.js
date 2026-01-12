// Some miscellaneous functions

module.exports = function () {
  this.formatUpdatesName = function (update_id, version, os) {
    // tvOS SUDocumentationID is always "PreRelease"...
    if (os.toLowerCase() === "tvos") return "Beta";

    if (!update_id.includes('Long') && !update_id.includes('Short') && !update_id.includes('RC')) {
      // Format & sanitize SUDocumentationID
      if (version.endsWith(".0")) version = version.substring(0, version.length - 2);
      let name_prefix = os + version.replace('.', '');
      var document_id = (update_id.includes(name_prefix)) ? update_id.replace(name_prefix, '') : update_id.replace(os + version.split('.')[0], '');

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
    const chroma = (1 - Math.abs(2 * lightness / 100 - 1)) * saturation / 100;
    const intermediate = chroma * (1 - Math.abs((hue / 60) % 2 - 1));
    const match = lightness / 100 - chroma / 2;
    
    let r, g, b;
    if (hue < 60) { r = chroma; g = intermediate; b = 0; }
    else if (hue < 120) { r = intermediate; g = chroma; b = 0; }
    else if (hue < 180) { r = 0; g = chroma; b = intermediate; }
    else if (hue < 240) { r = 0; g = intermediate; b = chroma; }
    else if (hue < 300) { r = intermediate; g = 0; b = chroma; }
    else { r = chroma; g = 0; b = intermediate; }
    
    // Convert to hex
    const to_hex = (val) => {
      const hex = Math.round((val + match) * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return parseInt(to_hex(r) + to_hex(g) + to_hex(b), 16);
  };

  // device icons for os updates embeds
  this.getThumbnail = function (os) {
    let base_url = 'https://minh-ton.github.io/apple-updates/icons/';
    let extension = '.png';

    var icon_url = base_url + os.toLowerCase() + extension;
    return icon_url;
  };

  // get time in a timezone
  this.getCurrentTime = function (timezone) {
    let nz_date_string = new Date().toLocaleString("en-US", { timeZone: timezone });
    let parsed_date = new Date(nz_date_string);
    let year = parsed_date.getFullYear();
    let month = ("0" + (parsed_date.getMonth() + 1)).slice(-2);
    let date = ("0" + parsed_date.getDate()).slice(-2);
    let hours = ("0" + parsed_date.getHours()).slice(-2);
    let minutes = ("0" + parsed_date.getMinutes()).slice(-2);
    let seconds = ("0" + parsed_date.getSeconds()).slice(-2);
    let formatted_datetime = date + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds;
    return formatted_datetime;
  }
}
