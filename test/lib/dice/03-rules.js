const { explode, keep, apply } = require('../../../lib/dice/rules')
const { pieceMarkers, ruleTypes } = require('../../../lib/dice/constants')
const { mockDie } = require('./mocks')

describe('the dice::rules module', () => {
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
        mockDie(10, 9, pieceMarkers.KEPT),
        mockDie(10, 7, pieceMarkers.KEPT)
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
        mockDie(10, 2, pieceMarkers.KEPT),
        mockDie(10, 2, pieceMarkers.KEPT)
      ])
    })
  })
  describe('explode', () => {
    it('should explode dice', () => {
      const dice = [mockDie(10, 10), mockDie(10, 3)]
      const result = explode(dice, 10)
      result.length.should.be.greaterThan(2)
      result[0].marker.should.eql(pieceMarkers.EXPLODED)
    })
    it('should recurse, respecting limits', () => {
      const dice = [mockDie(1, 1)]
      const result = explode(dice, 1, 2)
      result.length.should.eql(3)
    })
    it('should behave correctly with no operand', () => {
      const dice = [mockDie(10, 10), mockDie(10, 3)]
      explode(dice).length.should.be.greaterThan(2)
    })
    it('should behave correctly with only a limit', () => {
      const dice = [mockDie(1, 1)]
      explode(dice, undefined, 2).length.should.eql(3)
    })
  })
  describe('apply', () => {
    it('should apply a keep higher rule', () => {
      const dice = [mockDie(10, 10), mockDie(10, 3)]
      const ruleSet = [[ruleTypes.KEEP_HIGH, 1]]
      apply(dice, ruleSet).should.deepEqual([
        dice[0]
      ])
    })
    it('should apply a keep lower rule', () => {
      const dice = [mockDie(10, 10), mockDie(10, 3)]
      const ruleSet = [[ruleTypes.KEEP_LOW, 1]]
      apply(dice, ruleSet).should.deepEqual([
        dice[1]
      ])
    })
    it('should apply an explode rule', () => {
      const dice = [mockDie(10, 10), mockDie(10, 3)]
      const ruleSet = [[ruleTypes.EXPLODE, 10]]
      apply(dice, ruleSet).length.should.be.greaterThan(2)
    })
    it('should find an explode limit rule when exploding', () => {
      const dice = [mockDie(1, 1)]
      const ruleSet = [
        [ruleTypes.EXPLODE, false],
        [ruleTypes.EXPLODE_LIMIT, 2]
      ]
      apply(dice, ruleSet).length.should.eql(3)
    })
    it('should combine explode + keep high rules', () => {
      const dice = [mockDie(1, 1)]
      const ruleSet = [
        [ruleTypes.EXPLODE, false],
        [ruleTypes.EXPLODE_LIMIT, 2],
        [ruleTypes.KEEP_HIGH, 2]
      ]
      apply(dice, ruleSet).length.should.eql(2)
    })
    it('should combine explode + keep low rules', () => {
      const dice = [mockDie(1, 1)]
      const ruleSet = [
        [ruleTypes.EXPLODE, false],
        [ruleTypes.EXPLODE_LIMIT, 2],
        [ruleTypes.KEEP_LOW, 1]
      ]
      apply(dice, ruleSet).length.should.eql(1)
    })
    it('should combine keep high + explode + keep low rules', () => {
      const dice = [mockDie(1, 1), mockDie(1, 1)]
      const ruleSet = [
        [ruleTypes.KEEP_HIGH, 1],
        [ruleTypes.EXPLODE, 1],
        [ruleTypes.EXPLODE_LIMIT, 2],
        [ruleTypes.KEEP_LOW, 2]
      ]
      apply(dice, ruleSet).length.should.eql(2)
    })
    it('should complain when there are too many rules', () => {
      const dice = [mockDie(1, 1), mockDie(1, 1)]
      const ruleSet = [
        [ruleTypes.KEEP_HIGH, 1],
        [ruleTypes.EXPLODE, 1],
        [ruleTypes.EXPLODE_LIMIT, 2],
        [ruleTypes.KEEP_LOW, 2],
        [ruleTypes.EXPLODE, 1],
        [ruleTypes.EXPLODE_LIMIT, 2]
      ]
      ;(() => apply(dice, ruleSet)).should.throw()
    })
    it('should skip a rule if it is unrecognized', () => {
      const ruleSet = [
        [10000, 1]
      ]
      const dice = [mockDie(1, 1)]
      apply(dice, ruleSet).should.eql(dice)
    })
  })
})
