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

// Ensure the correct port is used from environment variables
const port = process.env.PORT || 8080;
if (require.main === module) {
  import('http').then((http) => {
    http.createServer((req, res) => {
      res.writeHead(200);
      res.end('Server is running');
    }).listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  });
}
