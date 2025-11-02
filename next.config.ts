import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHost = (() => {
  try {
    return supabaseUrl ? new URL(supabaseUrl).hostname : undefined;
  } catch (_) {
    return undefined;
  }
})();

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
    pathname: "**",
  },
  {
    protocol: "https",
    hostname: "source.unsplash.com",
    pathname: "**",
  },
  {
    protocol: "https",
    hostname: "picsum.photos",
    pathname: "**",
  },
  {
    protocol: "https",
    hostname: "fastly.picsum.photos",
    pathname: "**",
  },
  {
    protocol: "https",
    hostname: "images.pexels.com",
    pathname: "**",
  },
];

if (supabaseHost) {
  remotePatterns.push({ protocol: "https", hostname: supabaseHost, pathname: "**" });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
    qualities: [75, 100],
  },
};

export default nextConfig;
