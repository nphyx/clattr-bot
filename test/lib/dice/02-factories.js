const types = require('../../../lib/dice/types')
const { die, modifier, diceSum, dicePool, diceFate } = require('../../../lib/dice/factories')

const { mockDie, mockMod, mockFateDie } = require('./mocks')
const { checkDie } = require('./helpers')

describe('the dice::factories module', () => {
  describe('die', () => {
    it('should generate a die object with its size & result', () => {
      for (let size = 1; size <= 20; ++size)
        for (let i = 0; i < 20; ++i)
          checkDie(die(size), size)
    })
  })
  describe('modifier', () => {
    it('should store a modifier', () => {
      modifier(3).should.deepEqual(mockMod(3))
    })
  })
  describe('diceSum', () => {
    it('should return a dice sum result object', () => {
      const dice = [
        mockDie(6, 2),
        mockDie(8, 7),
        mockDie(4, 1)
      ]
      diceSum(dice).should.deepEqual({
        dice,
        type: types.GROUP,
        result: 10
      })
    })
    it('should handle modifiers', () => {
      const dice = [
        mockDie(10, 5),
        mockDie(8, 7),
        mockDie(4, 1),
        mockMod(3)
      ]
      diceSum(dice).should.deepEqual({
        dice,
        type: types.GROUP,
        result: 16
      })
    })
  })
  describe('dicePool', () => {
    it('should return a dice pool result object', () => {
      const dice = [
        mockDie(10, 2),
        mockDie(10, 7),
        mockDie(10, 9)
      ]
      dicePool(dice, 7).should.deepEqual({
        dice,
        type: types.POOL,
        target: 7,
        result: 2
      })
    })
  })
  describe('diceFate', () => {
    it('should return a fate pool result object', () => {
      const dice = [
        mockDie(3, 3),
        mockDie(3, 3),
        mockDie(3, 2),
        mockDie(3, 1)
      ]
      diceFate(dice).should.deepEqual({
        original: dice,
        dice: [
          mockFateDie(3, "+"),
          mockFateDie(3, "+"),
          mockFateDie(3, " "),
          mockFateDie(3, "-")
        ],
        type: types.FATE_POOL,
        result: 1
      })
    })
    it(`should throw an error if any of the dice can't be used for fate`, () => {
      const dice = [
        mockDie(3, 3),
        mockDie(3, 3),
        mockDie(4, 2),
        mockDie(3, 1)
      ]
      ;(() => diceFate(dice)).should.throw()
    })
  })
})
