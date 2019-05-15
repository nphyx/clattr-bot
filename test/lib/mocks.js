const { pieceTypes } = require('../../lib/common/constants')

const mockDie = (size, result, marker) => ({ size, result, type: pieceTypes.POLY, marker })
const mockFateDie = (size, result) => ({ size, result, type: pieceTypes.FATE })
const mockMod = (modifier) => ({ modifier, result: modifier, type: pieceTypes.MOD })

module.exports = { mockDie, mockFateDie, mockMod }
