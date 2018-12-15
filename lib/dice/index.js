const types = require('./types')
const { die, modifier } = require('./factories')
const { sum, sumDice } = require('./util')
const { formatRoll } = require('./format')
const {
  defaultDieSizes,
  groupTypes,
  ruleTypes,
  groupOperations,
  ruleOperations,
  groupsWithTargets
} = require('./maps')
const parser = require('../parser')

/**
 * Dice handler library.
 *
 * Terminology
 * -----------
 *
 * group: a group of dice rolled together, delimited by group operators (+, -, etc)
 * pool: a group of dice rolled as a pool, scored against a target number
 * target: the target of a dice pool, which each die must be >= to score
 * set: a series of groups, delimited by (,)
 * modifier: a number added to the sum of a group
 *
 * Examples:
 * ---------
 * `3d20` : a group of 3 d20s, which will be summed together
 * `3p10t5` : a pool of 3 d10s, which will be rolled and scored against a target of 5
 * `1d20+1, 1d10+4` : a set of dice, rolled in two groups of 1d20 and 1d10 with modifiers
 *
 */

/**
 * Parses a dice group string, supporting various formats.
 *
 * @example
 * ```
 * 10d // roll 10 six-sided dice
 * d20 // roll 1 20-sided die
 * 2d20k1 // roll 2 20-sided dice and keep the highest
 * 10p10 // roll a pool of 10 10-sided dice
 * 6f // roll 6 fate dice
 * ```
 *
 * See README.md for full list of supported rolls.
 *
 * @param {string} a dice group string
 */
const parseDiceGroup = (string) => {
  let count = false,
    type = false,
    size = false,
    rule = false,
    target = false,
    tmp = false,
    ruleOperand = false,
    remaining = string

  ;[count, remaining] = parser.takeInteger(remaining)
  if (!count) count = 1
  ;[type, remaining] = parser.takeNext(remaining, groupTypes)
  ;[size, remaining] = parser.takeInteger(remaining)
  size = size || defaultDieSizes.get(type) || false
  if (groupsWithTargets.includes(type)) {
    [tmp, remaining] = parser.takeNext(remaining, 't')
    if (tmp) [target, remaining] = parser.takeInteger(remaining)
  }
  [rule, remaining] = parser.takeNext(remaining, ruleTypes)
  ruleOperand = remaining

  return { count, type, size, target, rule, ruleOperand }
}

/**
 * Handles a dice group
 * @param {string} string
 * @returns {object} dice group
 */
const handleGroup = (string) => {
  const { count, type, size, rule, target, ruleOperand } = parseDiceGroup(string)
  let ruleResult = {}
  if (type === false) return Object.assign(
    { string },
    modifier(count)
  )
  let dice = new Array(count).fill(0).map(i => die(size))
  let original = dice
  if (rule) dice = ruleOperations.get(rule)(original, ruleOperand)
  return Object.assign(
    { string, rule, target, original },
    groupOperations.get(type)(dice, target)
  )
}

/**
 * Handles a dice set (delimited by ',')
 * @returns {object} dice set
 */
const handleSet = (set) => {
  const string = set.trim()
  const [diceGroups, comment] = parser.exclude(string, '#')
  const groups = diceGroups.split('+').map(group => group.trim()).map(handleGroup)
  const result = groups.reduce((p, c) => p += c.result, 0)

  return { string, groups, result, comment: (comment ? comment.slice(1) : false) }
}


/**
 * Given a command param string, parses out a set of dice rolls.
 * @param {string} string
 */
const handleRoll = (string) => {
  const sets = string.split(',').map(set => set.trim()).map(handleSet)
  return { string, sets }
}

/**
 * Roll some dice.
 * @param {string} params command parameters string
 */
const handler = (params) => {
  const rollResult = handleRoll(params)
  return formatRoll(rollResult)
}

module.exports = { parseDiceGroup, handleGroup, handleSet, handleRoll, handler }
