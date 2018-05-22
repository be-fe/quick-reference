/**
 * @file util
 * @author Cuttle Cong
 * @date 2018/5/22
 * @description
 */
const nps = require('path')
const pify = require('pify')
const md5 = require('md5')
const fs = require('fs')
// const readdirp = require('recursive-readdir')
const cache = require('node-shared-cache')
const debug = require('debug')('quick-ref:util')

function isMd(file) {
  let ext = nps.extname(file).toLowerCase()
  return ext === '.md'
}

function assertDocRoot(docRoot) {
  if (!fs.statSync(docRoot).isDirectory()) {
    throw new Error('Doc root should be a directory. but ' + docRoot + 'is n\'t!')
  }
}

function isImg(file) {
  let ext = nps.extname(file).toLowerCase()
  return ['.jpg', '.gif', '.jpeg', '.png'].includes(ext)
}

function releaseCache(docRoot) {
  docRoot = nps.resolve(docRoot)
  let id = md5(docRoot).slice(0, 8)
  cache.release(id + '-link')
  cache.release(id + '-img')
}

function getCache(docRoot) {
  docRoot = nps.resolve(docRoot)
  let id = md5(docRoot).slice(0, 8)
  let linkAlias = new cache.Cache(id + '-link', 557056, cache.SIZE_512)
  let imgAlias = new cache.Cache(id + '-img', 557056, cache.SIZE_512)
  debug('cache of %s', docRoot, id)
  debug('linkAlias', Object.assign({}, linkAlias))
  debug('imgAlias', Object.assign({}, imgAlias))
  return {
    imgAlias,
    linkAlias
  }
}

module.exports = {
  isMd,
  isImg,
  getCache,
  releaseCache,
  assertDocRoot
}
