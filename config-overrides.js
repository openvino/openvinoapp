const webpack = require("webpack");
const dotenv = require("dotenv");

module.exports = function override(config, env) {
  // Agregar polyfills para módulos de node.js que no están incluidos por defecto en Webpack 5
  config.resolve.fallback = {
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    os: require.resolve("os-browserify/browser"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    zlib: require.resolve("browserify-zlib"),
    path: require.resolve("path-browserify"),
    fs: false,
  };

  // Cargar las variables de entorno desde el archivo .env
  const envConfig = dotenv.config().parsed;

  // Pasar las variables de entorno a la configuración de Webpack
  if (envConfig) {
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env": JSON.stringify(envConfig),
      })
    );
  }

  // Agregar plugins de Webpack si es necesario
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    })
  );

  return config;
};
