/**
 * @file link-syntax
 * @author Cuttle Cong
 * @date 2018/5/21
 * @description
 */

// const visit = require('unist-util-visit')
const nps = require('path')
const debug = require('debug')('quick-reference:link-syntax')
const select = require('./select')

const PREFIX = '@link:'
const SUFFIX = '@'

function locator(value, fromIndex) {
  let asterisk = value.indexOf(PREFIX, fromIndex)
  return asterisk
}

// @link:[title]permalink@
// @link:permalink@
// 以上语法转换成
// [title](../to/md/file)
// [article title or permalink](../to/md/file)

function link({ alias = {}, filename } = {}) {
  debug('alias', alias)
  debug('filename', filename)
  let parser = this.Parser
  let compiler = this.Compiler
  let tokenizers
  let methods

  if (!isRemarkParser(parser)) {
    throw new Error('Missing parser to attach `remark-mark` to')
  }

  tokenizers = parser.prototype.inlineTokenizers
  methods = parser.prototype.inlineMethods
  tokenizers.linkSyntax = tokenizeLinkSyntax
  methods.splice(methods.indexOf('linkReference'), 0, 'linkSyntax')
  tokenizeLinkSyntax.locator = locator

  if (!isRemarkCompiler(compiler)) {
    return
  }

  let visitors = compiler.prototype.visitors
  visitors.mark = function(node) {
    let contents = this.all(node)

    return PREFIX + contents.join('') + SUFFIX
  }

  let messages = []
  function tokenizeLinkSyntax(eat, value, silent) {
    let now
    let $1
    let $2
    let regex = new RegExp(`^(${PREFIX}(.+?)${SUFFIX})`)

    /* istanbul ignore if - never used (yet) */
    if (silent) {
      return true
    }

    // console.error(JSON.stringify(value))
    if (regex.test(value)) {
      $1 = RegExp.$1
      $2 = RegExp.$2
      now = eat.now()
      now.column += PREFIX.length
      now.offset += PREFIX.length

      // ?: 非捕获组
      let [, title, permalink] = $2.match(/^(?:\[(.+?)])?(.*)$/) || []

      let hashIndex = permalink.lastIndexOf('#')
      let hash = ''
      if (hashIndex >= 0) {
        hash = permalink.substring(hashIndex)
        permalink = permalink.substring(0, hashIndex)
      }

      let linkedFilename = alias[permalink]
      let matchedPermaLink = permalink
      let sameList = []
      if (!linkedFilename) {
        let data = select(
          alias,
          permalink,
          sameList
        )
        if (data) {
          linkedFilename = data.linkedFilename
          matchedPermaLink = data.matchedPermaLink
        }
      }

      if (sameList.length > 1) {
        messages.push([
          '多个同可能匹配的文档集: ' +
            JSON.stringify(permalink) +
            ' [' +
            sameList.join(', ') +
            ']',
          now
        ])
        return
      }

      if (linkedFilename) {
        return eat($1)({
          type: 'link',
          title: '',
          url: nps.relative(nps.dirname(filename), linkedFilename) + hash,
          children: this.tokenizeInline(title || matchedPermaLink, now)
        })
      } else {
        messages.push(['匹配失败: ' + JSON.stringify(permalink), now])
      }
    }
  }

  return function transformer(tree, file, next) {
    debug('messages', messages)
    messages.forEach(([message, pos]) => {
      file.message(message, pos)
    })

    next()
  }
}

function isRemarkParser(parser) {
  return Boolean(
    parser &&
      parser.prototype &&
      parser.prototype.inlineTokenizers &&
      parser.prototype.inlineMethods
  )
}

function isRemarkCompiler(compiler) {
  return Boolean(compiler && compiler.prototype && compiler.prototype.visitors)
}
module.exports = link
