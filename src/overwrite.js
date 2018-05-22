/**
 * @file overwrite
 * @author Cuttle Cong
 * @date 2018/5/22
 * @description
 */
const fs = require('fs')

const preTransform = require('./transpiler')

function transform(filename, { imgAlias, linkAlias } = {}, enabledList) {
  return preTransform(filename, { imgAlias, linkAlias }, enabledList).then(
    ({ input, output }) => {
      if (input !== output) {
        fs.writeFileSync(filename, output)
      }
    }
  )
}

module.exports = transform
