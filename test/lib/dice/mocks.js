const types = require('../../../lib/dice/types')

const mockDie = (size, result, type = types.DIE) => ({ size, result, type })
const mockFateDie = (size, result) => ({ size, result, type: types.FATE_DIE })
const mockMod = (modifier) => ({ modifier, result: modifier, type: types.MOD })

module.exports = { mockDie, mockFateDie, mockMod }
