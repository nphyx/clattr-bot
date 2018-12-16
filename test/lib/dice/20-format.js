const {
  formatPiece,
  formatPieceWithMarker,
  formatGroup,
  formatSetGroups,
  formatRoll
} = require('../../../lib/dice/format')
const { strings } = require('../../../lib/dice/maps')
const { pieceMarkers, rollTypes, combinatorTypes } = require('../../../lib/dice/constants')
const { mockDie, mockFateDie } = require('./mocks')

const mockGroup1 = {
  string: '3d6',
  original: [mockDie(6, 2), mockDie(6, 5), mockDie(6, 3)],
  dice: [mockDie(6, 2), mockDie(6, 5), mockDie(6, 3)],
  type: rollTypes.SUM,
  op: combinatorTypes.ADD,
  result: 10
}
const groupString1 = '3d6 [ 2, 5, 3 ]'
const mockGroup2 = {
  string: '1d4',
  original: [mockDie(4, 1)],
  dice: [mockDie(4, 1)],
  type: rollTypes.SUM,
  op: combinatorTypes.ADD,
  result: 1
}
const groupString2 = '1d4 [ 1 ]'

const mockPool = {
  string: '3p6',
  original: [mockDie(6, 2), mockDie(6, 5, pieceMarkers.HIT), mockDie(6, 3)],
  dice: [mockDie(6, 2), mockDie(6, 5, pieceMarkers.HIT), mockDie(6, 3)],
  target: 4,
  type: rollTypes.POOL,
  op: combinatorTypes.ADD,
  result: 1
}
const poolString = '6 [ 2, **5**, 3 ]'

const mockFatePool = {
  string: '4f',
  dice: [mockFateDie(3, 1), mockFateDie(3, -1), mockFateDie(3, 0)],
  type: rollTypes.FATE,
  op: combinatorTypes.ADD,
  result: 0
}
const fatePoolString = `3 [ ${strings.fateDieFaces.get(1)}, ${strings.fateDieFaces.get(-1)}, ${strings.fateDieFaces.get(0)} ]`

const mockModifier = {
  string: '3',
  type: rollTypes.MOD,
  op: combinatorTypes.ADD,
  result: 3
}

const mockSet = {
  string: '1d4+3d6+3',
  result: 14,
  groups: [mockGroup1, mockGroup2, mockModifier],
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
  groups: [mockFatePool, mockModifier],
  result: 3
}
const mockFateSetString = `( \u2684 ${fatePoolString} + 3 = 3 )`


const mockRoll = {
  string: '3p6, 1d4+3d6+3',
  sets: [mockPoolSet, mockSet]
}

describe('dice::format module', () => {
  describe('formatPiece', () => {
    it('should handle normal dice', () => {
      formatPiece(mockDie(10, 3)).should.eql('3')
    })
    it('should handle fate dice', () => {
      formatPiece(mockFateDie(3, 1)).should.eql(strings.fateDieFaces.get(1))
      formatPiece(mockFateDie(3, -1)).should.eql(strings.fateDieFaces.get(-1))
      formatPiece(mockFateDie(3, 0)).should.eql(strings.fateDieFaces.get(0))
    })
  })
  describe('formatPieceWithMarker', () => {
    it('should handle kept dice', () => {
      formatPieceWithMarker(mockDie(10, 3, pieceMarkers.KEPT)).should.eql('**3**')
    })
    it('should handle exploded dice', () => {
      formatPieceWithMarker(mockDie(10, 3, pieceMarkers.EXPLODED)).should.eql('3:boom:')
    })
    it('should highlight a hit', () => {
      formatPieceWithMarker(mockDie(10, 7, pieceMarkers.HIT)).should.eql('**7**')
    })
    it('should not change unmarked pieces', () => {
      formatPieceWithMarker(mockDie(10, 3)).should.eql('3')
    })
  })
  describe('formatGroup', () => {
    it('should format a dice sum group', () => {
      formatGroup(mockGroup1).should.eql(groupString1)
      formatGroup(mockGroup2).should.eql(groupString2)
    })
    it('should format a dice pool group', () => {
      formatGroup(mockPool).should.eql(poolString)
    })
    it('should format a fate pool group', () => {
      formatGroup(mockFatePool).should.eql(fatePoolString)
    })
    it('should format a modifier group', () => {
      formatGroup(mockModifier).should.eql('3')
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
      formatRoll(mockRoll).should.eql(`**\`1\`**, **sneak attack**: **\`14\`**  :::  ${mockPoolSetString}  :  ${mockSetString}  :::  *${mockRoll.string}*`)
    })
  })
})
