const { pieceTypes, pieceMarkers, rollTypes } = require('./constants')
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
    case pieceMarkers.EXPLODED:
      return `${formatPiece(die)}:boom:`
    case pieceMarkers.HIT:
      return `**${formatPiece(die)}**`
    default:
      return formatPiece(die)
  }
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
    case rollTypes.SUM:
      return `${group.string} [ ${group.original.map(formatPieceWithMarker).join(', ')} ]`
    case rollTypes.FATE:
      return `${group.dice.length} [ ${group.dice.map(formatPieceWithMarker).join(', ')} ]`
    case rollTypes.POOL:
      return `${group.dice[0].size} [ ${group.original.map(formatPieceWithMarker).join(', ')} ]`
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
  return `( \u2684 ${formatGroups(set.groups)} = ${set.result} )`
}

/**
 * Formats a set's results and comments into a result string.
 * @param {object} set
 * @return {string}
 */
const formatSetResult = (set) => {
  return `${formatComment(set.comment)}**\`${set.result}\`**`
}

/**
 * Formats the results of a full roll.
 * @param {object} roll
 * @return {string}
 */
const formatRoll = (roll) => {
  try {
    return `${roll.sets.map(formatSetResult).join(', ')}  :::  ${roll.sets.map(formatSetGroups).join('  :  ')}  :::  *${roll.string}*`
  } catch (e) {
    console.error('Formatting error', roll, e.stack)
    throw new FormattingError('I messed up formatting the result...')
  }
}

module.exports = {
  formatPiece,
  formatPieceWithMarker,
  formatGroup,
  formatGroups,
  formatSetGroups,
  formatRoll
}
