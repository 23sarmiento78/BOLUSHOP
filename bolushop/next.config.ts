import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/colecciones", destination: "/ofertas", permanent: true },
      { source: "/coleccion/:slug", destination: "/oferta/:slug", permanent: true },
      { source: "/admin/collections", destination: "/admin/ofertas", permanent: false },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'droppers.com.ar',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.mlstatic.com',
      }
    ],
  }
};

export default nextConfig;
