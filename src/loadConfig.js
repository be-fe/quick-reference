/**
 * @file loadConfig
 * @author Cuttle Cong
 * @date 2018/5/22
 * @description
 */
const debug = require('debug')('quick-reference:loadConfig')
const explorer = require('cosmiconfig')('quick-reference')
const nps = require('path')

module.exports = function (searchFrom) {
  return explorer.search(searchFrom).then(result => {
    debug('loadConfig', result)
    if (result && result.config) {
      if (result.config.docRoot) {
        result.config.docRoot = nps.join(nps.dirname(result.filepath), result.config.docRoot)
      }
    }
    return result
  })
}
