const path = require('path');
exports.getCurVersion = function () {
  return require(path.resolve('package.json')).version;
}