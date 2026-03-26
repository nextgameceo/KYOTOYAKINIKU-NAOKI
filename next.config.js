/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // `domains` は Next.js 13.4 以降で非推奨のため `remotePatterns` に移行
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
        pathname: '/**',
      },
      // Google Places API のプロフィール画像（レビュー取得時に使用）
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
