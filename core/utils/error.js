// Send error messages to stderr in an organized format for debugging
require('./utils.js')();

module.exports = function () {
    this.log_error = function (message, location, process, task) {
        let time = get_current_time("Asia/Ho_Chi_Minh");
        let mode = (global.BETA_RELEASE) ? "BETA" : "PROD";
        const is_error = (message instanceof Error);
        const msg = is_error ? message.message : String(message);
        const stack = is_error && message.stack ? `\n${message.stack}` : '';
        const meta = `File: ${location} | Process: ${process} | Task: ${task} | Mode: ${mode} | Time: ${time}`;
        console.error(`[ERROR] ${meta}\n${msg}${stack}`);
    };
}