const { sum, sumDice, toFateDice } = require('../../../lib/dice/util')
const { mockDie } = require('./mocks')

describe('the dice::util module', () => {
  describe('sum', () => {
    it('should sum numbers', () => {
      [1, 2, 3].reduce(sum, 0).should.eql(6)
    })
  })
  describe('sumDice', () => {
    it('should sum the result of a set of dice', () => {
      [mockDie(6, 3), mockDie(6, 2)].reduce(sumDice, 0).should.eql(5)
    })
  })
})
