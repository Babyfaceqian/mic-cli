const mergeBranch = require('../lib/mergeBranch/merge');
module.exports = async (args) => {
  await mergeBranch(args);
}