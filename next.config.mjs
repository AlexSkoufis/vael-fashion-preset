/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: the homepage deploys as plain files to any host.
  output: 'export',
  images: { unoptimized: true },
  reactStrictMode: true,
  // `next dev` and `next build` write to separate folders, so running a build while the
  // dev server is up can't corrupt its manifests ("layout router to be mounted" errors).
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
};
export default nextConfig;
