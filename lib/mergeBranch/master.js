/**
 * 将master分支rebase到develop分支；
 */
const path = require('path');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { getCurVersion } = require('../utils');
const inquirer = require('inquirer');
const chalk = require('chalk');
const log = require('../common');
const { branchExists, getCurrentStatus } = require('../git');
const { RELEASE_BRANCH_NAME, DEVELOP_BRANCH_NAME } = require('../../config');
const Listr = require('listr');
module.exports = async (branchName) => {
  console.log('----将master分支rebase到develop分支----');
  console.log(`当前tag：${chalk.green(getCurVersion())}`)
  let list2 = [{
    type: 'input',
    message: `请输入tag：`,
    name: 'tag'
  }];
  let {
    tag
  } = await inquirer.prompt(list2);
  tag = tag.trim();
  if (!tag) {
    log.error('未输入正确tag');
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
        await exec(`git checkout ${DEVELOP_BRANCH_NAME}`);
      }
    },
    {
      title: `pull ${DEVELOP_BRANCH_NAME}分支`,
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
      title: `更新版本至${tag}`,
      task: async () => {
        let packageJSON = require(path.resolve('package.json'));
        packageJSON.version = tag;
        fs.writeFileSync(path.resolve('package.json'), JSON.stringify(packageJSON), function (err) {
          if (err) {
            return new Error('更新版本出错！');
          }
        });
        await exec(`git add .`);
        await exec(`git commit -m '更新版本'`);
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