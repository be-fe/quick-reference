/**
 * @file parent
 * @author Cuttle Cong
 * @date 2018/5/24
 * @description
 */
const nps = require('path')
const cp = require('child_process')
const fs = require('fs')

let child = cp.fork(nps.join(__dirname, 'child.js'), {
  stdio: [0, 1, 2, 'ipc']
  // stdio: [0, fs.openSync(nps.join(__dirname, 'child.stdout'), 'w'), 2, 'ipc']
})

child.send('hi child! I\'m parent')

child.on('message', (data) => {
  console.log('I\'m parent, data from child', data)
})
