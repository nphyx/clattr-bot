const { pieceTypes, pieceMarkers, rollTypes } = require('../common/constants')
const { strings } = require('./maps')

function FormattingError(message) {
  this.name = 'FormattingError'
  this.message = message
}

FormattingError.prototype = Error.prototype

const formatPiece = (die) => {
  switch (die.type) {
    case pieceTypes.FATE:
      return `${strings.fateDieFaces.get(die.result)}`
    default:
      return `${die.result}`
  }
}

/**
 * Applies a wrapper to game pieces with special markers.
 * @param {object} die
 * @return string
 */
const formatPieceWithMarker = (die) => {
  switch (die.marker) {
    case pieceMarkers.KEPT:
      return `**${formatPiece(die)}**`
    case pieceMarkers.WILD:
      return `${formatPiece(die)}:shamrock:`
    case pieceMarkers.WILD_EXPLODED:
      return `**${formatPiece(die)}**:four_leaf_clover:`
    case pieceMarkers.EXPLODED:
      return `**${formatPiece(die)}**:boom:`
    case pieceMarkers.HIT:
      return `**${formatPiece(die)}**`
    default:
      return formatPiece(die)
  }
}

const mapExplosions = (group) => {
  const original = [...group.original]
  const exploded = [...group.dice].slice(original.length)
  const result = []
  while (exploded.length && original.length) {
    let next = original.shift()
    result.push(next)
    if (next.marker === pieceMarkers.EXPLODED) {
      let next = exploded.shift()
      result.push(next)
      while (next.marker === pieceMarkers.EXPLODED) {
        next = exploded.shift()
        result.push(next)
      }
    }
  }
  return [...result, ...original]
}

/**
 * Formats the individual results in a dice group.
 * @param {object} group
 * @return {string}
 */
const formatGroup = (group) => {
  switch (group.type) {
    case rollTypes.MOD:
      return `${group.result}`
    case rollTypes.WILD:
      return `${group.string} [ ${group.dice.map(formatPieceWithMarker).join(', ')} ]`
    case rollTypes.SUM:
      return `${group.string} [ ${mapExplosions(group).map(formatPieceWithMarker).join(', ')} ]`
    case rollTypes.FATE:
      return `${group.dice.length} [ ${group.dice.map(formatPieceWithMarker).join(', ')} ]`
    case rollTypes.POOL:
      return `${group.dice[0].size} [ ${mapExplosions(group).map(formatPieceWithMarker).join(', ')} ]`
  }
}

/**
 * formats a comment string.
 * @param {string} comment
 * @return {string}
 */
const formatComment = (comment) => comment ? `**${comment}**: ` : ''

const formatCombinator = (op) => strings.combinators.get(op)

const formatGroups = (groups) => {
  if (!groups || groups.length === 0) return ''
  const todo = [...groups]
  let string = formatGroup(todo.shift())
  while (todo.length) {
    let next = todo.shift()
    string = `${string} ${formatCombinator(next.op)} ${formatGroup(next)}`
  }
  return string
}

/**
 * Combines a set's rolling groups into a details string explaining the roll.
 * @param {object} set
 * @return {string}
 */
const formatSetGroups = (set) => {
  return set.groups.length ? `( \u2684 ${formatGroups(set.groups)} = ${set.result} )` : undefined
}

/**
 * Formats a set's results and comments into a result string.
 * @param {object} set
 * @return {string}
 */
const formatSetResult = (set) => {
  const resultString = set.groups.length ? `**\`${set.result}\`**` : ''
  return `${formatComment(set.comment)}${resultString}`
}

const clean = v => v !== undefined

/**
 * Formats the results of a full roll.
 * @param {object} roll
 * @return {string}
 */
const formatRoll = (roll) => {
  try {
    return `rolled ${roll.sets.map(formatSetResult).filter(clean).join(', ')}  :::  ${roll.sets.map(formatSetGroups).filter(clean).join('  :  ')}  :::  *${roll.string}*`
  } catch (e) {
    throw new FormattingError('I messed up formatting the result...')
  }
}

module.exports = {
  FormattingError,
  formatPiece,
  formatPieceWithMarker,
  formatGroup,
  formatGroups,
  formatSetGroups,
  formatSetResult,
  formatRoll
}
