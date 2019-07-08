/**
 * 将feature/*分支merge到develop分支；
 */
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const log = require('../log');
const { branchExists, getCurrentStatus } = require('../git');
const { DEVELOP_BRANCH_NAME } = require('../../config');
const Listr = require('listr');
module.exports = async (branchName) => {
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
      title: `merge ${branchName}分支`,
      task: async () => {
        await exec(`git merge ${branchName}`);
      }
    },
    {
      title: `push ${DEVELOP_BRANCH_NAME}分支`,
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