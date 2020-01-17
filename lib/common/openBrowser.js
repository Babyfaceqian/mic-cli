const open = require('open');
const log = require('./log');
const browsers = {
  chrome: {
    'darwin': 'google chrome',
    'win32': 'chrome',
    'linux': 'google-chrome'
  },
  ie: {
    'darwin': 'ie',
    'win32': 'ie',
    'linux': 'ie'
  },
  firefox: {
    'darwin': 'firefox',
    'win32': 'firefox',
    'linux': 'firefox'
  }
}
async function openBrowser(url) {
  let browser = process.env.BROWSER;
  if (!browser) {
    await open(url);
  } else {
    if (!browsers[browser]) {
      throw new Error(`Incorrect browser type: ${browser}, please specify a browser type from: chrome, ie, firefox.`)
    }
    let value = browsers[browser][process.platform];
    log.success(`Opening ${url} in ${browser}`);
    await open(url, { app: [value] });
  }
}

module.exports = openBrowser;