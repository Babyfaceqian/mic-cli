## 分支管理逻辑
| 分支名 | 上游分支 | 下游分支 | 描述 |
| ------ | -------- | -------- | ---- |
| master | release | develop | 主（线上）分支，变基到release分支得来，拉出develop分支 |
| develop | master | test | 开发集成分支，从master拉出，或变基到master分支得来，拉出test分支，用于功能开发集成 |
| test | develop | release | 测试分支，从develop拉出，或变基到develop分支得来，拉出release分支，用于测试环境测试 |
| release | test | master | 预发布分支，从test拉出，或变基到test分支得来，用于预发布环境测试 |
| feature/* | develop | develop | 功能分支，从develop分支拉出，merge到develop，用于开发新功能 |
| bugfix/* | develop | develop | 测试环境bug修复分支，从develop分支拉出，merge到develop，用于修复测试bug |
| hotfix/* | master | master | 线上环境bug修复分支，从master分支拉出，测试完成后，merge到master，用于临时修复线上问题
## 安装
```
$ npm install mic-cli -g
```
## 指令
### init
选择并下载模板。
```
$ mic init
  ? 请选择一个模板： (Use arrow keys)
  ❯ react 
    d3 
```
### checkout [branchType]
新建或切换到某个类型分支。
```
$ mic checkout
  ? 请选择想要检出的分支： (Use arrow keys)
  ❯ develop 
    feature 
    test 
    release 
    hotfix 
    bugfix

$ mic checkout develop
  ✔ 检查是否有未commit
  ✔ checkout master分支
  ✔ pull master分支
  ✔ checkout develop分支
```
### merge [branchName]
合并或变基到下游分支。branchName为空时，默认当前分支。
```
$ mic merge test
  ✔ 检查是否有未commit
  ✔ checkout test分支
  ✔ pull test分支
  ✔ checkout release分支
  ✔ pull release分支
  ✔ rebase test分支
  ✔ push release分支
```

## 配置
```javascript
// config/index.js

// 主（发布）分支名
exports.MASTER_BRANCH_NAME = 'master';
// 开发分支名
exports.DEVELOP_BRANCH_NAME = 'develop';
// 功能分支名
exports.FEATURE_BRANCH_NAME = 'feature';
// 测试分支名
exports.TEST_BRANCH_NAME = 'test';
// 预发分支名
exports.RELEASE_BRANCH_NAME = 'release';
// hotfix分支名
exports.HOTFIX_BRANCH_NAME = 'hotfix';
// bugfix分支名
exports.BUGFIX_BRANCH_NAME = 'bugfix';

// template.json

{
  "templates": [{
      "name": "react",
      "repo": "https://github.com/username/templates.git",
      "branch": "react"
    },
    {
      "name": "d3",
      "repo": "https://github.com/username/templates.git",
      "branch": "d3"
    }
  ]
}
```