const execa = require('execa');
const chalk = require('chalk');
const inquirer = require('inquirer');
const log = console.log;
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
    message: 'Select a template to start:',
    name: 't',
    choices: choices
  }];
  let {
    t
  } = await inquirer.prompt(promptList);

  let url = `${t.host}/${t.username}/${t.repo}/${t.branch}.git`;
  const {
    stdout
  } = await execa("git", ["branch"]);
  console.log('stdout', stdout);
}