const rolls = require('../../../lib/dice/rolls')
const { pieceMarkers, rollTypes, ruleTypes } = require('../../../lib/common/constants')
const { sumResults } = require('../../../lib/dice/util')
const { checkPolyhedral, checkFate, checkCoin, checkWild } = require('../helpers')
const rollSum = rolls.get(rollTypes.SUM)
const rollPool = rolls.get(rollTypes.POOL)
const fateRoll = rolls.get(rollTypes.FATE)
const wildRoll = rolls.get(rollTypes.WILD)
const flipCoins = rolls.get(rollTypes.COIN_TOSS)

describe('dice::rolls module', () => {
  it('should have tied its functions to roll type symbols', () => {
    rolls.get(rollTypes.SUM).should.be.a.Function()
    rolls.get(rollTypes.POOL).should.be.a.Function()
    rolls.get(rollTypes.FATE).should.be.a.Function()
    rolls.get(rollTypes.WILD).should.be.a.Function()
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
    it('should default to one die of size 6', () => {
      const roll = rollSum()
      roll.dice.length.should.eql(1)
      roll.dice[0].size.should.eql(6)
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
    it('should default to one die of size 10', () => {
      const roll = rollPool()
      roll.dice.length.should.eql(1)
      roll.dice[0].size.should.eql(10)
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
  describe('wild', () => {
    it('should return a wild dice result object', () => {
      // because of the complexity of wild dice + explosions we'll run several iterations and hope they all come up straight
      for (let i = 0; i < 10; ++i) {
        const roll = wildRoll(1)
        roll.type.should.eql(rollTypes.WILD)
        roll.dice.should.be.an.Array()
        roll.dice.length.should.be.greaterThan(1)
        roll.dice.forEach(d => checkWild(d, 6, 4))
        let wildResults = sumResults(roll.dice.filter(d => d.marker !== pieceMarkers.WILD && d.marker !== pieceMarkers.WILD_EXPLODED))
        let normalResults = sumResults(roll.dice.filter(d => d.marker === pieceMarkers.WILD || d.marker === pieceMarkers.WILD_EXPLODED))
        roll.result.should.eql(Math.max(wildResults, normalResults), `wild results: ${wildResults}, normalResults: ${normalResults}`)
      }
    })
    it('should default to one die of size 6', () => {
      const roll = wildRoll()
      roll.dice.length.should.be.greaterThan(1)
      roll.dice[0].size.should.eql(6)
    })
    it('should allow overrides of wild die rules', () => {
      const roll = wildRoll(3, [[ruleTypes.WILD, 8]], 10)
      roll.type.should.eql(rollTypes.WILD)
      roll.dice.should.be.an.Array()
      roll.dice.length.should.be.greaterThan(3)
      roll.dice.forEach(d => checkWild(d, 10, 8))
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
    it('should default to one coin', () => {
      const toss = flipCoins()
      toss.coins.length.should.eql(1)
    })
  })
})
