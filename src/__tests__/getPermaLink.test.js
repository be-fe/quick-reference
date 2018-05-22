/**
 * @file getPermaLink
 * @author Cuttle Cong
 * @date 2018/5/22
 * @description
 */
const getPermaLink = require('../getPermaLink')
const getPermaLinkByFilename = getPermaLink.getPermaLinkByFilename
const nps = require('path')

describe('getPermaLink', function () {
  it('should getPermaLink', () => {
    expect(getPermaLink(nps.join(__dirname, 'fixture/perma/haha.md'))).toBe('haha')
    expect(getPermaLink(nps.join(__dirname, 'fixture/perma/perma-meta.md'))).toBe('inline-perma')
    expect(getPermaLink(nps.join(__dirname, 'fixture/perma/index.md'))).toBe('perma')
  })
})
