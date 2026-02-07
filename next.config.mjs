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
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
  compress: false,
};

export default nextConfig;
