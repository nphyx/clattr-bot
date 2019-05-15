const { pieceTypes, playingCardFaces, playingCardSuits } = require('../../lib/common/constants')

const { JACK, KING, QUEEN, ACE, JOKER } = playingCardFaces
const { HEARTS, DIAMONDS, SPADES, CLUBS } = playingCardSuits
const validPlayingCardValues = [2,3,4,5,6,7,8,9,10,JACK,KING,QUEEN,ACE,JOKER]
const validPlayingCardSuits = [HEARTS,DIAMONDS,SPADES,CLUBS,JOKER]

module.exports.checkPolyhedral = (die, size) => {
  die.size.should.eql(size)
  die.type.should.eql(pieceTypes.POLY)
  die.result.should.be.lessThan(size + 1)
  die.result.should.be.greaterThan(0)
}

module.exports.checkFate = (die) => {
  die.type.should.eql(pieceTypes.FATE)
  ;[-1,0,1].includes(die.result).should.be.true()
}

module.exports.checkCoin = (coin) => {
  coin.type.should.eql(pieceTypes.COIN)
  ;[0,1].includes(coin.result).should.be.true()
}

const checkPlayingCard = module.exports.checkPlayingCard = (card) => {
  validPlayingCardValues.includes(card.value).should.be.true()
  validPlayingCardSuits.includes(card.suit).should.be.true()
}

module.exports.checkPlayingCards = (pack) => {
  pack.stock.should.be.an.Array()
  pack.muck.should.be.an.Array()
  ;(pack.stock.length + pack.muck.length).should.eql(54)
  pack.stock.forEach(checkPlayingCard)
  pack.muck.forEach(checkPlayingCard)
}
