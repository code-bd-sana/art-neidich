/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "www.maisondepax.com",
      },
      {
        protocol: "https",
        hostname: "fha-inspector.s3.us-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/static-asset-v1.js",
        destination: "/static-asset-v1.js",
      },
    ];
  },
  compress: false,
};

export default nextConfig;
