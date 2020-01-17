/**
 * 将develop分支rebase到test分支；
 */
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { log } = require('../common');
const { branchExists, getCurrentStatus } = require('../git');
const { DEVELOP_BRANCH_NAME, TEST_BRANCH_NAME } = require('../../config');
const Listr = require('listr');
module.exports = async (branchName) => {
  console.log(`----将develop分支rebase到test分支----`);
  let tasks = new Listr([
    {
      title: '检查是否有未commit',
      task: async () => {
        let status = await getCurrentStatus();
        if (status.length > 0) {
          throw new Error('存在未提交或未跟踪的文件！')
        }
      }
    },
    {
      title: `checkout ${branchName}分支`,
      task: async () => {
        if (await branchExists(branchName)) {
          await exec(`git checkout ${branchName}`);
        } else {
          throw new Error(`${branchName}不存在！`)
        }
      }
    },
    {
      title: `pull ${branchName}分支`,
      task: async () => {
        await exec(`git pull`);
      }
    },
    {
      title: `checkout ${TEST_BRANCH_NAME}分支`,
      task: async () => {
        if (await branchExists(TEST_BRANCH_NAME)) {
          await exec(`git checkout ${TEST_BRANCH_NAME}`);
        } else {
          await require('../createBranch/test')();
        }
      }
    },
    {
      title: `pull ${TEST_BRANCH_NAME}分支`,
      task: async () => {
        await exec(`git pull`);
      }
    },
    {
      title: `rebase ${branchName}分支`,
      task: async () => {
        await exec(`git rebase ${branchName}`);
      }
    },
    {
      title: `push ${TEST_BRANCH_NAME}分支`,
      task: async () => {
        await exec(`git push`);
      }
    }
  ]);
  try {
    await tasks.run();
  } catch (err) {
    log.error(err);
  }
}