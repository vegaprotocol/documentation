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
      const cacheOptions = isCI ? { cache: false } : { profile: true, type: 'filesystem' };

      if (cacheOptions.cache === false) {
        console.log('ℹ️  Disabling webpack cache because Vercel sigkills');
      } else {
        console.log('ℹ️  Enabling filesystem cache 🚤🚤');
      }

      const plugins = config.plugins.filter(p => {
        return !(p instanceof webpackbar);
      });

      // A more informative progress reporter than webpackbar
      plugins.push(new webpack.ProgressPlugin(),)

      return {
        // Ensure these new options get used
        mergeStrategy: {
          'cache': 'replace',
          'cache.type': 'replace',
          'cache.profile': 'replace',
          'infrastructureLogging.level': 'replace',
          'stats.all': 'replace',
          'optimization.minimizer': 'replace',
          'plugins': 'replace'
        },
        // Cache is too big for vercel
        ...cacheOptions,
        // Turns off webpackbar
        plugins
      }
    },
    postBuild({ routesPaths, outDir }) {
      console.log(`✅  webpack-docusaurus-plugin: Built ${routesPaths.length} routes to ${outDir}`);

      const isCI = process.env.CI;
      if (isCI) {
        rimraf.sync(path.join('node_modules/.cache'));
        console.log(`❤️‍🔥  Ensuring no cache is left behind`);
      }
    }
  }
}

module.exports = webpackDocusaurusPlugin;