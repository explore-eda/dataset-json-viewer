import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      enabled: true
    }
  }
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true
})(nextConfig);
