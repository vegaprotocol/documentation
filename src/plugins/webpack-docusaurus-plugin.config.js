const webpackbar = require('webpackbar');
const webpack = require('webpack');
const rimraf = require('rimraf');
const path = require('path');

// Derived from https://github.com/facebook/docusaurus/issues/4765#issuecomment-1679863984
async function webpackDocusaurusPlugin(context, options) {
  return {
    name: 'webpack-docusaurus-plugin',
    configureWebpack(config, isServer, utils) {
      const isCI = process.env.CI;

      if (isCI === false) {
        console.log(`️️⛏️  webpack-docusaurus-plugin: Using memory cache (${isServer ? 'server' : 'client'  })`);
      } else {
        console.log(`⛏️  webpack-docusaurus-plugin: Using file system cache (brotli) (${isServer ? 'server' : 'client'  })`);
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
          'cache.compression': 'replace',
          'cache.type': 'replace',
          'infrastructureLogging.level': 'replace',
          'stats.all': 'replace',
          'optimization.minimizer': 'replace',
          'plugins': 'replace'
        },
        // Disables cache in CI
        cache: {
          type: isCI ? 'filesystem' : 'memory',
          compression: 'brotli',
        },
        // Turns off webpackbar
        plugins
      }
    },
    postBuild({ routesPaths, outDir }) {
      console.log(`✅  webpack-docusaurus-plugin: Built ${routesPaths.length} routes to ${outDir}`);
    }
  }
}

module.exports = webpackDocusaurusPlugin;