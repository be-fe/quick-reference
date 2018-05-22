/**
 * @file watch
 * @author Cuttle Cong
 * @date 2018/5/21
 * @description
 */

// 监控md或者图片资源文件，保持图片资源和md文件的permalink
const debug = require('debug')('quick-ref:watch')
const chokidar = require('chokidar')
const nps = require('path')
const fs = require('fs')
const pify = require('pify')
const readdirp = require('recursive-readdir')

const { isMd, isImg, assertDocRoot, getCache, releaseCache } = require('./util')
const overwrite = require('./overwrite')
const getPermaLink = require('./getPermaLink')

const match = '*.{md,png,PNG,jpg,JPG,gif,GIF,jpeg,JPEG}'

function set(file, { linkAlias, rlinkAlias, imgAlias, rimgAlias } = {}) {
  if (isMd(file)) {
    let permalink = getPermaLink(file)
    linkAlias && (linkAlias[permalink] = file)
    rlinkAlias && (rlinkAlias[file] = permalink)
  } else if (isImg(file)) {
    let basename = nps.basename(file)
    imgAlias && (imgAlias[basename] = file)
    rimgAlias && (rimgAlias[file] = basename)
  }
}

function calcAlias(docRoot) {
  return pify(readdirp)(docRoot).then(files => {
    let imgAlias = {}
    let linkAlias = {}
    files.forEach(file => {
      set(file, { linkAlias, imgAlias })
    })

    return { imgAlias, linkAlias }
  })
}

function makeReverseMapper(mapper) {
  let rMapper = {}
  Object.keys(mapper).forEach(key => {
    let val = mapper[key]
    rMapper[val] = key
  })

  return rMapper
}

module.exports = function watch(docRoot, options = {}) {
  if (!docRoot) {
    throw new Error('Please appoint a doc root.')
  }

  assertDocRoot(docRoot)

  const { enableOverwrite = true } = options
  docRoot = nps.resolve(docRoot)
  if (!fs.statSync(docRoot).isDirectory()) {
    throw new Error(docRoot + ' is not an directory.')
  }

  debug('docRoot', docRoot)
  debug('options', options)

  releaseCache(docRoot)
  const { linkAlias = {}, imgAlias = {} } = getCache(docRoot)

  calcAlias(docRoot)
    .then(({ linkAlias: xlinkAlias, imgAlias: ximgAlias }) => {
      Object.assign(linkAlias, xlinkAlias)
      Object.assign(imgAlias, ximgAlias)
      return { linkAlias, imgAlias }
    })
    .then(({ linkAlias, imgAlias }) => {
      function setDBByFile(file) {
        set(file, { linkAlias, imgAlias, rlinkAlias, rimgAlias })
      }

      function deleteDB(file) {
        if (rimgAlias[file]) {
          delete imgAlias[rimgAlias[file]]
        }
        if (rlinkAlias[file]) {
          delete linkAlias[rlinkAlias[file]]
        }
      }

      const rlinkAlias = makeReverseMapper(linkAlias)
      const rimgAlias = makeReverseMapper(imgAlias)

      debug('rLinkAlias', rlinkAlias)
      debug('rImgAlias', rimgAlias)

      console.log('Watch:', docRoot)

      return chokidar
        .watch(docRoot + '/**/' + match, { ignoreInitial: true })
        .on('change', path => {
          debug('detected %s changed.', path)
          setDBByFile(path)
          enableOverwrite &&
            isMd(path) &&
            overwrite(path, {
              linkAlias: Object.assign({}, linkAlias),
              imgAlias: Object.assign({}, imgAlias)
            })
        })
        .on('add', path => {
          debug('detected %s added.', path)
          setDBByFile(path)
        })
        .on('unlink', path => {
          debug('detected %s removed.', path)
          deleteDB(path)
        })
    })
}

module.exports.calcAlias = calcAlias
