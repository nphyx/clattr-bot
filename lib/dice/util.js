const { combinatorTypes } = require('./constants')
const sum = (p, c) => p + c

const sumResults = (resultSet) => resultSet.reduce((p, c) => p + c.result, 0)

/**
 * Applies the result of each group to the total in a simple left-to-right order
 * of operations.
 * @param {Array<RollGroup>} groups
 * @return {number} result
 */
const totalGroups = (groups) => {
  let total = 0
  const todo = [...groups]
  while (todo.length) {
    let next = todo.shift()
    switch (next.op) {
      case combinatorTypes.ADD:
        total += next.result
        break;
      case combinatorTypes.SUB:
        total -= next.result
        break;
      case combinatorTypes.MULTIPLY:
        total = total * next.result
        break;
      case combinatorTypes.DIVIDE:
        total = total / next.result
        break;
      default:
        break
    }
  }
  return total
}

module.exports = { sum, sumResults, totalGroups }
