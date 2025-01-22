import withPWA from 'next-pwa';

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
