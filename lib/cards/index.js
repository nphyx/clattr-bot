const pieces = require('../common/pieces')
const { playingCardSuits, playingCardFaces } = require('../common/constants')

const cardSuits = new Map([
  [playingCardSuits.SPADES, '\u2660'],
  [playingCardSuits.HEARTS, '\u2665'],
  [playingCardSuits.DIAMONDS, '\u2666'],
  [playingCardSuits.CLUBS, '\u2663'],
  [playingCardFaces.JOKER, 'JOKER']
])

const cardValues = new Map([
  [2, '2'],
  [3, '3'],
  [4, '4'],
  [5, '5'],
  [6, '6'],
  [7, '7'],
  [8, '8'],
  [9, '9'],
  [10, '10'],
  [playingCardFaces.JACK, 'J'],
  [playingCardFaces.QUEEN, 'Q'],
  [playingCardFaces.KING, 'K'],
  [playingCardFaces.ACE, 'A'],
  [playingCardFaces.JOKER, '']
])

const formatCard = (card) => `**\`${cardValues.get(card.value)}${cardSuits.get(card.suit)}\`**`

const packs = new Map([
  ['default', pieces.playingCardPack()]
])

const getPack = (packName) => {
  if (!packs.has(packName)) packs.set(packName, pieces.playingCardPack())
  return packs.get(packName)
}

const draw = (packName, amount) => {
  let pack = getPack(packName)
  let draws = []
  for (let i = 0; i < amount; ++i) draws.push(pieces.playingCards(pack).result)
  return `drew ${amount}: ${draws.map(formatCard).join(',')} (${pack.stock.length} remaining in deck '${packName}')`
}

const shuffle = (packName) => {
  pieces.shuffleDeck(getPack(packName))
  return `shuffled ${packName} deck`
}

const ops = new Map([
  ['draw', draw],
  ['shuffle', shuffle]
])

function CardParsingError(message) {
  this.name = 'CardParsingError'
  this.message = message
}

CardParsingError.prototype = Error.prototype

const handleCardCommand = (string) => {
  let op = 'draw', amount = 0, pack = 'default'
  let opHandler = () => { throw new CardParsingError(`I don't understand \`${string}\``) }
  let parts = string.trim().split(' ')
  switch (parts.length) {
    case 3:
      [pack, op, amount] = parts
      break;
    case 2:
      [op, amount] = parts
      break;
    case 1:
      if (ops.has(parts[0])) op = parts[0]
      else amount = parts[0]
      break;
    case 0:
      amount = 1
      break;
    default:
      throw new CardParsingError(`I don't understand \`${string}\``)
  }
  if (!ops.has(op)) throw new CardParsingError(`'${op}' is not a valid command`)
  opHandler = ops.get(op)
  if (isNaN(parseInt(amount))) throw new CardParsingError(`'${amount}' is not a valid amount`)
  amount = parseInt(amount)
  const result = opHandler(pack, amount)
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
