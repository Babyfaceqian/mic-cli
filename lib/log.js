const chalk = require('chalk');
const log = (str) => {
  // TODO: 记录日志到文件
  console.log(str);
};
const info = chalk.white;
const error = chalk.red;
const warn = chalk.yellow;
const success = chalk.green;
const _log = {
  info() {
    let str = Array.from(arguments).toString();
    log(info(str));
  },
  error() {
    let str = Array.from(arguments).toString();
    log(error(str))
  },
  warn() {
    let str = Array.from(arguments).toString();
    log(warn(str))
  },
  success() {
    let str = Array.from(arguments).toString();
    log(success(str))
  }

};
module.exports = _log;