/**
 * @file link-syntax.test
 * @author Cuttle Cong
 * @date 2018/5/21
 * @description
 */
const nps = require('path')

const compile = require('../transpiler/index')

describe('link-syntax', function() {
  it('should link-syntax normal', done => {
    compile(
      nps.join(__dirname, 'fixture/link-syntax.md'),
      {
        linkAlias: {
          avalon: nps.join(__dirname, 'fixture/avalon.md')
        }
      },
      ['link']
    )
      .then(({ output }) => expect(output).toMatchSnapshot())
      .then(done)
  })
})
