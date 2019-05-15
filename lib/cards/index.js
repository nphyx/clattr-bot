const parser = require('../parser')

const handler = (params) => {
  try {
    return 'unimplemented :('
  } catch (e) {
    console.log(`bad card command: '${params}' (${e.message}'`)
    return e.message
  }
}

module.exports = { handler }
