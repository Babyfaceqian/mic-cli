const util = require('util');
const exec = util.promisify(require('child_process').exec);
const inquirer = require('inquirer');
const log = require('./common');
module.exports = async (argv) => {
  let templateConfig = require('../config/template.json');
  let choices = templateConfig.templates.map(it => {
    let obj = {};
    obj.name = it.name;
    obj.value = it;
    obj.short = it.name;
    return obj;
  });
  const promptList = [{
    type: 'list',
    message: '请选择一个模板：',
    name: 't',
    choices: choices
  }];
  let {
    t
  } = await inquirer.prompt(promptList);
  try {
    log.info(`下载${t.name}模板中...`)
    let { stdout, stderr } = await exec(`git clone -b ${t.branch} ${t.repo} ./`);
    await exec('rm -rf .git');
    log.success('下载成功！');
  } catch (error) {
    log.error(error);
  }
}