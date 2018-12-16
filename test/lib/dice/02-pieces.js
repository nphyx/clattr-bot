const { polyhedral, fate, coin, playingCards } = require('../../../lib/dice/pieces')
const { checkPolyhedral, checkFate, checkCoin, checkPlayingCard, checkPlayingCards } = require('./helpers')

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
