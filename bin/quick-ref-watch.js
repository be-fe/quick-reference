#!/usr/bin/env node

const meow = require('meow')
const debug = require('debug')('quick-reference:watch')

const watch = require('../src/watch')
const { releaseCache } = require('../src/util')
const loadConfig = require('../src/loadConfig')

const cli = meow(
  `
    Usage
      $ qr-watch [docRoot]
 
    Options
      --help, -h             help
      --version              version
      --enableOverwrite, -o  enable overwriting the markdown file.
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
      enableOverwrite: {
        type: 'boolean',
        alias: 'o'
      }
    }
  }
)

debug('cli.flags', cli.flags)

if (cli.flags.help) {
  cli.showHelp()
  process.exit(0)
}

if (cli.flags.version) {
  cli.showVersion()
  process.exit(0)
}

if (!cli.input[0]) {
  loadConfig().then(result => {
    if (result && result.config) {
      cli.input[0] = result.config.docRoot
    }
    watch(cli.input[0], cli.flags)
  })
}
else {
  watch(cli.input[0], cli.flags)
}

process.on('SIGINT', () => {
  // releaseCache(cli.input[0])
  process.exit()
})
