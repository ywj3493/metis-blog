import withTwin from "./withTwin.js";
/** @type {import('next').NextConfig} */
const nextConfig = withTwin({
  output: "standalone",
  experimental: {
    esmExternals: "loose",
  },
});

export default nextConfig;
