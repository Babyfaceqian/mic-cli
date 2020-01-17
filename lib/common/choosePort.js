const chalk = require('chalk');
const detect = require('detect-port');
const inquirer = require('inquirer');
const clearConsole = require('./clearConsole');

async function choosePort(host, defaultPort) {
  const port = await detect(defaultPort, host);
  if (port === defaultPort) {
    return port;
  }
  clearConsole();
  const question = {
    type: 'confirm',
    name: 'shouldChangePort',
    message: chalk.yellow(`${defaultPort} was occupied, try ${port} ?`),
    default: true
  }
  const { shouldChangePort } = await inquirer.prompt(question);
  if (shouldChangePort) { 
    return port;
  }
  return defaultPort;
}

module.exports = choosePort;