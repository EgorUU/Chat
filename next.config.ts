import type { NextConfig } from "next";
const repoName = '/Chat'
const nextConfig: NextConfig = {
    output: 'export',
    assetPrefix: repoName,
    basePath: repoName,
    trailingSlash: true
};

export default nextConfig;
