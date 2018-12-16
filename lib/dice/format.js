const { pieceTypes, pieceMarkers, rollTypes } = require('./constants')
const { strings } = require('./maps')

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
 * Formats a modifier result.
 * @param {object} mod
 * @return {string}
 */
const formatMod = (mod) => {
  return `${(mod.result > 0 ? ' + ' : '')}${mod.result}`
}

/**
 * Formats the individual results in a dice group.
 * @param {object} group
 * @return {string}
 */
const formatGroupDice = (group) => {
  switch (group.type) {
    case rollTypes.SUM:
      return `${group.string} [ ${group.original.map(formatPieceWithMarker).join(', ')} ]`
    case rollTypes.FATE:
      return `${group.dice.length} [ ${group.original.map(formatPieceWithMarker).join(', ')} ]`
    case rollTypes.POOL:
      return `${group.dice[0].size} [ ${group.original.map(formatPieceWithMarker).join(', ')} ]`
  }
}


/**
 * formats roll modifiers.
 * @param {object} group
 * @return {string}
 */
const formatGroupMods = (group) => {
  switch (group.type) {
    case pieceTypes.MOD:
      return formatMod(group)
  }
}

/**
 * formats a comment string.
 * @param {string} comment
 * @return {string}
 */
const formatComment = (comment) => comment ? `**${comment}**: ` : ''

/**
 * selects dice rolls from a set.
 * @param {object} set
 * @return {Array<Roll>}
 */
const selectDice = (set) => set.groups
  .filter(group => [rollTypes.SUM, rollTypes.POOL, rollTypes.FATE].includes(group.type))

/**
 * selects roll modifiers from a set.
 * @param {object} set
 * @return {Array<Roll>}
 */
const selectMods = (set) => set.groups.filter(group => group.type === pieceTypes.MOD)

/**
 * Combines a set's rolling groups into a details string explaining the roll.
 * @param {object} set
 * @return {string}
 */
const formatSetGroups = (set) => {
  return `( \u2684 ${selectDice(set).map(formatGroupDice).join(' + ')}${selectMods(set).map(formatGroupMods).join('')} = ${set.result} )`
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
  return `${roll.sets.map(formatSetResult).join(', ')}  :::  ${roll.sets.map(formatSetGroups).join('  :  ')}`
}

module.exports = {
  formatPiece,
  formatPieceWithMarker,
  formatGroupDice,
  formatSetGroups,
  formatRoll
}
