const util = require('util');
const exec = util.promisify(require('child_process').exec);
const inquirer = require('inquirer');
const log = require('./log');
const { getCurrentBranch, branchExists, branchExistsOnRemote, getCurrentStatus } = require('./git');
const { DEV_BRANCH_NAME, TEST_BRANCH_NAME, PROD_BRANCH_NAME } = require('../config');
const Listr = require('listr');
module.exports = async (argv) => {
  let curBranchName = getCurrentBranch();
  if (!curBranchName.startsWith(TEST_BRANCH_NAME)) {
    log.error(`请切换到${TEST_BRANCH_NAME}分支后再publish！`);
    return;
  }
  let version = curBranchName.split('/')[1].trim();
  let prodBranchName = PROD_BRANCH_NAME + '/' + version;
  const tasks = new Listr([
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
      title: `新建${prodBranchName}分支`,
      task: () => {
        return new Listr([
          {
            title: `创建${prodBranchName}分支`,
            task: async () => {
              try {
                await exec(`git checkout -B ${prodBranchName} ${curBranchName}`);
              } catch (e) {
                throw new Error('创建分支错误：', err.message);
              }
            }
          },
          {
            title: `关联远程${prodBranchName}分支`,
            task: async (ctx) => {
              await exec(`git push -f --set-upstream origin ${prodBranchName}`)
            }
          },
          {
            title: `切回${curBranchName}分支`,
            task: async (ctx) => {
              await exec(`git checkout -`)
            }
          }
        ])
      }
    }
  ]);

  tasks.run().catch(err => {
    log.error(err);
  });
}