const { diceSum, dicePool, diceFate, die, modifier } = require('./factories')
const { explode, keep } = require('./rules')

/**
 * @module dice::maps
 *
 * Collection of maps and associated constants
 */

const ruleOperations = new Map([
  ['!', explode],
  ['k', keep],
  ['l', (dice, target) => keep(dice, target, true)]
])

const groupOperations = new Map([
  ['d', diceSum],
  ['p', dicePool],
  ['f', diceFate],
  [false, modifier]
])

// group operations that take a target number
const groupsWithTargets = ['p']

const defaultDieSizes = new Map([
  ['d', 6], // sum dice
  ['p', 10], // group dice
  ['f', 3] // fate dice
])

const fateDiceUnicode = new Map([
  ['+', '\u229E'],
  ['-', '\u229F'],
  [' ', '\u25A1']
])

const groupTypes = [...groupOperations.keys()].join('')
const ruleTypes = [...ruleOperations.keys()].join('')

module.exports = { ruleOperations, groupOperations, groupsWithTargets, defaultDieSizes, groupTypes, ruleTypes, fateDiceUnicode }
