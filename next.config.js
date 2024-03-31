// next.config.js
module.exports = {
  // Add custom webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add custom loader for SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  publicRuntimeConfig: {
    staticFolder: '/public',
  },
};
