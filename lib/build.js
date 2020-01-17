const debug = require('debug')('build');
const chalk = require('chalk');
const { log } = require('./common');
const webpack = require('webpack');
const merge = require('webpack-merge');
const formatMessages = require('webpack-format-messages');
const webpackProdConfig = require('./webpack.prod.config');

module.exports = async () => {

  const config = merge(webpackProdConfig, {});

  const compiler = webpack(config);
  log.info('正在打包中...');
  compiler.run((err, stats) => {
    let messages;
    if (err) {
      if (!err.message) {
        log.error(err);
      }
      messages = formatMessages({
        errors: [err.message]
      })
    } else {
      messages = formatMessages(stats);
    }
    if (messages.errors.length) {
      if (messages.errors.length > 1) {
        messages.errors.length = 1;
      }
      log.error(messages.errors.join('\n\n'));
    } else {
      log.success('打包成功!');
      process.exit(1);
    }
  })
}