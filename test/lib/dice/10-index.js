const { pieceTypes, rollTypes } = require('../../../lib/dice/constants')
const { parseDiceGroup, handleGroup, handleSet, handleRoll, handler } = require('../../../lib/dice')

describe('the dice module', () => {
  describe('parseDiceGroup', () => {
    it('should handle a modifier-only group', () => {
      parseDiceGroup("10").should.deepEqual({
        count: 10,
        roll: false,
        size: false,
        target: false,
        ruleSet: []
      })
    })
    it('should handle a negative modifier', () => {
      parseDiceGroup("-10").should.deepEqual({
        count: -10,
        roll: false,
        size: false,
        target: false,
        ruleSet: []
      })
    })
    it('should handle sum rollTypes', () => {
      parseDiceGroup('1d20').should.deepEqual({
        count: 1,
        roll: "d",
        size: 20,
        target: false,
        ruleSet: []
      })
    })
    it('should handle pool rollTypes', () => {
      parseDiceGroup('5p10').should.deepEqual({
        count: 5,
        roll: "p",
        size: 10,
        target: false,
        ruleSet: []
      })
    })
    it('should handle fate rollTypes', () => {
      parseDiceGroup('5f').should.deepEqual({
        count: 5,
        roll: "f",
        size: false,
        target: false,
        ruleSet: []
      })
    })
    it('should handle target numbers for pools', () => {
      parseDiceGroup('3p10t6').should.deepEqual({
        count: 3,
        roll: 'p',
        size: 10,
        target: 6,
        ruleSet: []
      })
    })
    it('should handle target numbers for pools with count omitted', () => {
      parseDiceGroup('p10t6').should.deepEqual({
        count: false,
        roll: 'p',
        size: 10,
        target: 6,
        ruleSet: []
      })
    })
    it('should handle target numbers for pools with size omitted', () => {
      parseDiceGroup('3pt6').should.deepEqual({
        count: 3,
        roll: 'p',
        size: false,
        target: 6,
        ruleSet: []
      })
    })
    it('should parse exploding dice', () => {
      parseDiceGroup('1d20!').should.deepEqual({
        count: 1,
        roll: 'd',
        size: 20,
        target: false,
        ruleSet: [["!",false]]
      })
    })
    it('should parse exploding dice with targets', () => {
      parseDiceGroup('1d20!19').should.deepEqual({
        count: 1,
        roll: 'd',
        size: 20,
        target: false,
        ruleSet: [["!",19]]
      })
    })
    it('should parse exploding dice with targets and limits', () => {
      parseDiceGroup('1d20!19m3').should.deepEqual({
        count: 1,
        roll: 'd',
        size: 20,
        target: false,
        ruleSet: [["!",19],["m",3]]
      })
    })
    it('should handle exploding dice pools', () => {
      parseDiceGroup('3p!m3').should.deepEqual({
        count: 3,
        roll: 'p',
        size: false,
        target: false,
        ruleSet: [["!",false],["m",3]]
      })
    })
    it('should handle kept dice', () => {
      parseDiceGroup('2d20k1').should.deepEqual({
        count: 2,
        roll: 'd',
        size: 20,
        target: false,
        ruleSet: [["k",1]]
      })
    })
    it('should handle keep-the-lower dice', () => {
      parseDiceGroup('2dl1').should.deepEqual({
        count: 2,
        roll: 'd',
        size: false,
        target: false,
        ruleSet: [["l",1]]
      })
    })
    it('should handle combined rulesets', () => {
      parseDiceGroup('2d20k1!19m1l').ruleSet.should.deepEqual([
        ['k', 1],
        ['!', 19],
        ['m', 1],
        ['l', false]
      ])
    })
  })
  describe('handleGroup', () => {
    it('should generate dice groups for basic rollTypes', () => {
      const group = handleGroup('10d20')
      group.string.should.eql('10d20')
      group.dice.length.should.eql(10)
      group.dice.forEach(die => die.size.should.eql(20))
      group.type.should.eql(rollTypes.SUM)
    })
    it('should handle dice pools', () => {
      const group = handleGroup('3p10')
      group.string.should.eql('3p10')
      group.dice.length.should.eql(3)
      group.dice.forEach(die => die.size.should.eql(10))
      group.type.should.eql(rollTypes.POOL)
    })
    it('should handle fate dice', () => {
      const group = handleGroup('4f')
      group.string.should.eql('4f')
      group.dice.length.should.eql(4)
      group.type.should.eql(rollTypes.FATE)
      group.dice.forEach(die => die.type.should.eql(pieceTypes.FATE))
    })
    it('should handle exploding dice', () => {
      const group = handleGroup('1d1!m4')
      group.string.should.eql('1d1!m4')
      group.original.length.should.eql(1)
      group.dice.length.should.eql(5)
      group.result.should.eql(5)
    })
    it('should handle kept dice', () => {
      const group = handleGroup('3d20k1')
      group.string.should.eql('3d20k1')
      group.original.length.should.eql(3)
      group.dice.length.should.eql(1)
      group.result.should.eql(Math.max(...group.dice.map(die => die.result)))
    })
    it('should default to 1 die when count is omitted', () => {
      handleGroup('d20').count.should.eql(1)
      handleGroup('p10').count.should.eql(1)
    })
    it('should default to 4 for fate rolls', () => {
      handleGroup('f').count.should.eql(4)
    })
    it('should supply default die size when size is omitted', () => {
      handleGroup('8d').count.should.eql(8)
      handleGroup('6d').size.should.eql(6)
      handleGroup('5p').count.should.eql(5)
      handleGroup('5p').size.should.eql(10)
    })
    it('should supply default dice count for exploding dice', () => {
      handleGroup('d20!19m3').count.should.eql(1)
    })
    it('should supply default dice size for exploding dice', () => {
      handleGroup('3d!19m3').size.should.eql(6)
    })
    it(`should complain if it doesn't understand a rule`, () => {
      (() => handleGroup('1d20z')).should.throw()
    })
    it('should complain if the string is nonsense', () => {
      (() => handleGroup('zebrahorse')).should.throw()
    })
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
      g1.type.should.eql(rollTypes.MOD)
      set.result.should.eql(g0.result + 5)
    })
    it('should gracefully handle whitespace', () => {
      const set = handleSet(' 1d4 +3d6')
      const [g0, g1] = set.groups
      g0.string.should.eql('1d4')
      g1.string.should.eql('3d6')
    })
    it('should handle comments', () => {
      const set = handleSet('1d4 #awesome')
      set.comment.should.eql('awesome')
    })
    it('should apply arithmetic operators', () => {
      const set = handleSet('3d1-2d1*10d1/5 #maaath')
      set.result.should.eql(2)
    })
    it('should complain if the operation is nonsense', () => {
      (() => handleSet('z1d20')).should.throw(`I don't understand \`z1d20\``)
    })
    it('should complain if the string is nonsense', () => {
      (() => handleSet('zebrahorse')).should.throw()
    })
  })
  describe('handleRoll', () => {
    it('should handle a set of rollTypes', () => {
      const roll = handleRoll('1d20+3, 1d4+3d6+3')
      roll.string.should.eql('1d20+3, 1d4+3d6+3')
      roll.sets.length.should.eql(2)
      const [s0, s1] = roll.sets
      const [s0g1, s0g2] = s0.groups
      const [s1g1, s1g2, s1g3] = s1.groups
      s0g1.string.should.eql('1d20')
      s0g1.type.should.eql(rollTypes.SUM)
      s0g2.string.should.eql('3')
      s0g2.type.should.eql(rollTypes.MOD)
      s1g1.string.should.eql('1d4')
      s1g1.type.should.eql(rollTypes.SUM)
      s1g2.string.should.eql('3d6')
      s1g2.type.should.eql(rollTypes.SUM)
      s1g3.string.should.eql('3')
      s1g3.type.should.eql(rollTypes.MOD)
    })
    it('should complain if the string is nonsense', () => {
      (() => handleRoll('zebrahorse')).should.throw()
    })
  })
  describe('handler', () => {
    it('should handle a dice roll command and return a formatted string', () => {
      const result = handler('1d20 + 7, 1d4+3d6+1')
      result.length.should.be.greaterThan(0)
    })
    it('should errors and return their message', () => {
      handler('zebrahorse').should.eql(`I don't understand \`zebrahorse\``)
    })
  })
})
