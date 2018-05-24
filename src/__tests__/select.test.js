/**
 * @file select
 * @author Cuttle Cong
 * @date 2018/5/24
 * @description
 */

const { calcDist } = require('../transpiler/select')

describe('select', function () {
  it('should select', () => {
    expect(calcDist('add', 'aadd')).toBe(2)
    expect(calcDist('add', 'addd')).toBe(1)
    expect(calcDist('add', 'add')).toBe(0)
  })
})
