/**
 * @module dice::maps
 *
 * A collection of maps to symbols and operators.
 */
const { ruleTypes, combinatorTypes, rollTypes } = require('../common/constants')

const inverse = module.exports.inverse = (arr) => {
  return arr.map(([v, k]) => ([k, v]))
}

const freeze = module.exports.freeze = (arr) => {
  if (!arr) return arr
  if (arr.forEach) arr.forEach(inner => freeze(inner))
  return Object.freeze(arr)
}

const parserString = module.exports.parserString = (arr) => {
  return arr.filter(([k]) => k).map(([k]) => k).join('')
}

/**
 * @module dice::maps
 *
 * Collection of maps and associated constants, used for looking up operations.
 */

/**
 * Lookup table for combinator operators
 */

const combinatorArray = [
  [false, combinatorTypes.ADD], // default
  ['+', combinatorTypes.ADD],
  ['-', combinatorTypes.SUB],
  ['*', combinatorTypes.MULTIPLY],
  ['/', combinatorTypes.DIVIDE],
  ['#', combinatorTypes.COMMENT]
]

module.exports.combinatorOps = new Map(freeze(combinatorArray))
module.exports.combinatorKeys = new Map(freeze(inverse(combinatorArray)))
module.exports.combinatorString = parserString(combinatorArray)

const ruleArray = [
  ['m', ruleTypes.EXPLODE_LIMIT],
  ['!', ruleTypes.EXPLODE],
  ['k', ruleTypes.KEEP_HIGH],
  ['l', ruleTypes.KEEP_LOW],
  ['w', ruleTypes.WILD]
]

module.exports.ruleOps = new Map(freeze(ruleArray))
module.exports.ruleKeys = new Map(freeze(inverse(ruleArray)))
module.exports.ruleString = parserString(ruleArray)

const rollArray = [
  [false, rollTypes.MOD],
  ['d', rollTypes.SUM],
  ['p', rollTypes.POOL],
  ['f', rollTypes.FATE],
  ['w', rollTypes.WILD]
]

module.exports.rollOps = new Map(freeze(rollArray))
module.exports.rollKeys = new Map(freeze(inverse(rollArray)))
module.exports.rollString = parserString(rollArray)

const rollHasTargetArray = [
  [rollTypes.SUM, false],
  [rollTypes.POOL, true],
  [rollTypes.FATE, false]
]

module.exports.rollHasTarget = new Map(freeze(rollHasTargetArray))
module.exports.rollHasTargetKeys = new Map(freeze(inverse(rollHasTargetArray)))

const defaults = {}

const dieSizeArray = [
  [rollTypes.SUM, 6],
  [rollTypes.POOL, 10],
  [rollTypes.FATE, 3]
]

defaults.dieSize = new Map(freeze(dieSizeArray))
defaults.dieSizeKeys = new Map(freeze(inverse(dieSizeArray)))

const dieTargetArray = [
  [rollTypes.SUM, 7],
  [rollTypes.POOL, 7],
  [rollTypes.FATE, 7],
  [rollTypes.WILD, 4]
]

defaults.dieTarget = new Map(freeze(dieTargetArray))
defaults.dieTargetKeys = new Map(freeze(inverse(dieTargetArray)))

module.exports.defaults = Object.freeze(defaults)

const strings = {}

const fateDieFaceArray = [
  [-1, '\u229F'],
  [0, '\u25A1'],
  [1, '\u229E']
]

strings.fateDieFaces = new Map(freeze(fateDieFaceArray))

const combinatorFaceArray = [
  [combinatorTypes.ADD, '\u002B'],
  [combinatorTypes.SUB, '\u2212'],
  [combinatorTypes.MULTIPLY, '\u00D7'],
  [combinatorTypes.DIVIDE, '\u00F7']
]

strings.combinators = new Map(freeze(combinatorFaceArray))

module.exports.strings = Object.freeze(strings)
