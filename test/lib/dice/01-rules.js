const types = require('../../../lib/dice/types')
const { MAX_EXPLOSIONS, parseExplodeOperand, explode, keep } = require('../../../lib/dice/rules')
const { sumDice } = require('../../../lib/dice/util')
const { mockDie } = require('./mocks')

describe('the dice::rules module', () => {
  describe('parseExplodeOperand', () => {
    it('should handle a target operand', () => {
      const { target, limit } = parseExplodeOperand("10")
      target.should.eql(10)
      limit.should.eql(MAX_EXPLOSIONS)
    })
    it('should handle a limit operand', () => {
      const { target, limit } = parseExplodeOperand("m3")
      target.should.be.false()
      limit.should.eql(3)
    })
    it('should handle target + limit', () => {
      const { target, limit } = parseExplodeOperand("10m3")
      target.should.eql(10)
      limit.should.eql(3)
    })
    it('should deal with empty limit', () => {
      const { target, limit } = parseExplodeOperand("10m")
      target.should.eql(10)
      limit.should.eql(MAX_EXPLOSIONS)
    })
    it('should block massive explosion limits', () => {
      const { target, limit } = parseExplodeOperand("10m1000000")
      target.should.eql(10)
      limit.should.eql(MAX_EXPLOSIONS)
    })
  })

  describe('keep', () => {
    it('should keep the highest N dice', () => {
      const dice = [
        mockDie(10, 2),
        mockDie(10, 3),
        mockDie(10, 3),
        mockDie(10, 7),
        mockDie(10, 9)
      ]
      keep(dice, 2).should.deepEqual([
        mockDie(10, 9, types.KEPT),
        mockDie(10, 7, types.KEPT)
      ])
    })
    it('should keep the lowest N dice when lowest = true', () => {
      const dice = [
        mockDie(10, 2),
        mockDie(10, 2),
        mockDie(10, 3),
        mockDie(10, 7),
        mockDie(10, 9)
      ]
      keep(dice, 2, true).should.deepEqual([
        mockDie(10, 2, types.KEPT),
        mockDie(10, 2, types.KEPT)
      ])
    })
  })
  describe('explode', () => {
    it('should explode dice', () => {
      const dice = [mockDie(10, 10), mockDie(10, 3)]
      explode(dice, "10").length.should.be.greaterThan(2)
    })
    it('should recurse, respecting limits', () => {
      const dice = [mockDie(1, 1)]
      const result = explode(dice, "1m2")
      result.length.should.eql(3)
    })
    it('should behave correctly with no operand', () => {
      const dice = [mockDie(10, 10), mockDie(10, 3)]
      explode(dice).length.should.be.greaterThan(2)
    })
    it('should behave correctly with only a limit', () => {
      const dice = [mockDie(1, 1)]
      explode(dice, "m2").length.should.eql(3)
    })
  })
})
