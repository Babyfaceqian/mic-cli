/**
 * 从master分支检出一个hotfix分支，用来修复线上问题；
 * 修复并测试完成后分别merge到release分支
 */
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const inquirer = require('inquirer');
const log = require('../log');
const { branchExists, branchExistsOnRemote, getCurrentStatus } = require('../git');
const { MASTER_BRANCH_NAME, HOTFIX_BRANCH_NAME } = require('../../config');
const Listr = require('listr');
module.exports = async (argv) => {
  let promptList = [{
    type: 'input',
    message: `请输入hotfix分支名：${HOTFIX_BRANCH_NAME}/`,
    name: 'bug'
  }];
  let {
    bug
  } = await inquirer.prompt(promptList);
  bug = bug.trim();
  if (!bug) {
    log.error('未输入正确分支名');
    return;
  }
  let branchName = `${HOTFIX_BRANCH_NAME}/${bug}`;
  if (await branchExists(branchName)) {
    log.error(`${branchName}分支已存在`);
    return;
  }
  if (await branchExistsOnRemote(branchName)) {
    log.error(`${branchName}分支远程已存在`);
    return;
  }
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
        await exec(`git checkout ${MASTER_BRANCH_NAME}`);
      }
    },
    {
      title: `pull ${MASTER_BRANCH_NAME}分支`,
      task: async () => {
        await exec(`git pull`);
      }
    },
    {
      title: `checkout ${branchName}分支`,
      task: async () => {
        await exec(`git checkout -b ${branchName}`);
        await exec(`git push --set-upstream origin ${branchName}`);
      }
    }
  ]);
  try {
    await tasks.run();
  } catch (err) {
    log.error(err);
  }
}