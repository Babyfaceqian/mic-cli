const fs = require('fs');
const chalk = require('chalk');
const { paths, choosePort, createCompiler, webpackDevServerConfig, log, openBrowser, prepareUrls } = require('./common');
const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackDevServer = require('webpack-dev-server');
const webpackDevConfig = require('./webpack.dev.config');
const HOST = process.env.HOST || '0.0.0.0';

module.exports = async () => {
  const pkg = require(paths.PKG_PATH);
  const { name, fedOptions } = pkg;
  const { proxyPort, mockPort, devServer = {} } = fedOptions || {};
  const PROXY_PORT = Number(proxyPort) || 8080;
  const MOCK_PORT = Number(mockPort) || 3000;
  const port = await choosePort(HOST, PROXY_PORT);
  const serverPort = await choosePort(HOST, MOCK_PORT);
  const config = merge(webpackDevConfig, {
    devServer: {
      port
    }
  });

  const urls = prepareUrls('http', HOST, port);
  const compiler = createCompiler({
    appName: name,
    urls,
    config,
    webpack
  });
  const proxyConfig = {};
  if (fs.existsSync(paths.SERVER_PATH)) {
    const usrServerConf = require(paths.SERVER_PATH);
    const proxyUrl = `http://127.0.0.1:${serverPort}`;
    for (const key of Object.keys(usrServerConf)) {
      proxyConfig[key] = { target: proxyUrl, changeOrigin: true };
    }
  }
  const serverConfig = webpackDevServerConfig(proxyConfig, port);
  const webpackDevServer = new WebpackDevServer(compiler, serverConfig);
  webpackDevServer.listen(port, HOST, (err) => {
    if (err) {
      log.error(err);
    }
    log.info('正在编译，请稍等...\n');
    openBrowser(urls.localUrlForBrowser)
  })

  // ['SIGINT', 'SIGTERM'].forEach(sig => {
  //   process.on(sig, () => {
  //     webpackDevServer.close();
  //     process.exit();
  //   });
  // });
}