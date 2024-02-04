/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        HOST: process.env.HOST,
        AZURE_ENDPOINT: process.env.AZURE_ENDPOINT,
        AZURE_KEY: process.env.AZURE_KEY,
        NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
        HUB_URL: process.env.HUB_URL
    }
};

export default nextConfig;
