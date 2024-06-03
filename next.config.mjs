/** @type {import('next').NextConfig} */
import fs from "fs";
import path from "path";

const generateVerificationFile = () => {
  const verificationCode = process.env.GOOGLE_SITE_VERIFICATION;
  if (verificationCode) {
    const content = `google-site-verification: ${verificationCode}`;
    const filePath = path.join(process.cwd(), "public", verificationCode);
    fs.writeFileSync(filePath, content);
  }
};

const nextConfig = {
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
};

export default nextConfig;
