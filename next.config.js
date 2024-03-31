// next.config.js
module.exports = {
  // Customize the build directory
  distDir: 'build',

  // Add custom webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add custom loader for SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  // Modify server configuration
  serverRuntimeConfig: {
    // Available only on the server side
    mySecret: 'secret',
  },
  publicRuntimeConfig: {
    // Available on both server and client
    staticFolder: '/public',
  },
};
