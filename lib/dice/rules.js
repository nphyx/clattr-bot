/**
 * @module dice::rules
 *
 * Various rolling rule modifiers.
 */
const { pieceMarkers, ruleTypes, MAX_EXPLOSIONS, MAX_RULES } = require('./constants')
const { polyhedral } = require('./pieces')

/**
 * Explodes a single die recursively.
 * @param {Array<die>} dice a set of dice to explode
 * @param {int} target target number for explosion
 * @param {int} [limit=MAX_EXPLOSIONS] maximum number of iterations
 */
function explodedDie(orig, target, limit = MAX_EXPLOSIONS) {
  if (!target) target = orig.size
  if (limit === 0) return []
  if (orig.result < target) return []
  orig.marker = pieceMarkers.EXPLODED
  const next = polyhedral(orig.size)
  return [next, ...explodedDie(next, target, limit - 1)]
}

/**
 * Handles exploding dice.
 *
 * @param {Array<die>} original original set of dice to explode
 * @param {int} target target number to explode
 * @param {int} max max iterations
 */
const explode = (dice, target, max = MAX_EXPLOSIONS) => {
  max = Math.min(max, MAX_EXPLOSIONS)
  let result = []
  dice.forEach(die => {
    result = result.concat(explodedDie(die, target, max))
  })
  return [...dice, ...result]
}

/**
 * Keep the highest or lowest N dice from a set.
 * @param {Array<die>} original dice to check
 * @param {int} count number of dice to keep
 * @param {bool} [lowest=false] keep the lowest instead of highest
 * @returns {array} kept dice
 */
const keep = (original, count, lowest = false) => {
  const sorted = [...original]
    .sort((a, b) => b.result - a.result)
  if (lowest) sorted.reverse()
  const kept = sorted.slice(0, count)
  kept.forEach(d => d.marker = pieceMarkers.KEPT)
  return kept
}

/**
 * Applies a rule set to a set of dice.
 * @param {Array<Die>} dice to apply rules to
 * @param {Array<[operator, operand]>} ruleSet to apply
 * @returns {Array<Die>} modified dice
 */
const apply = (dice, ruleSet) => {
  if (!ruleSet || ruleSet.length === 0) return dice
  if (ruleSet.length > MAX_RULES) throw new Error(`too many modifier rules on your roll`)
  let operator, operand, limit, result = dice
  while (ruleSet.length) {
    [operator, operand] = ruleSet.shift()
    limit = MAX_EXPLOSIONS // reset on each pass
    switch (operator) {
      case ruleTypes.EXPLODE:
        if (ruleSet[0] && ruleSet[0][0] === ruleTypes.EXPLODE_LIMIT) [, limit] = ruleSet.shift()
        result = explode(result, operand, limit)
        break;
      case ruleTypes.KEEP_HIGH:
        result = keep(result, operand, false)
        break;
      case ruleTypes.KEEP_LOW:
        result = keep(result, operand, true)
        break;
      default:
        break;
    }
  }

  return result
}

module.exports = { explode, keep, apply }
