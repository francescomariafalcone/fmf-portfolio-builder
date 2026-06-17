/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  api: {
    bodyParser: false,
    responseLimit: '50mb',
  },
}

module.exports = nextConfig
