const pieces = require('../common/pieces')
const { playingCardSuits, playingCardFaces } = require('../common/constants')

const OP_FLIP = module.exports.OP_FLIP = Symbol()

const getPack = (packs, packName) => {
  if (!packs.has(packName)) packs.set(packName, pieces.playingCardPack())
  return packs.get(packName)
}

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

const draw = (packs, packName, amount) => {
  let draws = []
  let pack = getPack(packs, packName)
  for (let i = 0; i < amount; ++i) draws.push(pieces.playingCards(pack).result)
  return `drew ${draws.map(formatCard).join(',')} from **${packName}** ::: ${pack.stock.length} remaining in deck`
}

const list = (packs) => `decks in play: **${[...packs.keys()].join(', ')}**`

const removePack = (packs, packName) => {
  if (packName === 'channel') return ' cannot remove default channel deck'
  if (packs.has(packName)) {
    packs.delete(packName)
    return `removed deck **'${packName}'** from play`
  } else return ` no deck named **'${packName}'**`
}

const shufflePack = (packs, packName) => {
  const pack = getPack(packs, packName)
  pieces.shuffleDeck(pack)
  return `shuffled deck **${packName}**`
}

module.exports.map = new Map([
  [OP_FLIP, draw],
  ['shuffle', shufflePack],
  ['remove', removePack],
  ['list', list]
])
