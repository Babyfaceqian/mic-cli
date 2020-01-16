/**
 * 将release分支rebase到master分支；
 */
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const log = require('../common');
const { branchExists, getCurrentStatus } = require('../git');
const { getCurVersion } = require('../utils');
const { MASTER_BRANCH_NAME } = require('../../config');
const inquirer = require('inquirer');
const Listr = require('listr');
const chalk = require('chalk');
module.exports = async (branchName) => {
  console.log('----将release分支rebase到master分支----');
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
      title: `rebase ${branchName}分支`,
      task: async () => {
        await exec(`git rebase ${branchName}`);
      }
    },
    {
      title: `push ${MASTER_BRANCH_NAME}分支`,
      task: async () => {
        await exec(`git push`);
      }
    }
  ]);
  try {
    await tasks.run();
    let tag = getCurVersion();
    let list = [{
      type: 'editor',
      message: `请输入tag描述：`,
      name: 'desc'
    }];
    let {
      desc
    } = await inquirer.prompt(list);
    log.info('创建tag...')
    await exec(`git tag -a ${tag} -m ${desc}`);
    await exec(`git push --tags`);
    log.info('创建成功！')
  } catch (err) {
    log.error(err);
  }
}