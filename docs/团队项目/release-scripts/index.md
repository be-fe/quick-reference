---
title: Release Scripts
---

## What

release scripts 是一个搭建在 http://origin.eux.baidu.com:8999/ 的 Hook Server，
为什么会有一个这么名不副实的名字呢？因为一开始是考虑给组件库demo发布自动化定制的。

下面的内容需要读者阅读过[release scripts gitlab repo](http://gitlab.baidu.com/be-fe/release-scripts) Readme 之后才可食用。

## `/ci` api 实现机制

push 触发 `/ci` 请求后，Hook服务器将做下列工作

1. clone 仓库到服务区文件夹中
2. 拉取分支代码
3. git checkout 当前提交
4. 执行仓库文件中的 `ci` 脚本
