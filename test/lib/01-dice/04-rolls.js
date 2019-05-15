const rolls = require('../../../lib/dice/rolls')
const { rollTypes, ruleTypes } = require('../../../lib/common/constants')
const { sumResults } = require('../../../lib/dice/util')
const { checkPolyhedral, checkFate, checkCoin } = require('../helpers')
const rollSum = rolls.get(rollTypes.SUM)
const rollPool = rolls.get(rollTypes.POOL)
const fateRoll = rolls.get(rollTypes.FATE)
const flipCoins = rolls.get(rollTypes.COIN_TOSS)

describe('dice::rolls module', () => {
  it('should have tied its functions to roll type symbols', () => {
    rolls.get(rollTypes.SUM).should.be.a.Function()
    rolls.get(rollTypes.POOL).should.be.a.Function()
    rolls.get(rollTypes.FATE).should.be.a.Function()
    rolls.get(rollTypes.COIN_TOSS).should.be.a.Function()
  })
  describe('sum', () => {
    it('should return a dice sum result object', () => {
      const roll = rollSum(3, [], 6)
      roll.type.should.eql(rollTypes.SUM)
      roll.dice.should.be.an.Array()
      roll.dice.length.should.eql(3)
      roll.dice.forEach(die => checkPolyhedral(die, 6))
      roll.result.should.eql(sumResults(roll.dice))
    })
    it('should apply rules', () => {
      const testRules = [
        [ruleTypes.KEEP_HIGH, 1],
        [ruleTypes.EXPLODE, 1],
        [ruleTypes.EXPLODE_LIMIT, 4]
      ]
      const roll = rollSum(2, testRules, 1)
      roll.original.length.should.eql(2)
      roll.dice.length.should.eql(5)
    })
  })
  describe('pool', () => {
    it('should return a dice pool result object', () => {
      const roll = rollPool(3, [], 10, 7)
      roll.type.should.eql(rollTypes.POOL)
      roll.target.should.eql(7)
      roll.dice.should.be.an.Array()
      roll.dice.length.should.eql(3)
      roll.dice.forEach(die => checkPolyhedral(die, 10))
      let expected = 0
      roll.dice.forEach(die => {
        if (die.result >= 7) expected++
      })
      roll.result.should.eql(expected)
    })
    it('should apply rules', () => {
      const testRules = [
        [ruleTypes.KEEP_HIGH, 1],
        [ruleTypes.EXPLODE, 1],
        [ruleTypes.EXPLODE_LIMIT, 4]
      ]
      const roll = rollPool(2, testRules, 1)
      roll.original.length.should.eql(2)
      roll.dice.length.should.eql(5)
    })
  })
  describe('fate', () => {
    it('should return a fate pool result object', () => {
      const roll = fateRoll(4)
      roll.type.should.eql(rollTypes.FATE)
      roll.dice.should.be.an.Array()
      roll.dice.length.should.eql(4)
      roll.dice.forEach(checkFate)
      roll.result.should.eql(sumResults(roll.dice))
    })
  })
  describe('coin toss', () => {
    it('should flip coins', () => {
      const toss = flipCoins(3)
      toss.type.should.eql(rollTypes.COIN_TOSS)
      toss.coins.should.be.an.Array()
      toss.coins.length.should.eql(3)
      toss.coins.forEach(checkCoin)
      toss.result.should.eql(sumResults(toss.coins))
    })
  })
})
