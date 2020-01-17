const url = require('url');
const chalk = require('chalk');

function prepareUrls(protocol, host, port) {
  const formatUrl = (hostname) => url.format({
    protocol,
    hostname,
    port,
    pathname: '/'
  });
  const prettyPrintUrl = (hostname) => url.format({
    protocol,
    hostname,
    port: chalk.bold(port),
    pathname: '/'
  });

  const isUnspecifiedHost = host === '0.0.0.0' || host === '::';
  const prettyHost = isUnspecifiedHost ? 'localhost' : host;
  const localUrlForTerminal = prettyPrintUrl(prettyHost);
  const localUrlForBrowser = formatUrl(prettyHost);

  return {
    localUrlForTerminal,
    localUrlForBrowser
  }
}

module.exports = prepareUrls;