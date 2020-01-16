module.exports = async () => {
  let help = [
    '',
    '  mic-cli 使用帮助：',
    '',
    '    mic init         初始化模板',
    '    mic dev          开启本地服务器，进行开发调试',
    '    mic build        打包代码',
    '    mic publish      发布项目',
    '    mic help         显示帮助信息',
    '',
    ''
  ].join('\r\n');
  process.stdout.write(help);
}