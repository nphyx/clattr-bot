module.exports.MAX_EXPLOSIONS = 5
module.exports.MAX_RULES = 5

module.exports.pieceTypes = Object.freeze({
  POLY: Symbol(),
  MOD: Symbol(),
  FATE: Symbol(),
  COIN: Symbol(),
  PLAYING_CARDS: Symbol()
})

module.exports.pieceMarkers = Object.freeze({
  EXPLODED: Symbol(),
  KEPT: Symbol(),
  HIT: Symbol()
})

module.exports.ruleTypes = Object.freeze({
  KEEP_HIGH: Symbol(),
  KEEP_LOW: Symbol(),
  EXPLODE: Symbol(),
  EXPLODE_LIMIT: Symbol()
})

module.exports.combinatorTypes = Object.freeze({
  MULTIPLY: Symbol(),
  DIVIDE: Symbol(),
  ADD: Symbol(),
  SUB: Symbol(),
  COMMENT: Symbol()
})

module.exports.rollTypes = Object.freeze({
  MOD: Symbol(),
  SUM: Symbol(),
  POOL: Symbol(),
  FATE: Symbol(),
  COIN_TOSS: Symbol()
})

module.exports.playingCardFaces = Object.freeze({
  ACE: Symbol(),
  JACK: Symbol(),
  QUEEN: Symbol(),
  KING: Symbol(),
  JOKER: Symbol()
})

module.exports.playingCardSuits = Object.freeze({
  HEARTS: Symbol(),
  DIAMONDS: Symbol(),
  SPADES: Symbol(),
  CLUBS: Symbol()
})
