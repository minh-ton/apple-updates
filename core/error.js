// Send error messages to stderr in an organized format for debugging
require('./misc.js')();

module.exports = function () {
    this.log_error = function (message, location, process, task) {
        let time = getCurrentTime("Asia/Ho_Chi_Minh");
        let mode = (global.BETA_RELEASE) ? "BETA" : "PROD";
        const isError = (message instanceof Error);
        const msg = isError ? message.message : String(message);
        const stack = isError && message.stack ? `\n${message.stack}` : '';
        const meta = `File: ${location} | Process: ${process} | Task: ${task} | Mode: ${mode} | Time: ${time}`;
        console.error(`[ERROR] ${meta}\n${msg}${stack}`);
    };
}