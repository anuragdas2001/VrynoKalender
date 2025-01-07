import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // async redirects() {
  //   return [
  //     {
  //       source: "/meetings",
  //       destination: "/meetings/upcoming",
  //       permanent: true,
  //     },
  //   ];
  // },
};

export default nextConfig;
