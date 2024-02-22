const webpackbar = require('webpackbar');
const webpack = require('webpack');

// Derived from https://github.com/facebook/docusaurus/issues/4765#issuecomment-1679863984
async function webpackDocusaurusPlugin(context, options) {
  return {
    name: 'webpack-docusaurus-plugin',
    configureWebpack(config, isServer, utils) {
      const isCI = process.env.CI;

      const cacheOptions = isCI ? { cache: false } : {};

      if (cacheOptions.cache === false) {
        console.log(`️️⛏️  webpack-docusaurus-plugin: Disabling webpack cache (${isServer ? 'server' : 'client'  })`);
      } else {
        console.log(`⛏️  webpack-docusaurus-plugin: Outputs will be cached and compressed (${isServer ? 'server' : 'client'  })`);
      }
      const plugins = config.plugins.filter(p => {
        if (p instanceof webpackbar) {
          return false
        }
        return true
      }
      );
      plugins.push(new webpack.ProgressPlugin(),)
      return {
        // Ensure these new options get used
        mergeStrategy: {
          'cache': 'replace',
          'infrastructureLogging.level': 'replace',
          'stats.all': 'replace',
          'optimization.minimizer': 'replace',
          'plugins': 'replace'
        },
        // Disables cache in CI
        ...cacheOptions,
        // Turns off webpackbar
        plugins
      };
    },
    postBuild({ routesPaths, outDir }) {
      console.log(`✅  webpack-docusaurus-plugin: Built ${routesPaths.length} routes to ${outDir}`);
    }
  }
}

module.exports = webpackDocusaurusPlugin;