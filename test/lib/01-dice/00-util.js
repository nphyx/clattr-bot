const { sum, sumResults, totalGroups } = require('../../../lib/dice/util')
const { combinatorTypes } = require('../../../lib/common/constants')
const { mockDie } = require('../mocks')

describe('the dice::util module', () => {
  describe('sum', () => {
    it('should sum numbers', () => {
      [1, 2, 3].reduce(sum, 0).should.eql(6)
    })
  })
  describe('sumResults', () => {
    it('should sum the result of a set of dice', () => {
      sumResults([mockDie(6, 3), mockDie(6, 2)]).should.eql(5)
    })
  })
  describe('totalGroups', () => {
    it('should handle addition', () => {
      const groups = [
        { op: combinatorTypes.ADD, result: 5 },
        { op: combinatorTypes.ADD, result: 3 }
      ]
      totalGroups(groups).should.eql(8)
    })
    it('should handle subtractions', () => {
      const groups = [
        { op: combinatorTypes.ADD, result: 5 },
        { op: combinatorTypes.SUB, result: 3 }
      ]
      totalGroups(groups).should.eql(2)
    })
    it('should handle multiplication', () => {
      const groups = [
        { op: combinatorTypes.ADD, result: 5 },
        { op: combinatorTypes.MULTIPLY, result: 3 }
      ]
      totalGroups(groups).should.eql(15)
    })
    it('should handle division', () => {
      const groups = [
        { op: combinatorTypes.ADD, result: 6 },
        { op: combinatorTypes.DIVIDE, result: 3 }
      ]
      totalGroups(groups).should.eql(2)
    })
    it('should apply operations left to right', () => {
      const groups = [
        { op: combinatorTypes.ADD, result: 9 },
        { op: combinatorTypes.SUB, result: 3 },
        { op: combinatorTypes.DIVIDE, result: 3 },
        { op: combinatorTypes.MULTIPLY, result: 10 }
      ]
      totalGroups(groups).should.eql(20)
    })
    it('should skip unrecognized operators', () => {
      const groups = [
        { op: Symbol(), result: 9 }
      ]
      totalGroups(groups).should.eql(0)
    })
  })
})
