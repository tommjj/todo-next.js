/** @type {import('next').NextConfig} */
const nextConfig = {
    headers: () => [
        {
            source: '/tasks/:board*',
            headers: [
                {
                    key: 'Cache-Control',
                    value: 'no-store',
                },
            ],
        },
    ],
};

module.exports = nextConfig;
