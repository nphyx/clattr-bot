/**
 * @module roller::pieces
 *
 * A collection of different game pieces.
 */
const { pieceTypes, playingCardSuits, playingCardFaces } = require('./constants')
const MersenneTwister = require('mersenne-twister')
const generator = new MersenneTwister()

/**
 * Rolls a polyhedral die of the given size.
 * @param {int} size size of die to roll
 * @return {object} { size, type, result } the die and its roll
 */
module.exports.polyhedral = (size) => ({
  size,
  type: pieceTypes.POLY,
  marker: null,
  result: Math.ceil(generator.random() * size)
})

/**
 * Rolls a fate die.
 * @return {object} { size, type, result }
 */
module.exports.fate = () => ({
  size: 3,
  type: pieceTypes.FATE,
  marker: null,
  result: Math.floor(generator.random() * 3) - 1
})

/**
 * Flips a coin.
 * @return {object} { type, result }
 */
module.exports.coin = () => ({
  type: pieceTypes.COIN,
  marker: null,
  result: Math.round(generator.random())
})

/** PLAYING CARDS **/

const makeSuit = (suit) => {
  const { ACE, JACK, QUEEN, KING } = playingCardFaces
  return [2,3,4,5,6,7,8,9,10,JACK,QUEEN,KING,ACE].map(value => ({ suit, value }))
}

const makeJoker = () => ({ value: playingCardFaces.JOKER, suit: playingCardFaces.JOKER })

/**
 * A fisher-yates shuffle.
 */
const shuffle = (cards) => {
  let i = 0,
    j = 0,
    temp = null,
    shuffled = [...cards]

  for (i = shuffled.length - 1; i > 0; i -= 1) {
    j = Math.floor(generator.random() * (i + 1))
    temp = shuffled[i]
    shuffled[i] = shuffled[j]
    shuffled[j] = temp
  }

  return shuffled
}

module.exports.shuffleDeck = (pack) => {
  pack.stock = pack.stock.concat(pack.muck)
  pack.muck = []
  shuffle(pack.stock)
}

/**
 * Creates a pack of playing cards.
 */
const makePlayingCardPack = module.exports.playingCardPack = () => ({
  stock: shuffle([
    ...makeSuit(playingCardSuits.HEARTS),
    ...makeSuit(playingCardSuits.DIAMONDS),
    ...makeSuit(playingCardSuits.SPADES),
    ...makeSuit(playingCardSuits.CLUBS),
    makeJoker(),
    makeJoker()
  ]),
  muck: [
  ]
})

const drawCard = (stock) => stock.splice(Math.floor(generator.random() * stock.length), 1)[0]

/**
 * A draw from a playing card deck. Accepts a card pack as a parameter, or generates
 * a new pack if none is given.
 *
 * @param {PlayingCardPack} [pack] the pack to draw from, defaults to a new pack
 * @return {object} { pack, type, result }
 */
module.exports.playingCards = (pack = makePlayingCardPack()) => {
  if (pack.stock.length === 0) {
    pack.stock = shuffle(pack.muck)
    pack.muck = []
  }
  const result = drawCard(pack.stock)
  pack.muck.push(result)
  return {
    pack,
    type: pieceTypes.PLAYING_CARDS,
    result
  }
}
