/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental : {
        serverActions : {
            bodySizeLimit : '4mb',
        }
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '**',
            },
        ],
    },
};

export default nextConfig;
