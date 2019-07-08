/**
 * 从master分支检出一个新版本的develop分支作为集成分支；
 * 提测后merge到test分支
 */
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const inquirer = require('inquirer');
const log = require('../log');
const { branchExists, getCurrentStatus, branchExistsOnRemote } = require('../git');
const { MASTER_BRANCH_NAME, DEVELOP_BRANCH_NAME } = require('../../config');
const Listr = require('listr');
module.exports = async (argv) => {
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
      title: `checkout ${MASTER_BRANCH_NAME}分支`,
      task: async () => {
        if (await branchExists(MASTER_BRANCH_NAME)) {
          await exec(`git checkout ${MASTER_BRANCH_NAME}`);
        } else {
          if (await branchExistsOnRemote(MASTER_BRANCH_NAME)) {
            await exec(`git checkout -b ${MASTER_BRANCH_NAME} origin/${MASTER_BRANCH_NAME}`);
          } else {
            await exec(`git checkout -b ${MASTER_BRANCH_NAME}`);
            await exec(`git push --set-upstream origin ${MASTER_BRANCH_NAME}`);
          }
        }
      }
    },
    {
      title: `pull ${MASTER_BRANCH_NAME}分支`,
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
          if (await branchExistsOnRemote(DEVELOP_BRANCH_NAME)) {
            await exec(`git checkout -b ${DEVELOP_BRANCH_NAME} origin/${DEVELOP_BRANCH_NAME}`);
          } else {
            await exec(`git checkout -b ${DEVELOP_BRANCH_NAME}`);
            await exec(`git push --set-upstream origin ${DEVELOP_BRANCH_NAME}`);
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