const types = require('../../../lib/dice/types')
const { mockDie, mockFateDie, mockMod } = require('./mocks')
const { sumDice } = require('../../../lib/dice/util')
const { parseDiceGroup, handleGroup, handleSet, handleRoll, handler } = require('../../../lib/dice')

describe('the dice module', () => {
  describe('parseDiceGroup', () => {
    it('should handle a modifier-only group', () => {
      parseDiceGroup("10").should.deepEqual({
        count: 10,
        type: false,
        size: false,
        target: false,
        rule: false,
        ruleOperand: false
      })
    })
    it('should handle a negative modifier', () => {
      parseDiceGroup("-10").should.deepEqual({
        count: -10,
        type: false,
        size: false,
        target: false,
        rule: false,
        ruleOperand: false
      })
    })
    it('should handle simple dice roll types', () => {
      parseDiceGroup('1d20').should.deepEqual({
        count: 1,
        type: 'd',
        size: 20,
        target: false,
        rule: false,
        ruleOperand: false
      })
      parseDiceGroup('5p10').should.deepEqual({
        count: 5,
        type: 'p',
        size: 10,
        target: false,
        rule: false,
        ruleOperand: false
      })
      parseDiceGroup('5f3').should.deepEqual({
        count: 5,
        type: 'f',
        size: 3,
        target: false,
        rule: false,
        ruleOperand: false
      })
    })
    it('should default to 1 die when count is omitted', () => {
      parseDiceGroup('d20').count.should.eql(1)
      parseDiceGroup('p10').count.should.eql(1)
      parseDiceGroup('f3').count.should.eql(1)
    })
    it('should supply default die size when size is omitted', () => {
      parseDiceGroup('8d').count.should.eql(8)
      parseDiceGroup('6d').size.should.eql(6)
      parseDiceGroup('5p').count.should.eql(5)
      parseDiceGroup('5p').size.should.eql(10)
      parseDiceGroup('5f').count.should.eql(5)
      parseDiceGroup('5f').size.should.eql(3)
    })
    it('should handle target numbers for pools', () => {
      parseDiceGroup('3p10t6').should.deepEqual({
        count: 3,
        type: 'p',
        size: 10,
        target: 6,
        rule: false,
        ruleOperand: false
      })
    })
    it('should handle target numbers for pools with count omitted', () => {
      parseDiceGroup('p10t6').should.deepEqual({
        count: 1,
        type: 'p',
        size: 10,
        target: 6,
        rule: false,
        ruleOperand: false
      })
    })
    it('should handle target numbers for pools with size omitted', () => {
      parseDiceGroup('3pt6').should.deepEqual({
        count: 3,
        type: 'p',
        size: 10,
        target: 6,
        rule: false,
        ruleOperand: false
      })
    })
    it('should parse parseExploding dice', () => {
      parseDiceGroup('1d20!').should.deepEqual({
        count: 1,
        type: 'd',
        size: 20,
        target: false,
        rule: "!",
        ruleOperand: false
      })
    })
    it('should parse parseExploding dice with targets', () => {
      parseDiceGroup('1d20!19').should.deepEqual({
        count: 1,
        type: 'd',
        size: 20,
        target: false,
        rule: "!",
        ruleOperand: "19"
      })
    })
    it('should parse parseExploding dice with targets and limits', () => {
      parseDiceGroup('1d20!19m3').should.deepEqual({
        count: 1,
        type: 'd',
        size: 20,
        target: false,
        rule: "!",
        ruleOperand: "19m3"
      })
    })
    it('should supply default dice count for parseExploding dice', () => {
      parseDiceGroup('d20!19m3').should.deepEqual({
        count: 1,
        type: 'd',
        size: 20,
        target: false,
        rule: "!",
        ruleOperand: "19m3"
      })
    })
    it('should supply default dice size for parseExploding dice', () => {
      parseDiceGroup('3d!19m3').should.deepEqual({
        count: 3,
        type: 'd',
        size: 6,
        target: false,
        rule: "!",
        ruleOperand: "19m3"
      })
    })
    it('should handle parseExploding dice pools', () => {
      parseDiceGroup('3p!m3').should.deepEqual({
        count: 3,
        type: 'p',
        size: 10,
        target: false,
        rule: "!",
        ruleOperand: "m3"
      })
    })
    it('should handle kept dice', () => {
      parseDiceGroup('2d20k1').should.deepEqual({
        count: 2,
        type: 'd',
        size: 20,
        target: false,
        rule: "k",
        ruleOperand: "1"
      })
    })
    it('should handle keep-the-lower dice', () => {
      parseDiceGroup('2dl1').should.deepEqual({
        count: 2,
        type: 'd',
        size: 6,
        target: false,
        rule: "l",
        ruleOperand: "1"
      })
    })
  })
  describe('handleGroup', () => {
    it('should generate dice groups for basic rolls', () => {
      const group = handleGroup('10d20')
      group.string.should.eql('10d20')
      group.dice.length.should.eql(10)
      group.dice.forEach(die => die.size.should.eql(20))
      group.type.should.eql(types.GROUP)
      group.rule.should.eql(false)
      group.result.should.eql(group.dice.reduce(sumDice, 0))
    })
    it('should handle dice pools', () => {
      const group = handleGroup('3p10')
      group.string.should.eql('3p10')
      group.dice.length.should.eql(3)
      group.dice.forEach(die => die.size.should.eql(10))
      group.type.should.eql(types.POOL)
      group.rule.should.eql(false)
    })
    it('should handle fate dice', () => {
      const group = handleGroup('4f')
      group.string.should.eql('4f')
      group.dice.length.should.eql(4)
      group.type.should.eql(types.FATE_POOL)
      group.dice.forEach(die => die.type.should.eql(types.FATE_DIE))
    })
    it('should handle exploding dice', () => {
      const group = handleGroup('1d1!m4')
      group.string.should.eql('1d1!m4')
      group.original.length.should.eql(1)
      group.dice.length.should.eql(5)
      group.rule.should.eql('!')
      group.result.should.eql(5)
    })
    it('should handle kept dice', () => {
      const group = handleGroup('3d20k1')
      group.string.should.eql('3d20k1')
      group.original.length.should.eql(3)
      group.dice.length.should.eql(1)
      group.rule.should.eql('k')
      group.result.should.eql(Math.max(...group.dice.map(die => die.result)))
    })
    // we already checked deeper functionality, that should be enough?
  })
  describe('handleSet', () => {
    it('should split two groups of dice and roll each', () => {
      const set = handleSet('1d4+3d6')
      set.string.should.eql('1d4+3d6')
      set.groups.length.should.eql(2)
      const [g0, g1] = set.groups
      g0.string.should.eql('1d4')
      g1.string.should.eql('3d6')
      set.result.should.eql(g0.result + g1.result)
    })
    it('should handle modifiers', () => {
      const set = handleSet('1d10+5')
      set.groups.length.should.eql(2)
      const [g0, g1] = set.groups
      g0.string.should.eql('1d10')
      g1.string.should.eql('5')
      g1.type.should.eql(types.MOD)
      set.result.should.eql(g0.result + 5)
    })
    it('should gracefully handle whitespace', () => {
      const set = handleSet(' 1d4 +3d6')
      const [g0, g1] = set.groups
      g0.string.should.eql('1d4')
      g1.string.should.eql('3d6')
    })
  })
  describe('handleRoll', () => {
    it('should handle a set of rolls', () => {
      const roll = handleRoll('1d20+3, 1d4+3d6+3')
      roll.string.should.eql('1d20+3, 1d4+3d6+3')
      roll.sets.length.should.eql(2)
      const [s0, s1] = roll.sets
      const [s0g1, s0g2] = s0.groups
      const [s1g1, s1g2, s1g3] = s1.groups
      s0g1.string.should.eql('1d20')
      s0g1.type.should.eql(types.GROUP)
      s0g2.string.should.eql('3')
      s0g2.type.should.eql(types.MOD)
      s1g1.string.should.eql('1d4')
      s1g1.type.should.eql(types.GROUP)
      s1g2.string.should.eql('3d6')
      s1g2.type.should.eql(types.GROUP)
      s1g3.string.should.eql('3')
      s1g3.type.should.eql(types.MOD)
    })
  })
  describe('handler', () => {
    it('should handle a dice roll command and return a formatted string', () => {
      const result = handler('1d20 + 7, 1d4+3d6+1')
      result.length.should.be.greaterThan(0)
    })
  })
})
