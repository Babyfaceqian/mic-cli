/**
 * 从master分支检出一个新版本的develop分支
 */
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const log = require('./log');
const { branchExists, branchExistsOnRemote } = require('./git');
const { DEV_BRANCH_NAME } = require('../config');
const { getCurVersion } = require('./utils');
const Listr = require('listr');
const inquirer = require('inquirer');
const chalk = require('chalk');
module.exports = async (argv) => {
  console.log('argv', argv);
  let curVersion = getCurVersion();
  log.info(`当前master版本为 ${chalk.green(curVersion)}`)
  let promptList = [{
    type: 'input',
    message: '请输入新分支的版本号：',
    name: 'version'
  }];
  let {
    version
  } = await inquirer.prompt(promptList);
  version = version.trim();
  if (!version) {
    log.error('未输入正确版本号');
    return;
  }
  let branchName = `${DEV_BRANCH_NAME}/${version}`;
  const tasks = new Listr([
    {
      title: `检查${branchName}分支是否存在`,
      task: async (ctx) => {
        if (await branchExists(branchName)) {
          throw new Error(`${branchName}分支本地已存在！`)
        }
        if (await branchExistsOnRemote(branchName)) {
          throw new Error(`${branchName}分支远程已存在！`)
        }
      }
    },
    {
      title: `创建并切换到新分支`,
      task: async (ctx) => {
        await exec(`git checkout -b ${branchName} master`)
      }
    },
    {
      title: `关联远程分支`,
      task: async (ctx) => {
        await exec(`git push --set-upstream origin ${branchName}`)
      }
    }
  ]);

  tasks.run().catch(err => {
    log.error(err);
  });
}