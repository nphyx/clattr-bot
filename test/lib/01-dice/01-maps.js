const maps = require('../../../lib/dice/maps')
describe('dice::maps module', () => {
  describe('inverse', () => {
    it('should flip the keys and values of a map array', () => {
      const test = [
        [0, 1],
        [2, 3],
        [4, 5],
        [6, 7],
        [8, 9]
      ]
      const expected = [
        [1, 0],
        [3, 2],
        [5, 4],
        [7, 6],
        [9, 8]
      ]
      maps.inverse(test).should.deepEqual(expected)
    })
  })
  describe('freeze', () => {
    it('should recursively freeze a map array', () => {
      const test = [
        [0, 1],
        [2, 3],
        [4, 5],
        [6, 7],
        [8, 9]
      ]
      const result = maps.freeze(test)
      Object.isFrozen(result).should.be.true()
      result.forEach(item => Object.isFrozen(item).should.be.true())
    })
  })
  describe('parserString', () => {
    it('should collect the keys of an operator array into a string', () => {
      const test = [
        [false, 0],
        ['a', 0],
        ['b', 1],
        ['c', 2]
      ]
      const result = maps.parserString(test)
      result.should.eql('abc')
    })
  })
})
