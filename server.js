const next = require("next");
const http2 = require("node:http2");
const { parse } = require("node:url");
const fs = require("node:fs");
const selfsigned = require('selfsigned');

// 1. Generate certificates
// The 'selfsigned' library creates a key and a certificate for you.
// You can provide attributes for the certificate if you want.
const attrs = [{ name: 'commonName', value: 'localhost' }];
const pems = selfsigned.generate(attrs, {
    keySize: 2048, // The size of the RSA key in bits
    days: 365,     // How long the certificate is valid for
    algorithm: 'sha256', // The signing algorithm
});
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";

// Init the Next app:
const app = next({ dev, turbopack: true , turbo: true});

// Create the secure HTTPS server:
// Don't forget to create the keys for your development
const server = http2.createSecureServer({
    key: pems.private,
    cert: pems.cert,
});

const handler = app.getRequestHandler();
// if (config.server.compress) {
//     app.use(compression())
// }
app.prepare().then(() => {
    server.on("error", (err) => console.error(err));
    server.on("request", (req, res) => {
        const parsedUrl = parse(req.url, true);
        handler(req, res, parsedUrl);
    });
    server.listen(port);

    console.log(`Listening on HTTPS port ${port}`);
});