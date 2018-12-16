const { sum, sumResults } = require('../../../lib/dice/util')
const { mockDie } = require('./mocks')

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
})
