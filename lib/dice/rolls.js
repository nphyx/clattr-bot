const { rollTypes, pieceMarkers } = require('./constants')
const { polyhedral, fate, coin } = require('./pieces')
const { sum, sumResults } = require('./util')
const rules = require('./rules')

const getPieces = (count, size, factory) => new Array(count).fill(size).map(factory)

/**
 * A pool of dice and their successes.
 * @param {int} [count=1] number of dice to roll
 * @param {Array<[operator, operand]>} [ruleSet=[]] to apply to dice roll
 * @param {int} [size=10] size of dice to roll
 * @param {int} [target] hit target number (defaults to roughly the upper 2/3rds of dice size)
 * @return {object} { dice, target, type, result } the result of the roll
 */
let rollPool = (count = 1, ruleSet = [], size = 10, target) => {
  const original = getPieces(count, size, polyhedral)
  const dice = rules.apply(original, ruleSet)
  target = target || Math.ceil(size * .7)
  dice.forEach(die => {
    if (die.result >= target && !die.marker) die.marker = pieceMarkers.HIT
  })
  return {
    original,
    dice,
    target,
    size,
    count,
    type: rollTypes.POOL,
    result: dice.map(die => die.result >= target ? 1 : 0).reduce(sum, 0)
  }
}

/**
 * A set of dice and their sum.
 * @param {int} [count=1] number of dice to roll
 * @param {Array<[operator, operand]>} [ruleSet=[]] to apply to dice roll
 * @param {int} [size=6] size of dice to roll
 * @return {object} { dice, type, result } the result of the roll
 */
let rollSum = (count = 1, ruleSet = [], size = 6) => {
  const original = getPieces(count, size, polyhedral)
  const dice = rules.apply(original, ruleSet)
  return {
    original,
    dice,
    size,
    count,
    type: rollTypes.SUM,
    result: sumResults(dice)
  }
}

/**
 * A pool of fate dice and their result.
 * @param {int} [count=1] number of dice to roll
 * @return {object} { dice, type, result } the result of the roll
 */
let rollFate = (count = 1) => {
  const dice = getPieces(count, 0, fate)
  return ({
    dice,
    count,
    type: rollTypes.FATE,
    result: sumResults(dice)
  })
}

/**
 * A coin toss and its result.
 * @param {int} [count=1] number of dice to roll
 * @return {object} { dice, type, result } the result of the roll
 */
let flipCoins = (count = 1) => {
  const coins = getPieces(count, 0, coin)
  return {
    coins,
    count,
    type: rollTypes.COIN_TOSS,
    result: sumResults(coins)
  }
}

/**
 * A simple scalar modifier.
 * @param {int} modifier
 * @return {object} { modifier, type, result }
 */
let makeModifier = (modifier) => ({
  modifier,
  type: rollTypes.MOD,
  result: modifier
})

let rollArray = [
  [rollTypes.MOD, makeModifier],
  [rollTypes.POOL, rollPool],
  [rollTypes.SUM, rollSum],
  [rollTypes.FATE, rollFate],
  [rollTypes.COIN_TOSS, flipCoins]
]

module.exports = new Map(rollArray)
