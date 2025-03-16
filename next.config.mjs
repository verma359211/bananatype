/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		// Warning: This allows production builds to successfully complete
		// even if your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
		],
	},
	async headers() {
		return [
			{
				source: "/api/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "no-store, max-age=0, must-revalidate",
					},
				],
			},
		];
	},
};


export default nextConfig;
