阅读本文需要读者已经知道 [quick-reference](./Readme.md)。

本文主要剖析实现 quick-reference 的一些技术点

## 语法糖实现（文本转换）

文本转换使用 [remark](https://github.com/remarkjs/remark) markdown 转换器，也是 picidae 采用的。

remark 的处理 markdown 文本的流程如下：

```text
markdown - remark-parse - > mdast - remark-stringify - > markdown  
```

remark 将 markdown 解析成 [mdast (Markdown Abstract Syntax Tree)](https://github.com/syntax-tree/mdast)，我们通过处理 parse 过程或者 mdast 来修改最终的 markdown。

之所以不使用简单的文本替换，是因为在代码块中匹配的语法是不应该被替换的，这种方式健壮性更强。

## `quick-ref-watch` 和 `quick-ref` 数据通信

转换 markdown 文本，为什么需要多一个 `quick-ref-watch` 监控进程呢？

有两点考虑：

1. 用户可以直接开启 `-o, --enableOverwrite` 标志覆写更新的文件，而不依赖于任何一个 IDE；
2. 使用 watch 进程检测文件的更新、新增、删除，进而维护资源扁平化后的映射关系。

然后在 `quick-ref` 文本转换进程中

```text
if (检查 watch 进程维护的映射关系是否存在) { // 1
  取得已经存在的映射关系
}
else {
  遍历文档根目录，得到扁平化的资源映射关系
}
基于资源映射关系，进行转换逻辑
```

由于加上了 1 的逻辑，所以如果有个 watch 进程在维护映射关系，就不需要每一次转换都计算资源映射关系了，性能得以提升。

### 进程通信（IPC）

目前 linux 上面支持的 IPC 主要包括四类：

1. UNIX 早期 IPC：管道、FIFO、信号；
2. system V IPC：System V 消息队列、System V 信号灯、System V 共享内存区；
3. Posix IPC： Posix 消息队列、Posix 信号灯、Posix 共享内存区；
4. 基于 socket 的 IPC；

管道方式如我们经常在 shell 中使用的 `echo abc | tr [a-z] [A-Z]`

socket 方式被 unix 平台 mysql 使用

更多内容不具体展开讨论了，对 Linux 有兴趣的同学自己研究。

对于 node.js 中的 IPC，我简单写了[几个栗子](./ipc)

在这里我是用的[共享内存](https://github.com/kyriosli/node-shared-cache)（即同一块物理内存），在系统关机后，共享内存中的数据将会被清空。
