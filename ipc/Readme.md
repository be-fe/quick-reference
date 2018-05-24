## node.js 中的 IPC

* [fork](./fork) - 父子进程中的 IPC
* [net](./net) - 非父子进程中的 socket IPC

### 问题

* 参考 fork 方式，如何实现一个迷你的 [nodemon](https://github.com/remy/nodemon) （监控文件改动，重启进程）？  
  [参考答案](https://github.com/imcuttle/isomorphic-blog/blob/master/backend/index.js)
