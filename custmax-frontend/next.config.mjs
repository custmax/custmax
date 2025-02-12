/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.module.scss$/,
      use: [
        {
          loader: "postcss-loader",
        },
        {
          loader: "sass-loader",
        },
      ],
      exclude: path.resolve(__dirname, "node_modules"),
    })

    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '69.164.202.126',
      },
    ],
    // unoptimized: true, // if you want static export, you would use it
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  async rewrites() {
    return [
      {
        source: '/api3/:path*',
        destination: 'https://api2.sendcloud.net/:path*'
      }
    ]
  }
};

export default nextConfig;
