const pieces = require('../common/pieces')
const ops = require('./operations')

const packs = new Map([
  ['channel', pieces.playingCardPack()]
])

function CardParsingError(message) {
  this.name = 'CardParsingError'
  this.message = message
}

CardParsingError.prototype = Error.prototype

const isNumeric = string => !isNaN(parseInt(string))
const handleCardCommand = (string) => {
  let op = 'draw', amount = 0, pack = 'channel'
  let opHandler = () => { throw new CardParsingError(`I don't understand \`${string}\``) }
  let parts = string ? string.trim().split(' ') : []
  switch (parts.length) {
    case 2:
      if (isNumeric(parts[0])) {
        amount = parseInt(parts[0])
        pack = parts[1]
      } else if (ops.has(parts[0])) [op, pack] = parts
      break;
    case 1:
      if (isNumeric(parts[0])) amount = parseInt(parts[0])
      else if (ops.has(parts[0])) op = parts[0]
      else {
        amount = 1
        pack = parts[0]
      }
      break;
    case 0:
      amount = 1
      break;
    default:
      throw new CardParsingError(`I don't understand \`${string}\``)
  }
  if (!ops.has(op)) throw new CardParsingError(`'${op}' is not a valid command. Try \`:c help\``)
  opHandler = ops.get(op)
  if (isNaN(parseInt(amount))) throw new CardParsingError(`'${amount}' is not a valid amount`)
  if (ops.has(pack)) throw new CardParsingError(`${pack} is not a valid deck name`)
  amount = parseInt(amount)
  const result = opHandler(packs, pack, amount)
  return result
}

const handler = (params) => {
  try {
    return handleCardCommand(params)
  } catch (e) {
    console.log(`bad card command: '${params}' (${e.message})'`)
    return e.message
  }
}

module.exports = { handler, handleCardCommand }
