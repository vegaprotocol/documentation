const webpackbar = require('webpackbar');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

// Derived from https://github.com/facebook/docusaurus/issues/4765#issuecomment-1679863984
async function webpackDocusaurusPlugin(context, options) {
  return {
    name: 'webpack-docusaurus-plugin',
    configureWebpack(config, isServer, utils) {
      const isCI = process.env.CI;
      let cacheOptions

      // Right now, isServer is only used to avoid logging the cache disablement twice.
      // It could be used to support caching *only* for client assets (88mb brotli) or *only*
      // for server assets (44mb brotli) but right now, compression seems to end up as a sigkill
      if (isCI) {
        if (isServer) {
          // Only logs on server, purely so it only shows up once rather than twice
          console.log(`🚤  Allowing brotli ${ isServer ? 'server' : 'client'} webpack cache`);
          cacheOptions = isCI ? { cache: false } : { cache: { profile: true, type: 'filesystem', compression: 'brotli' }};
        } else {
          console.log(`ℹ️  Disabling ${ isServer ? 'server' : 'client'} webpack cache because Vercel sigkills`);
          cacheOptions = { cache: false }
        }

        cacheOptions = { cache: false }
      } else {
        if (isServer) {
          // Only logs on server, purely so it only shows up once rather than twice
          console.log(`🚤  Enabling filesystem cache 🚤🚤  (${ isServer ? 'server' : 'client' })`);
        }
        cacheOptions = isCI ? { cache: false } : { cache: { profile: true, type: 'filesystem' }};
      }

      const plugins = config.plugins.filter(p => {
        return !(p instanceof webpackbar);
      });

      // A more informative progress reporter than webpackbar
      plugins.push(new webpack.ProgressPlugin(),)

      const minimizer = new TerserPlugin({
        minify: TerserPlugin.esbuildMinify,
      });

      const minimizers = config.optimization.minimizer?.map((m) =>
          m instanceof TerserPlugin ? minimizer : m
      );

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
        plugins,
        // Use esbuild for quicker minimisation
        optimization: {
          minimizer: minimizers,
        },
      }
    },
    postBuild({ routesPaths, outDir }) {
      console.log(`✅  webpack-docusaurus-plugin: Built ${routesPaths.length} routes to ${outDir}`);
    }
  }
}

module.exports = webpackDocusaurusPlugin;