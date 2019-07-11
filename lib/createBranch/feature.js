/**
 * 从develop分支检出一个feature分支，用来开发新功能；
 * 开发并自测没问题后合并到develop分支
 */
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const inquirer = require('inquirer');
const log = require('../log');
const { branchExists, getCurrentStatus, branchExistsOnRemote } = require('../git');
const { DEVELOP_BRANCH_NAME, FEATURE_BRANCH_NAME } = require('../../config');
const Listr = require('listr');
module.exports = async (argv) => {
  console.log(`----从develop分支检出一个feature分支----`);
  let promptList = [{
    type: 'input',
    message: `请输入功能分支名：${FEATURE_BRANCH_NAME}/`,
    name: 'feature'
  }];
  let {
    feature
  } = await inquirer.prompt(promptList);
  feature = feature.trim();
  if (!feature) {
    log.error('未输入正确分支名');
    return;
  }
  let branchName = `${FEATURE_BRANCH_NAME}/${feature}`;
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
      title: `检查是否已存在${branchName}分支`,
      task: async () => {
        if (await branchExists(branchName) || await branchExistsOnRemote(branchName)) {
          throw new Error('分支名重复，请修改分支名后重新创建！')
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