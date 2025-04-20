import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'export',
    asePath: process.env.NODE_ENV === 'production' ? '/Chat' : '', 
    assetPrefix: process.env.NODE_ENV === 'production' ? '/Chat/' : '',
};

export default nextConfig;
