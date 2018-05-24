/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/5/21
 * @description
 */
const unified = require('unified')
const parse = require('remark-parse')
const stringify = require('remark-stringify')

const toVFile = require('to-vfile')
const nps = require('path')
const pify = require('pify')
const report = require('vfile-reporter')
const frontmatter = require('remark-frontmatter')

const link = require('./link-syntax')
const img = require('./img-syntax')

const remark = unified()
  .use(parse)
  .use(stringify, {
    listItemIndent: '1',
    bullet: '-'
  })
  .freeze()

function core(
  enabledList = ['link', 'img'],
  { linkAlias, imgAlias, filename } = {}
) {
  // Supports front yaml
  let r = remark().use(frontmatter, ['yaml' /*, 'toml'*/])
  if (enabledList.includes('link')) {
    r = r.use(link, { alias: linkAlias, filename })
  }
  if (enabledList.includes('img')) {
    r = r.use(img, { alias: imgAlias, filename })
  }

  return r
}

function transform(
  filename,
  { imgAlias = {}, linkAlias = {} } = {},
  enabledList
) {
  let vFile = toVFile.readSync(nps.relative(process.cwd(), filename))
  let input = vFile.contents.toString()

  return pify(core(enabledList, { imgAlias, filename, linkAlias }).process)(
    vFile
  )
    .then(file => {
      if (file.messages && file.messages.length) {
        console.error(report(file))
      }
      return { input, output: String(file) }
    })
    .catch(err => {
      console.error(report(err))
      throw err
    })
}

function parseToMDAST(filename, { imgAlias = {}, linkAlias = {} } = {}, enabledList) {
  filename = nps.resolve(filename)
  return core(enabledList, { filename, imgAlias, linkAlias }).parse(
    toVFile.readSync(filename)
  )
}

transform.parse = parseToMDAST
module.exports = transform
