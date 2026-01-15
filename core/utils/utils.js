// Some miscellaneous functions
const axios = require('axios');

module.exports = function () {
  this.format_documentation_id = function (update_id, version, os) {
    // tvOS SUDocumentationID is always "PreRelease"...
    if (os === "tvos") return "Beta";

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
  this.random_color = function () {
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
  this.get_os_icon = async function (os, version = null) {
    const base_url = 'https://minh-ton.github.io/apple-updates/icons/';
    const extension = '.png';

    const multiple_icon_os = ['ios', 'ipados', 'macos', 'watchos', 'tvos'];

    var icon_url = base_url + os + (version && multiple_icon_os.includes(os) ? version : '') + extension;
    
    // I just want to update the icon for new OS versions
    // later after WWDC, so we'll just use a generic icon
    // for newly-added asset audiences.
    try {
      await axios.head(icon_url, { timeout: 5000 });
      return icon_url;
    } catch (error) {
      return base_url + os + extension;
    }
  };

  this.get_os_displayname = function (os) {
    switch (os.toLowerCase()) {
      case 'ios': return 'iOS';
      case 'ipados': return 'iPadOS';
      case 'macos': return 'macOS';
      case 'tvos': return 'tvOS';
      case 'watchos': return 'watchOS';
      case 'visionos': return 'visionOS';
      case 'audioos': return 'HomePod Software';
      default: return os;
    }
  };

  // get time in a timezone
  this.get_current_time = function (timezone) {
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
  };

  this.convert_date_to_epoch = function (date_string) {
    return Math.floor(new Date(date_string).getTime() / 1000);
  };

  this.is_beta_build = function (build, source = null) {
    let is_beta = build.length > 6 && build.toUpperCase() != build;
    
    if (typeof source === 'boolean') {
      // 'source' here is the type of catalog or asset audience
      // the update was fetched from. In the update_info command,
      // it passed the 'beta' boolean value from the saved update
      // info in the database.
      // So source == true means beta, false means public.
      if (source === false) return false; // not fetched from a beta catalog
      if (source === true && !is_beta) return true; // categorize this as a RC build
    }

    return is_beta;
  };

  this.parse_version = function (version_str) {
    const parts = version_str.split('.').map(p => parseInt(p));
    return {
        major: parts[0] || 0,
        minor: parts[1] || 0,
        patch: parts[2] || 0
    };
  };

  this.compare_versions = function (v1, v2) {
    const p1 = parse_version(v1);
    const p2 = parse_version(v2);
    
    if (p1.major !== p2.major) return p1.major - p2.major;
    if (p1.minor !== p2.minor) return (p1.minor || 0) - (p2.minor || 0);
    return (p1.patch || 0) - (p2.patch || 0);
  };
}
