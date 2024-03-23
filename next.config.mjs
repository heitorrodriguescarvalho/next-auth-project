/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["*.github.dev", "localhost:3000"],
    }
  }
}

export default nextConfig
