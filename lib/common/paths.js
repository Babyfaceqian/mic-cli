const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolvePath = relativePath => path.resolve(appDirectory, relativePath);
module.exports = {
  ROOT_PATH: resolvePath('.'),
  PKG_PATH: resolvePath('package.json'),
  SRC_PATH: resolvePath('src'),
  ENTRY_PATH: resolvePath('src/entry'),
  SERVER_PATH: resolvePath('server'),
  TEMPLATES_PATH: resolvePath('templates'),
  BUILD_PATH: resolvePath('build'),
  MODULES_PATH: resolvePath('node_modules'),
  ASSETS_PATH: 'assets',
  COMPONENTS_PATH: resolvePath('src/components'),
  OUTPUT_PATH: {
    development: resolvePath('/'),
    production: resolvePath('build')
  }
}