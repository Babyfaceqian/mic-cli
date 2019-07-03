const util = require('util');
const exec = util.promisify(require('child_process').exec);
const log = require('./log');
const { getCurrentBranch, branchExists, branchExistsOnRemote } = require('./git');
const { TEST_BRANCH_NAME } = require('../config');
const Listr = require('listr');
module.exports = async (argv) => {
  let curBranchName = getCurrentBranch();
  const tasks = new Listr([
    {
      title: `build ${curBranchName}分支`,
      task: async () => {
        await exec(`npm run build`);
      }
    }
  ]);

  tasks.run().catch(err => {
    log.error(err);
  });
}