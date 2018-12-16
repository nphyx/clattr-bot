const { formatRoll } = require('./format')
const { combinatorTypes } = require('./constants')
const { sumResults } = require('./util')
const maps = require('./maps')
const parser = require('../parser')
const rolls = require('./rolls')

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
    roll = false,
    size = false,
    operator = false,
    operand = false,
    target = false,
    hasTarget = false,
    rule = true,
    ruleSet = [],
    rest = string

  ;[count, rest] = parser.takeInteger(rest)
  ;[roll, rest] = parser.takeNext(rest, maps.rollString)
  ;[size, rest] = parser.takeInteger(rest)
  ;[hasTarget, rest] = parser.takeNext(rest, 't')
  if (hasTarget) [target, rest] = parser.takeInteger(rest)
  if (rest === string) throw new Error(`I don't understand \`${rest}\``)

  while (rule !== false && rest !== false) {
    [operator, rest] = parser.takeNext(rest, maps.ruleString)
    ;[operand, rest] = parser.takeInteger(rest)
    ruleSet.push([operator, operand])
  }

  return { count, roll, size, target, ruleSet }
}

/**
 * Handles a dice group
 * @param {string} string
 * @returns {object} dice group
 */
const handleGroup = (string, op = combinatorTypes.ADD) => {
  switch (op) {
    case combinatorTypes.MULTIPLY:
    case combinatorTypes.DIVIDE:
    case combinatorTypes.ADD:
    case combinatorTypes.SUB:
      break;
    default:
      throw new Error(`I don't know how to do \`${maps.combinatorKeys.get(op)}\``)
  }
  let { count, roll, size, target, ruleSet } = parseDiceGroup(string)
  count = count || undefined // let defaults happen
  const type = maps.rollOps.get(roll) || rolls.SUM
  size = size || undefined // let defaults happen

  if (ruleSet.length) ruleSet = ruleSet.map(([k, v]) => ([maps.ruleOps.get(k), v]))
  const result = rolls.get(type)(count, ruleSet, size, target)
  return Object.assign({ string, op }, result)
}

/**
 * Handles a dice set (delimited by ',')
 * @param {string} set string to parse
 * @returns {object} dice set
 */
const handleSet = (set) => {
  const string = set.trim()
  let rest = string,
    groups = [],
    next = "",
    comment = false,
    op = "",
    opType = false
  while (next !== false && rest !== false) {
    [op, rest] = parser.takeNext(rest, maps.combinatorString)
    ;[next, rest] = parser.exclude(rest, maps.combinatorString)
    opType = maps.combinatorOps.get(op)
    if (opType === combinatorTypes.COMMENT) {
      comment = next
      break
    } else groups.push(handleGroup(next.trim(), opType))
    if (rest === string) throw new Error(`I don't understand ${rest}`)
  }

  const result = sumResults(groups)

  return { string, groups, result, comment }
}


/**
 * Given a command param string, parses out a set of dice rolls.
 * @param {string} string
 * @return {Array<set>} list of parsed sets
 */
const handleRoll = (string) => {
  let next = "", rest = string, sets = []
  while (next !== false && rest !== false) {
    [next, rest] = parser.exclude(rest, ',')
    if (next) sets.push(handleSet(next.trim()))
    ;[next, rest] = parser.takeNext(rest, ',')
  }
  if (rest) sets.push(handleSet(rest.trim()))
  if (!sets.length) throw new Error(`That roll made no sense :scream:`)
  return { string, sets }
}

/**
 * Roll some dice.
 * @param {string} params command parameters string
 */
const handler = (params) => {
  try {
    const rollResult = handleRoll(params)
    return formatRoll(rollResult)
  } catch (e) {
    return e.message
  }
}

module.exports = { parseDiceGroup, handleGroup, handleSet, handleRoll, handler }
