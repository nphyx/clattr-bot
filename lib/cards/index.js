const pieces = require('../common/pieces')
const ops = require('./operations')

const guildPacks = new Map([
])

function getGuildPacks(guildId) {
  if (!guildPacks.has(guildId)) guildPacks.set(guildId, new Map([['channel', pieces.playingCardPack()]]))
  return guildPacks.get(guildId)
}

function CardParsingError(message) {
  this.name = 'CardParsingError'
  this.message = message
}

CardParsingError.prototype = Error.prototype

const isNumeric = string => !isNaN(parseInt(string))

const handleCardCommand = (string, guildId) => {
  let op = ops.OP_FLIP, amount = 0, pack = 'channel'
  let opHandler = () => { throw new CardParsingError(`I don't understand \`${string}\``) }
  let parts = string ? string.trim().split(' ') : []
  switch (parts.length) {
    case 2:
      if (isNumeric(parts[0])) {
        amount = parseInt(parts[0])
        pack = parts[1]
      } else if (ops.map.has(parts[0])) [op, pack] = parts
      break;
    case 1:
      if (isNumeric(parts[0])) amount = parseInt(parts[0])
      else if (ops.map.has(parts[0])) op = parts[0]
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
  if (!ops.map.has(op)) throw new CardParsingError(`'${op}' is not a valid command. Try \`!c help\``)
  opHandler = ops.map.get(op)
  if (amount > 54) throw new CardParsingError('You may not draw more than 54 cards at a time')
  if (isNaN(parseInt(amount))) throw new CardParsingError(`'${amount}' is not a valid amount`)
  if (ops.map.has(pack)) throw new CardParsingError(`${pack} is not a valid deck name`)
  amount = parseInt(amount)
  const result = opHandler(getGuildPacks(guildId), pack, amount)
  return result
}

const handler = (params, author, guildId) => {
  try {
    return handleCardCommand(params, guildId)
  } catch (e) {
    console.log(`bad card command: '${params}' (${e.message})'`)
    return e.message
  }
}

module.exports = { handler, handleCardCommand }
