/**
 * 从test分支检出一个release分支，用于预发布；
 * 当测试没问题后，打tag，并合并到master分支
 */
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const log = require('../log');
const { branchExists, branchExistsOnRemote, getCurrentStatus } = require('../git');
const { TEST_BRANCH_NAME, RELEASE_BRANCH_NAME } = require('../../config');
const Listr = require('listr');
module.exports = async (argv) => {
  console.log(`----从test分支检出一个release分支----`);
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
      title: `checkout ${TEST_BRANCH_NAME}分支`,
      task: async () => {
        if (await branchExists(TEST_BRANCH_NAME)) {
          await exec(`git checkout ${TEST_BRANCH_NAME}`);
        } else {
          await require('./test')();
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
      title: `checkout ${RELEASE_BRANCH_NAME}分支`,
      task: async () => {
        if (await branchExists(RELEASE_BRANCH_NAME)) {
          await exec(`git checkout ${RELEASE_BRANCH_NAME}`);
        } else {
          if (await branchExistsOnRemote(RELEASE_BRANCH_NAME)) {
            await exec(`git checkout -b ${RELEASE_BRANCH_NAME} origin/${RELEASE_BRANCH_NAME}`);
          } else {
            await exec(`git checkout -b ${RELEASE_BRANCH_NAME}`);
            await exec(`git push --set-upstream origin ${RELEASE_BRANCH_NAME}`);
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