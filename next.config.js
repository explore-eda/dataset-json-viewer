const withPWA = require('next-pwa');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      enabled: true
    }
  }
};

module.exports = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true
})(nextConfig);
