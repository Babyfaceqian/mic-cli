const log = require('./log');
const clearConsole = require('./clearConsole');
const formatMessages = require('webpack-format-messages');
const chalk = require('chalk');

const isInteractive = process.stdout.isTTY;

function printInstructions(appName, urls) {
  log.info(`
    当前项目：${chalk.bold(appName)}.

    ${chalk.bold('访问地址：')}${urls.localUrlForTerminal}
  `)
}

const createCompiler = ({ appName, urls, config, webpack }) => {
  let compiler;
  try {
    compiler = webpack(config);
  } catch (err) {
    log.error('编译失败');
    log.info();
    log.info(err.message || err);
    log.info();
    process.exit(1);
  }
  compiler.hooks.invalid.tap('invalid', () => {
    if (isInteractive) {
      clearConsole();
    }
    log.success('正在编译...');
  });
  let isFirstCompile = true;
  compiler.hooks.done.tap('done', async (stats) => {
    if (isInteractive) {
      clearConsole();
    }
    const messages = formatMessages(stats);
    const isSuccessful = !messages.errors.length && !messages.warnings.length;
    if (isSuccessful) {
      log.success('Compiled successfully!');
    }
    if (isSuccessful && (isInteractive || isFirstCompile)) {
      printInstructions(appName, urls);
    }

    isFirstCompile = false;

    if (messages.errors.length) {
      log.error('Failed to compile.');
      messages.errors.forEach(e => log.error(e));
      return;
    }

    if (messages.warnings.length) {
      log.warn('Compiled with warnings.');
      messages.warnings.forEach(w => log.warn(w));
    }
  });

  return compiler;
}

module.exports = createCompiler;