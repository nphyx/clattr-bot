const { formatRoll } = require('./format')
const { combinatorTypes, rollTypes } = require('../common/constants')
const { totalGroups } = require('./util')
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

function ParsingError(message) {
  this.name = 'ParsingError'
  this.message = message
}

ParsingError.prototype = Error.prototype

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
    operator = true,
    operand = false,
    target = false,
    hasTarget = false,
    ruleSet = [],
    rest = string

  ;[count, rest] = parser.takeInteger(rest)
  ;[roll, rest] = parser.takeNext(rest, maps.rollString)
  ;[size, rest] = parser.takeInteger(rest)
  ;[hasTarget, rest] = parser.takeNext(rest, 't')
  if (hasTarget) [target, rest] = parser.takeInteger(rest)
  if (rest === string) throw new ParsingError(`I don't understand \`${rest}\``)

  while (operator !== false && rest !== false) {
    [operator, rest] = parser.takeNext(rest, maps.ruleString)
    if (!operator) throw new ParsingError(`I can't do \`${rest}\``)
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
  try {
    let { count, roll, size, target, ruleSet } = parseDiceGroup(string)
    count = count || undefined // let defaults happen
    const type = maps.rollOps.get(roll)
    size = size || undefined // let defaults happen
    if (count > 30 && type !== rollTypes.MOD) throw new ParsingError(`maximum die count is 30, you sneaky hacker you! \`(${string})\``)
    if (size > 100) throw new ParsingError(`maximum die size is 100, you sneaky hacker you! \`(${string})\``)

    if (ruleSet.length) ruleSet = ruleSet.map(([k, v]) => ([maps.ruleOps.get(k), v]))
    const result = rolls.get(type)(count, ruleSet, size, target)
    return Object.assign({ string, op }, result)
  } catch (e) {
    if (e.name === "ParsingError" && e.message) throw e
    throw new ParsingError(`I don't understand \`${string}\``)
  }
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
    if (rest === string) throw new ParsingError(`I don't understand \`${string}\``)
    else if (opType === combinatorTypes.COMMENT) {
      comment = next
      break
    } else groups.push(handleGroup(next.trim(), opType))
  }

  const result = totalGroups(groups)
  return { string, groups, result, comment }
}


/**
 * Given a command param string, parses out a set of dice rolls.
 * @param {string} string
 * @return {Array<set>} list of parsed sets
 */
const handleRoll = (string) => {
  let next = "", rest = string, sets = []
  try {
    while (next !== false && rest !== false) {
      [next, rest] = parser.exclude(rest, ',')
      if (next) sets.push(handleSet(next.trim()))
      ;[next, rest] = parser.takeNext(rest, ',')
    }
    if (sets.length > 10) throw new ParsingError(`slow your roll there buddy, ${sets.length} groups is too many`)
  } catch (e) {
    if (e.name === 'ParsingError') throw new ParsingError(e.message)
    else throw new Error(`That roll made no sense :scream:`)
  }
  return { string, sets }
}

/**
 * Roll some dice.
 * @param {string} params command parameters string
 */
const handler = (params) => {
  try {
    const rollResult = handleRoll(params)
    const result = formatRoll(rollResult)
    if (result.length > 2000) throw new ParsingError(`you did a bad thing, and you should be ashamed of yourself \`(${params})\``)
    return result
  } catch (e) {
    console.error(`bad roll: '${params}' (${e.message})`)
    return e.message
  }
}

module.exports = { parseDiceGroup, handleGroup, handleSet, handleRoll, handler }
