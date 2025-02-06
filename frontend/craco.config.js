// craco.config.js
module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        webpackConfig.resolve.fallback = {
          crypto: require.resolve("crypto-browserify"),
          os: require.resolve("os-browserify"),
          path: require.resolve("path-browserify"),
          stream: require.resolve("stream-browserify"),
          http: require.resolve("stream-http"),
          https: require.resolve("https-browserify"),
          zlib: require.resolve("browserify-zlib"),
          util: require.resolve("util"),
          vm: require.resolve("vm-browserify"),
          url: require.resolve("url"),
          process: require.resolve("process/browser"), // Polyfill process
        };
        return webpackConfig;
      },
    },
  };
  