/**
 * 将指定或当前分支按照规则merge到对应的分支上
 * feature/* -> develop
 * bugfix/* -> develop
 * hotfix/* -> develop release
 */
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const inquirer = require('inquirer');
const { log } = require('../common');
const { getCurrentBranch } = require('../git');
const { HOTFIX_BRANCH_NAME, FEATURE_BRANCH_NAME, BUGFIX_BRANCH_NAME, RELEASE_BRANCH_NAME, TEST_BRANCH_NAME, DEVELOP_BRANCH_NAME, MASTER_BRANCH_NAME } = require('../../config');
module.exports = async (type) => {
  let curBranch = type || getCurrentBranch();
  if (curBranch.startsWith(FEATURE_BRANCH_NAME)) {
    await require('./feature')(curBranch);
  } else if (curBranch.startsWith(HOTFIX_BRANCH_NAME)) {
    await require('./hotfix')(curBranch);
  } else if (curBranch.startsWith(BUGFIX_BRANCH_NAME)) {
    await require('./bugfix')(curBranch);
  } else if (curBranch == DEVELOP_BRANCH_NAME) {
    await require('./develop')(curBranch);
  } else if (curBranch == TEST_BRANCH_NAME) {
    await require('./test')(curBranch);
  } else if (curBranch == RELEASE_BRANCH_NAME) {
    await require('./release')(curBranch);
  } else if (curBranch == MASTER_BRANCH_NAME) {
    await require('./master')(curBranch);
  } else {
    log.error('未输入分支名且未在正确分支上！')
  }
}