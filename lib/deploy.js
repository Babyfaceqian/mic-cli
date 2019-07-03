const util = require('util');
const exec = util.promisify(require('child_process').exec);
const inquirer = require('inquirer');
const log = require('./log');
const { getCurrentBranch, branchExists, branchExistsOnRemote, getCurrentStatus } = require('./git');
const { DEV_BRANCH_NAME, TEST_BRANCH_NAME } = require('../config');
const Listr = require('listr');
module.exports = async (argv) => {
  let curBranchName = getCurrentBranch();
  if (!curBranchName.startsWith(DEV_BRANCH_NAME)) {
    log.error(`请切换到${DEV_BRANCH_NAME}分支后再deploy！`);
    return;
  }
  let version = curBranchName.split('/')[1].trim();
  let testBranchName = TEST_BRANCH_NAME + '/' + version;
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
      title: `新建${testBranchName}分支`,
      task: () => {
        return new Listr([
          /** checkout -B 可替代以下注释代码 */
          // {
          //   title: `删除本地${testBranchName}分支`,
          //   task: async () => {
          //     if (await branchExists(testBranchName)) {
          //       try {
          //         await exec(`git branch -D ${testBranchName}`);
          //       } catch (e) {
          //         throw new Error('删除本地分支错误：', e);
          //       }
          //     }
          //   }
          // },
          // {
          //   title: `删除远程${testBranchName}分支`,
          //   task: async () => {
          //     if (await branchExistsOnRemote(testBranchName)) {
          //       try {
          //         await exec(`git branch -r -D origin/${testBranchName}`);
          //       } catch (e) {
          //         throw new Error('删除远程分支错误：', e);
          //       }
          //     }
          //   }
          // },
          {
            title: `创建${testBranchName}分支`,
            task: async () => {
              try {
                await exec(`git checkout -B ${testBranchName} ${curBranchName}`);
              } catch (e) {
                throw new Error('创建分支错误：', err.message);
              }
            }
          },
          {
            title: `关联远程${testBranchName}分支`,
            task: async (ctx) => {
              await exec(`git push -f --set-upstream origin ${testBranchName}`)
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