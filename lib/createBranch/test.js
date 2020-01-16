/**
 * 从develop分支检出一个test分支，用于测试；
 */
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const log = require('../common');
const { branchExists, branchExistsOnRemote, getCurrentStatus } = require('../git');
const { DEVELOP_BRANCH_NAME, TEST_BRANCH_NAME } = require('../../config');
const Listr = require('listr');
module.exports = async (argv) => {
  console.log(`----从develop分支检出一个test分支----`);
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
      title: `checkout ${DEVELOP_BRANCH_NAME}分支`,
      task: async () => {
        if (await branchExists(DEVELOP_BRANCH_NAME)) {
          await exec(`git checkout ${DEVELOP_BRANCH_NAME}`);
        } else {
          await require('./develop')();
        }
      }
    },
    {
      title: `pull ${DEVELOP_BRANCH_NAME}分支`,
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
          if (await branchExistsOnRemote(TEST_BRANCH_NAME)) {
            await exec(`git checkout -b ${TEST_BRANCH_NAME} origin/${TEST_BRANCH_NAME}`);
          } else {
            await exec(`git checkout -b ${TEST_BRANCH_NAME}`);
            await exec(`git push --set-upstream origin ${TEST_BRANCH_NAME}`);
          }
        }
      }
    }
  ]);
  try {
    await tasks.run();
  } catch (err) {
    log.error(err);
  }
}