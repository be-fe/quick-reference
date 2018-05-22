## 问题描述

ERA 项目中, 碰到一个数据拿到, 但视图不更新的恶心bug.

doc : http://doc.eux.baidu.com/app/list/5bdef5b0266689ec24/hn1q338c_2f1qx2

## 实际原因

avalon 的 ViewModel 中有这样的约定 `$` 开头的属性, 或是 `$skipArray` 中的属性, 不会被加入监控!!! 是一个约定!!! 由于前一任开发者没注意这一个点, 导致出现这个 bug.

http://avalonjs.coding.me/vm.html#监控属性

