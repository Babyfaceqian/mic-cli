const { DEVELOP_BRANCH_NAME, FEATURE_BRANCH_NAME, TEST_BRANCH_NAME, RELEASE_BRANCH_NAME, HOTFIX_BRANCH_NAME, BUGFIX_BRANCH_NAME } = require('../../config');
const inquirer = require('inquirer');
module.exports = async (type) => {
  let action = (branchName) => {
    switch (branchName) {
      case DEVELOP_BRANCH_NAME:
        require('./develop')();
        break;
      case FEATURE_BRANCH_NAME:
        require('./feature')();
        break;
      case TEST_BRANCH_NAME:
        require('./test')();
        break;
      case RELEASE_BRANCH_NAME:
        require('./release')();
        break;
      case HOTFIX_BRANCH_NAME:
        require('./hotfix')();
        break;
      case BUGFIX_BRANCH_NAME:
        require('./bugfix')();
        break;
      default:
    }
  }
  if ([DEVELOP_BRANCH_NAME, FEATURE_BRANCH_NAME, TEST_BRANCH_NAME,  RELEASE_BRANCH_NAME, HOTFIX_BRANCH_NAME, BUGFIX_BRANCH_NAME].includes(type)) {
    action(type);
  } else {

    let choices = [
      {
        name: DEVELOP_BRANCH_NAME,
        value: DEVELOP_BRANCH_NAME
      },
      {
        name: FEATURE_BRANCH_NAME,
        value: FEATURE_BRANCH_NAME
      },
      {
        name: TEST_BRANCH_NAME,
        value: TEST_BRANCH_NAME
      },
      {
        name: RELEASE_BRANCH_NAME,
        value: RELEASE_BRANCH_NAME
      },
      {
        name: HOTFIX_BRANCH_NAME,
        value: HOTFIX_BRANCH_NAME
      },
      {
        name: BUGFIX_BRANCH_NAME,
        value: BUGFIX_BRANCH_NAME
      }
    ];
    let promptList = [{
      type: 'list',
      message: '请选择想要检出的分支：',
      name: 'branchName',
      choices
    }];
    let {
      branchName
    } = await inquirer.prompt(promptList);
    action(branchName);
  }

}