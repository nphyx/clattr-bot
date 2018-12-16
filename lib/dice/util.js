const sum = (p, c) => p + c

const sumResults = (resultSet) => resultSet.reduce((p, c) => p + c.result, 0)

module.exports = { sum, sumResults }
