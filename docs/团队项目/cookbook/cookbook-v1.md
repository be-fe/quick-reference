---
title: "CookBook V1"
permalink: "cookbook-version-1"
---

使用 [Picidae](https://github.com/picidaejs) 构建，使用 [GitLab Web Hooks 触发远端构建流程](../release-scripts/index.md)

使用方法在[Readme](http://gitlab.baidu.com/be-fe/fe-cookbook)，值得留意的是**永链**和**菜单索引**概念的引入

### 关于自动构建流程

在阅读了[GitLab Web Hooks 触发远端构建流程](../release-scripts/index.md)之后，读者们了解到了远端构建的过程。在该项目中的 ci 脚本中，有下面一段脚本

```bash
echo "COMMIT_RANGE: ""$COMMIT_RANGE"
DEBUG=ci-run-staged npm run ci-run-staged
```

COMMIT_RANGE 是 ci 注入的环境变量，指的是本次触发的 git commit 的范围；之后是执行 ci-run-staged.

[ci-run-staged](https://github.com/imcuttle/ci-run-staged) 检查 commit range 文件变化，之后触发一些你希望的脚本工作。

对应在 `package.json` 中有下面一个片段：

```text
"ci-run-staged": {
  "Added": {
    "docs/**/*.md": [
      "node scripts/hi-message.js"
    ]
  }
},
```

上面配置的含义为：当本次 ci 中的提交集合中，新增了匹配 docs/\*_/_.md 的文件，则触发 node scripts/hi-message.js 脚本。

实际上，执行的是 node scripts/hi-message.js md-filename1 md-filename2 脚本，改动的文件路径会自动添加至后面。

在这是进行 hi 消息的推送。

### 成员

* 余聪
* 黎心仪
* ...
