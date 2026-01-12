// Shared axios instance for all fetch operations

const http = require('http');
const https = require('https');
const axios = require('axios');

const axios_instance = axios.create({
    timeout: 15000,
    maxRedirects: 5,
    httpAgent: new http.Agent({
        keepAlive: true,
        maxSockets: 10,
        keepAliveMsecs: 30000
    }),
    httpsAgent: new https.Agent({
        keepAlive: true,
        maxSockets: 10,
        keepAliveMsecs: 30000
    })
});

module.exports = axios_instance;
