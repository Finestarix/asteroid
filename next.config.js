/** @type {import("next").NextConfig} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require("next-pwa");

module.exports = withPWA({
    pwa: {
        disable: process.env.NODE_ENV === "development",
        dest: "public",
        register: true,
        skipWaiting: true
    },
    reactStrictMode: true
});