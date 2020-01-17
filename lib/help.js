module.exports = async () => {
  let help = [
    '',
    '  mic-cli 使用帮助：',
    '',
    '    mic init               初始化模板',
    '    mic dev                开启本地服务器，进行开发调试',
    '    mic build              打包代码',
    '    mic checkout [branch]  新建下游分支',
    '    mic merge [branch]     将分支合并到上游分支',
    '    mic help               显示帮助信息',
    '',
    ''
  ].join('\r\n');
  process.stdout.write(help);
}