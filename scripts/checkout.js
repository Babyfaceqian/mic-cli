const createBranch = require('../lib/createBranch/create');
module.exports = async (args) => {
  await createBranch(args);
}