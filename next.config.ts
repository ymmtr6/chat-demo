import type { NextConfig } from "next";

const isMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";

const nextConfig: NextConfig = {
  ...(isMock && {
    output: "export",
    basePath: "/chat-demo",
    images: { unoptimized: true },
  }),
};

export default nextConfig;
