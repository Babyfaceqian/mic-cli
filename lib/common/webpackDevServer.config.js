const host = process.env.HOST || '0.0.0.0';

module.exports = (proxy, port) => ({
  historyApiFallback: true,
  compress: true,
  clientLogLevel: 'none',
  hot: true,
  publicPath: '/',
  quiet: true,
  host,
  port,
  overlay: true,
  proxy,
  disableHostCheck: true
})