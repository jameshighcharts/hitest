import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Map the ESM Highcharts build (which breaks webpack) to the UMD build
      "highcharts/esm/highcharts.src.js": path.resolve(
        __dirname,
        "node_modules/highcharts/highcharts.js"
      ),
    };
    return config;
  },
};

export default nextConfig;
