const merge = require('webpack-merge');
const webpack = require('webpack');
const webpackCommonConfig = require('./webpack.common.config');
module.exports = merge(webpackCommonConfig, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  // devServer: {
  //   // contentBase: './dist',
  //   port
  // }
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
});