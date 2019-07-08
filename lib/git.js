const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

exports.getCurrentBranch = function () {
  let s = fs.readFileSync('.git/HEAD');
  let b = s.toString().split('ref: refs\/heads\/')[1].trim();
  return b;
}
exports.getCurrentStatus = async function () {
  let { stdout } = await exec('git status -s');
  return stdout.split('\n').filter(it => it);
}

exports.getBranches = async function () {
  let { stdout } = await exec('git branch -l');
  return stdout.split('\n').map(it => it.replace(/(^\*)|(\s+)/g, ''));
}

exports.branchExists = async function (branchName) {
  let branches = await exports.getBranches();
  return branches.includes(branchName);
}

exports.branchExistsOnRemote = async function (branchName) {
  try {
    const { stdout } = await exec(`git rev-parse --quiet --verify refs/remotes/origin/${branchName}`);
    if (stdout) {
      return true;
    }
    return false;
  } catch (e) {
    if (e.stdout === '' && e.stderr === '') {
      return false;
    }
    throw error;
  }
}