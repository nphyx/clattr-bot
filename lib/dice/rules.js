/**
 * @module dice::rules
 *
 * Various rolling rule modifiers.
 */
const parser = require('../parser')
const types = require('./types')
const { die } = require('./factories')
const { sumDice } = require('./util')

const MAX_EXPLOSIONS = 5 // we don't want funky commands to crash us

/**
 * parses the operand supplied for exploding dice.
 * @param {string} operandString
 * @return {object} { target, limit }
 */
const parseExplodeOperand = (operandString) => {
  let target = false,
    tmp = false,
    limit = MAX_EXPLOSIONS,
    remaining = false

  ;[target, remaining] = parser.takeInteger(operandString)
  if (remaining) {
    [tmp, remaining] = parser.takeNext(remaining, 'm')
    if (tmp)
      [limit] = parser.takeInteger(remaining)
  }
  return { target, limit: (limit ? Math.min(limit, MAX_EXPLOSIONS) : MAX_EXPLOSIONS) }
}

/**
 * Explodes a single die recursively.
 * @param {Array<die>} dice a set of dice to explode
 * @param {object} target target number for explosion
 * @param {int} [limit=MAX_EXPLOSIONS] maximum number of iterations
 */
function explodedDie(orig, target, limit = MAX_EXPLOSIONS) {
  if (limit === 0) return []
  if (orig.result < target) return []
  orig.type = types.EXPLODED
  const next = die(orig.size)
  return [next, ...explodedDie(next, target, limit - 1)]
}

/**
 * Handles exploding dice.
 * @param {Array<die>} original original set of dice to explode
 * @param {string} [operandString=""] an operand string, if provided
 */
const explode = (original, operandString = "") => {
  let exploded = []
  let { target, limit } = parseExplodeOperand(operandString)
  original.forEach(die => {
    target = target || die.size
    exploded = exploded.concat(explodedDie(die, target, limit))
  })
  const dice = [...original, ...exploded]
  return dice
}

/**
 * Keep the highest or lowest N dice from a set.
 * @param {array<die>} original dice to check
 * @param {int} count number of dice to keep
 * @param {bool} [lowest=false] keep the lowest instead of highest
 * @returns {array} kept dice
 */
const keep = (original, count, lowest = false) => {
  const sorted = [...original]
    .sort((a, b) => b.result - a.result)
  if (lowest) sorted.reverse()
  const kept = sorted.slice(0, count)
  kept.forEach(d => d.type = types.KEPT)
  return kept
}

module.exports = { parseExplodeOperand, explode, keep, MAX_EXPLOSIONS }
