const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolvePath = relativePath => path.resolve(appDirectory, relativePath);
module.exports = {
  ROOT_PATH: resolvePath('.'),
  PKG_PATH: resolvePath('package.json'),
  SRC_PATH: resolvePath('src'),
  BUILD_PATH: resolvePath('build'),
  MODULES_PATH: resolvePath('node_modules'),
  ASSETS_PATH: resolvePath('src/assets'),
  OUTPUT_PATH: {
    development: resolvePath('/'),
    production: resolvePath('build')
  }
}