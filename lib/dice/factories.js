const types = require('./types')
const MersenneTwister = require('mersenne-twister')
const { sum, sumDice, toFateDice } = require('./util')
const generator = new MersenneTwister()

/**
 * Die factory, generates a dice function that when called returns a roll result
 * @param {int} size size of die to roll
 * @return {object} { size, type, result } the die and its roll
 */
const dieFactory = exports.die = (size) => {
  return ({
    size,
    type: types.DIE,
    result: Math.ceil(generator.random() * size)
  })
}

/**
 * A set of dice and their sum.
 * @param {Array<die>} dice to sum
 * @return {object} { die, type, result } the result of the roll
 */
const diceSumFactory = exports.diceSum = (dice) => {
  return ({
    dice,
    type: types.GROUP,
    result: dice.reduce(sumDice, 0)
  })
}

/**
 * A pool of dice and their successes.
 * @param {Array<die>} dice to sum
 * @param {int} target number for dice
 * @return {object} { dice, target, type, result } the result of the roll
 */
const dicePoolFactory = exports.dicePool = (dice, target) => {
  return ({
    dice,
    target,
    type: types.POOL,
    result: dice.map(die => die.result >= target ? 1 : 0).reduce(sum)
  })
}

/**
 * A pool of fate dice and their result.
 * @param {Array<die>} dice to be converted to fate dice
 * @param {object} converted dice and their computed result
 * @return { dice, type, result } the result of the roll
 */
const diceFateFactory = exports.diceFate = (dice) => {
  const fateDice = toFateDice(dice)
  return ({
    original: dice,
    dice: fateDice,
    type: types.FATE_POOL,
    result: (
      fateDice.filter(die => die.result === "+").length -
      fateDice.filter(die => die.result === "-").length
    )
  })
}

/**
 * A modifier is an integer, added to a group of dice.
 */
const modifierFactory = exports.modifier = (modifier) => ({
  modifier,
  type: types.MOD,
  result: parseInt(modifier)
})
