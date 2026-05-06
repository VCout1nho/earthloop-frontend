/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,   // ← Adicione esta linha
  },
}

module.exports = nextConfig