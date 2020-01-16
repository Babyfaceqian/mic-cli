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
  info(str) {
    log(info(str));
  },
  error(str) {
    log(error(str))
  },
  warn(str) {
    log(warn(str))
  },
  success(str) {
    log(success(str))
  }

};
module.exports = _log;