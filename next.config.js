const path = require('path');

module.exports = {
  // Add custom webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add custom loader for SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Setup an alias for absolute imports
    config.resolve.alias['@'] = path.resolve(__dirname);

    return config;
  },

  // Modify server configuration
  serverRuntimeConfig: {
    // Secrets and keys, available only on the server side
    mySecret: 'secret',
  },
  publicRuntimeConfig: {
    // Configuration available on both server and client
    staticFolder: '/public',
  },
};
