const types = require('../../../lib/dice/types')

const checkDie = (die, size) => {
  die.size.should.eql(size)
  die.type.should.eql(types.DIE)
  die.result.should.be.lessThan(size + 1)
  die.result.should.be.greaterThan(0)
}

module.exports = { checkDie }
