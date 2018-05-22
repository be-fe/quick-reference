/**
 * @file permaLink
 * @author Cuttle Cong
 * @date 2018/5/22
 * @description
 */
const frontMatter = require('yaml-front-matter').loadFront
const fs = require('fs')
const nps = require('path')

function getPermaLinkByFilename(filename = '') {
  let withoutExtFilename = filename.replace(/\.[^.]+?$/, '')
  let basename = nps.basename(withoutExtFilename)
  if (basename === 'index') {
    return nps.basename(nps.dirname(withoutExtFilename))
  }
  return basename
}

function getPermaLink(filename) {
  let contents = fs.readFileSync(filename).toString()
  let meta = frontMatter(contents)

  if (meta.permalink) {
    return meta.permalink
  }

  return getPermaLinkByFilename(filename)
}

getPermaLink.getPermaLinkByFilename = getPermaLinkByFilename

module.exports = getPermaLink
