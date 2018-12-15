const { formatDie, formatPoolDie, formatGroupDice, formatSetGroups, formatRoll } = require('../../../lib/dice/format')
const { fateDiceUnicode } = require('../../../lib/dice/maps')
const types = require('../../../lib/dice/types')
const { mockDie, mockFateDie, mockMod } = require('./mocks')

const mockGroup1 = {
  string: '3d6',
  dice: [mockDie(6, 2), mockDie(6, 5), mockDie(6, 3)],
  type: types.GROUP,
  result: 10
}
const groupString1 = '3d6 [ 2, 5, 3 ]'
const mockGroup2 = {
  string: '1d4',
  dice: [mockDie(4, 1)],
  type: types.GROUP,
  result: 1
}
const groupString2 = '1d4 [ 1 ]'

const mockPool = {
  string: '3p6',
  dice: [mockDie(6, 2), mockDie(6, 5), mockDie(6, 3)],
  target: 4,
  type: types.POOL,
  result: 1
}
const poolString = '6 [ 2, **5**, 3 ]'

const mockFatePool = {
  string: '4f',
  dice: [mockFateDie(3, '+'), mockFateDie(3, '-'), mockFateDie(3, ' ')],
  type: types.FATE_POOL,
  result: 0
}
const fatePoolString = `3 [ ${fateDiceUnicode.get('+')}, ${fateDiceUnicode.get('-')}, ${fateDiceUnicode.get(' ')} ]`

const mockSet = {
  string: '1d4+3d6+3',
  result: 14,
  groups: [mockGroup1, mockGroup2, mockMod(3)],
  comment: 'sneak attack'
}
const mockSetString = `( \u2684 ${groupString1} + ${groupString2} + 3 = 14 )`

const mockPoolSet = {
  string: '3p6',
  groups: [mockPool],
  result: 1
}
const mockPoolSetString = `( \u2684 ${poolString} = 1 )`

const mockFateSet = {
  string: '4f+3',
  groups: [mockFatePool],
  result: 3
}
const mockFateSetString = `( \u2684 ${fatePoolString} = 3 )`


const mockRoll = {
  string: '3p6, 1d4+3d6+3',
  sets: [mockPoolSet, mockSet]
}

const mockSingleRoll = {
  string: '3p6',
  sets: [mockPoolSet]
}

describe('dice::format module', () => {
  describe('formatDie', () => {
    it('should handle normal dice', () => {
      formatDie(mockDie(10, 3)).should.eql('3')
    })
    it('should handle kept dice', () => {
      formatDie(mockDie(10, 3, types.KEPT)).should.eql('**3**')
    })
    it('should handle exploded dice', () => {
      formatDie(mockDie(10, 3, types.EXPLODED)).should.eql('3:boom:')
    })
    it('should handle fate dice', () => {
      formatDie(mockFateDie(3, '+')).should.eql(fateDiceUnicode.get('+'))
      formatDie(mockFateDie(3, '-')).should.eql(fateDiceUnicode.get('-'))
      formatDie(mockFateDie(3, ' ')).should.eql(fateDiceUnicode.get(' '))
    })
  })
  describe('formatPoolDie', () => {
    it('should highlight a hit', () => {
      formatPoolDie(7)(mockDie(10, 7)).should.eql('**7**')
    })
    it('should not highlight a miss', () => {
      formatPoolDie(7)(mockDie(10, 3)).should.eql('3')
    })
  })
  describe('formatGroupDice', () => {
    it('should format a dice sum group', () => {
      formatGroupDice(mockGroup1).should.eql(groupString1)
      formatGroupDice(mockGroup2).should.eql(groupString2)
    })
    it('should format a dice pool group', () => {
      formatGroupDice(mockPool).should.eql(poolString)
    })
    it('should format a fate pool group', () => {
      formatGroupDice(mockFatePool).should.eql(fatePoolString)
    })
  })
  describe('formatSetGroups', () => {
    it('should format a dice set', () => {
      formatSetGroups(mockSet).should.eql(mockSetString)
    })
    it('should format a fate set', () => {
      formatSetGroups(mockFateSet).should.eql(mockFateSetString)
    })
  })
  describe('formatRoll', () => {
    it('should format a complete roll', () => {
      formatRoll(mockRoll).should.eql(`**\`1\`**, **sneak attack**: **\`14\`**  :::  ${mockPoolSetString}  :  ${mockSetString}`)
    })
  })
})
