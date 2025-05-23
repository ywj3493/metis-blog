/** @type {import('next').NextConfig} */
import fs from "node:fs";
import path from "node:path";

const generateVerificationFile = () => {
  const verificationCode = process.env.GOOGLE_SITE_VERIFICATION;
  if (verificationCode) {
    const content = `google-site-verification: ${verificationCode}`;
    const filePath = path.join(process.cwd(), "public", verificationCode);
    fs.writeFileSync(filePath, content);
  }
};

const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.notion.so",
      },
      {
        protocol: "https",
        hostname: "noticon-static.tammolo.com",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      generateVerificationFile();
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
    ];
  },
};

export default nextConfig;
