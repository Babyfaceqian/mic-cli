/**
 * 从master分支检出一个hotfix分支，用来修复线上问题；
 * 修复并测试完成后分别merge到release分支
 */
const fs = require('fs');
const path = require('path');
const util = require('util');
const chalk = require('chalk');
const exec = util.promisify(require('child_process').exec);
const inquirer = require('inquirer');
const log = require('../log');
const { branchExists, branchExistsOnRemote, getCurrentStatus } = require('../git');
const { MASTER_BRANCH_NAME, HOTFIX_BRANCH_NAME } = require('../../config');
const { getCurVersion } = require('../utils');
const Listr = require('listr');
module.exports = async (argv) => {
  console.log(`----从master分支检出一个hotfix分支----`);
  let list1 = [{
    type: 'input',
    message: `请输入hotfix分支名：${HOTFIX_BRANCH_NAME}/`,
    name: 'bug'
  }];
  let {
    bug
  } = await inquirer.prompt(list1);
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