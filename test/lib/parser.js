const parser = require('../../lib/parser')

describe('the parser module', () => {
  describe('takeNext', () => {
    it('should take the next character from a list', () => {
      const [matched, remaining] = parser.takeNext('abc', 'acbd')
      matched.should.eql('a')
      remaining.should.eql('bc')
    })
    it('should take nothing on a non-match', () => {
      const [matched, remaining] = parser.takeNext('abc', 'cbd')
      matched.should.eql(false)
      remaining.should.eql('abc')
    })
  })
  describe('parse', () => {
    it('should match until it reaches a non-matching character', () => {
      const [matched, remaining] = parser.parse('abcdef', 'bca')
      matched.should.eql('abc')
      remaining.should.eql('def')
    })
    it('should handle a string with no matches', () => {
      const [matched, remaining] = parser.parse('abcdef', 'ghi')
      matched.should.eql(false)
      remaining.should.eql('abcdef')
    })
    it('should handle a fully-matched string', () => {
      const [matched, remaining] = parser.parse('abcabcabc', 'cba')
      matched.should.eql('abcabcabc')
      remaining.should.eql(false)
    })
  })

  describe('exclude', () => {
    it('should match until it reaches an excluded character', () => {
      const [matched, remaining] = parser.exclude('abcdef', 'edf')
      matched.should.eql('abc')
      remaining.should.eql('def')
    })
    it('should handle a string with no matches', () => {
      const [matched, remaining] = parser.exclude('abcdef', 'cba')
      matched.should.eql(false)
      remaining.should.eql('abcdef')
    })
    it('should handle a fully-matched string', () => {
      const [matched, remaining] = parser.exclude('abcabcabc', 'ghi')
      matched.should.eql('abcabcabc')
      remaining.should.eql(false)
    })
  })

  describe('takeInteger', () => {
    it('should take an integer', () => {
      const [matched, remaining] = parser.takeInteger('134abc')
      matched.should.eql(134)
      remaining.should.eql('abc')
    })
    it('should not match if there is no leading integer', () => {
      const [matched, remaining] = parser.takeInteger('abc134')
      matched.should.eql(false)
      remaining.should.eql('abc134')
    })
    it('should handle a string that is only an integer', () => {
      const [matched, remaining] = parser.takeInteger('1234567890')
      matched.should.eql(1234567890)
      remaining.should.eql(false)
    })
    it('should handle leading zeroes', () => {
      const [matched, remaining] = parser.takeInteger('00001234567890')
      matched.should.eql(1234567890)
      remaining.should.eql(false)
    })
    it('should handle signed positive numbers', () => {
      const [matched, remaining] = parser.takeInteger('+00001234567890')
      matched.should.eql(1234567890)
      remaining.should.eql(false)
    })
    it('should handle signed negative numbers', () => {
      const [matched, remaining] = parser.takeInteger('-00001234567890')
      matched.should.eql(-1234567890)
      remaining.should.eql(false)
    })
    it('should not match a sign in the middle of a number', () => {
      const [matched, remaining] = parser.takeInteger('+123-4567890')
      matched.should.eql(123)
      remaining.should.eql('-4567890')
      const [matched2, remaining2] = parser.takeInteger('-1234567+890')
      matched2.should.eql(-1234567)
      remaining2.should.eql('+890')
    })
  })
})
