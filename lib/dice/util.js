const types = require('./types')

const sum = (p, c) => p + c

const sumDice = exports.sumDice = (p, c) => p + c.result

/**
 * Convert a set of dice to fate dice.
 */
const toFateDice = (dice) => {
  dice.forEach(die => {
    if (die.size % 3 !== 0) throw new Error("Fate dice must have a multiple of 3 faces")
  })
  return dice.map(die => ({
    size: die.size,
    result: (
      die.result > (Math.floor(die.size / 3) * 2)
        ? "+"
        : die.result > Math.floor(die.size / 3)
          ? " "
          : "-"
    ),
    type: types.FATE_DIE
  }))
}

module.exports = { sum, sumDice, toFateDice }
