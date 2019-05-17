const { polyhedral, fate, coin, playingCards, shuffleDeck, playingCardPack } = require('../../../lib/common/pieces')
const { checkPolyhedral, checkFate, checkCoin, checkPlayingCard, checkPlayingCards } = require('../helpers')

describe('the dice::pieces module', () => {
  describe('polyhedral', () => {
    it('should generate a polyhedral die with its size & result', () => {
      for (let size = 1; size <= 20; ++size)
        for (let i = 0; i < 20; ++i)
          checkPolyhedral(polyhedral(size), size)
    })
  })
  describe('fate', () => {
    it('should generate a fate die with its size & result', () => {
      for (let i = 0; i < 20; ++i)
        checkFate(fate())
    })
  })
  describe('coin', () => {
    it('should generate a coin toss with its size & result', () => {
      for (let i = 0; i < 20; ++i)
        checkCoin(coin())
    })
  })
  describe('makePlayingCardPack', () => {
    it('should generate a playing card pack', () => {
      const pack = playingCardPack()
      checkPlayingCards(pack)
    })
  })
  describe('shuffleDeck', () => {
    it('should shuffle a deck', () => {
      const pack = playingCardPack()
      pack.muck = [...pack.muck, ...pack.stock]
      const oldOrder = [...pack.stock]
      pack.stock = []
      shuffleDeck(pack)
      pack.stock.length.should.eql(54)
      pack.muck.length.should.eql(0)
      let matches = 0
      for (let i = 0; i < 54; ++i) if (pack.stock[i] === oldOrder[i]) matches += 1
      matches.should.be.lessThan(54)
    })
  })
  describe('playingCards', () => {
    const draw = playingCards()
    let stockCount = 53, muckCount = 1
    it('should generate a playing card pack and draw a card', () => {
      checkPlayingCards(draw.pack)
      checkPlayingCard(draw.result)
      draw.pack.stock.length.should.eql(stockCount)
      draw.pack.muck.length.should.eql(muckCount)
    })
    it('should continue drawing cards from the same pack', () => {
      for (let i = 0; i < 53; ++i) {
        let next = playingCards(draw.pack)
        checkPlayingCard(next.result)
        draw.pack.stock.length.should.eql(--stockCount)
        draw.pack.muck.length.should.eql(++muckCount)
      }
    })
    it('should shuffle the deck and draw a new card when empty', () => {
      playingCards(draw.pack)
      draw.pack.stock.length.should.eql(53)
      draw.pack.muck.length.should.eql(1)
    })
  })
})
