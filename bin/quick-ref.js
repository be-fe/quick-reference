#!/usr/bin/env node

const meow = require('meow')
const debug = require('debug')('quick-ref:overwrite')
const nps = require('path')

const transpiler = require('../src/transpiler')
const overwrite = require('../src/overwrite')
const loadConfig = require('../src/loadConfig')
const { calcAlias } = require('../src/watch')
const { getCache, assertDocRoot } = require('../src/util')

const cli = meow(
  `
    Usage
      $ qr <...file> <option>
 
    Options
      --help, -h             help
      --version              version
      --docRoot, -d          docRoot
`,
  {
    flags: {
      help: {
        type: 'boolean',
        alias: 'h'
      },
      version: {
        type: 'boolean'
      },
      docRoot: {
        type: 'string',
        alias: 'd'
      }
    }
  }
)

debug('cli.flags', cli.flags)
debug('cli.input', cli.input)

if (cli.flags.help) {
  cli.showHelp()
  process.exit(0)
}

if (cli.flags.version) {
  cli.showVersion()
  process.exit(0)
}

loadConfig().then(result => {
  if (result) {
    cli.flags = Object.assign({}, result.config, cli.flags)
  }

  if (!cli.flags.docRoot) {
    console.error('Please appoint an doc root.')
    process.exit(1)
  }

  assertDocRoot(cli.flags.docRoot)

  cli.input.forEach(path => {
    path = nps.resolve(path)
    debug('overwrite', cli.flags)
    let { linkAlias, imgAlias } = getCache(cli.flags.docRoot)
    let cLinkAlias = Object.assign({}, linkAlias)
    let cImgAlias = Object.assign({}, imgAlias)

    if (Object.keys(cLinkAlias).length === 0) {
      debug('shared cache not found')
      // maybe empty
      calcAlias(cli.flags.docRoot).then(({ linkAlias, imgAlias }) => {
        overwrite(path, {
          linkAlias: linkAlias,
          imgAlias: imgAlias
        })
      })
    }
    else {
      debug('shared cache is found!')
      overwrite(path, {
        linkAlias: cLinkAlias,
        imgAlias: cImgAlias
      })
    }
  })
})
