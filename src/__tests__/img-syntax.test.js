/**
 * @file img-syntax.test
 * @author Cuttle Cong
 * @date 2018/5/21
 * @description
 */
const nps = require('path')

const compile = require('../transpiler/index')

describe('img-syntax', function() {
  it('should img-syntax normal', done => {
    compile(
      nps.join(__dirname, 'fixture/img-syntax.md'),
      {
        imgAlias: {
          avalon: nps.join(__dirname, 'fixture/avalon.png')
        }
      },
      ['img']
    )
      .then(md => expect(md).toMatchSnapshot())
      .then(done)
  })
})
