const pieces = require('../common/pieces')
const { playingCardSuits, playingCardFaces } = require('../common/constants')

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

const list = (packs) => `decks in play: **${[...packs.keys()].join(',')}**`

const removePack = (packs, packName) => {
  console.log('removing pack', packName)
  if (packs.has(packName)) {
    packs.delete(packName)
    return `removed '${packName}' from play`
  } else return ` no pack named '${packName}'`
}

const shufflePack = (packs, packName) => {
  const pack = getPack(packs, packName)
  pieces.shuffleDeck(pack)
  return `shuffled deck **${packName}**`
}

const help = () => {
  return `Valid commands are: \`\`\`
:c                        draw 1 card
:c <deck>                 draw 1 card from the deck named <deck>
:c <number>               draw <number> cards from the channel deck
:c <number> <deck>        draw <number> cards from the deck named <deck> 
:c shuffle                shuffle the channel deck
:c shuffle <deck>         shuffle the deck named <deck>
:c remove <deck>          remove the deck named <deck> from play
:c list                   list all decks in play
\`\`\`

A pack is automatically shuffled when the deck is empty.
`
}

module.exports = new Map([
  ['draw', draw],
  ['shuffle', shufflePack],
  ['help', help],
  ['remove', removePack],
  ['list', list]
])