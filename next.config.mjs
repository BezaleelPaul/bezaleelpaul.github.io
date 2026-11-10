/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  allowedDevOrigins: ['192.168.1.14', 'localhost', '127.0.0.1'],
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
