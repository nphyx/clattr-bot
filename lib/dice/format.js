const types = require('./types')
const { fateDiceUnicode } = require('./maps')

const formatDie = (die) => {
  switch (die.type) {
    case types.KEPT:
      return `**${die.result}**`
    case types.EXPLODED:
      return `${die.result}:boom:`
    case types.FATE_DIE:
      return `${fateDiceUnicode.get(die.result)}`
    case types.DIE:
    default:
      return `${die.result}`
  }
}

const formatPoolDie = (target) => (die) => {
  if (target && die.result >= target) return `**${formatDie(die)}**`
  else return formatDie(die)
}

const formatMod = (mod) => {
  return `${(mod.result > 0 ? ' + ' : '')}${mod.result}`
}

const filterType = (type) => (obj) => obj.type === type

const onlyDiceGroups = (set) => ([
  ...set.groups.filter(filterType(types.GROUP)),
  ...set.groups.filter(filterType(types.FATE_POOL)),
  ...set.groups.filter(filterType(types.POOL))
])

const onlyModifiers = (set) => set.groups.filter(filterType(types.MOD))

const formatGroupDice = (group) => {
  switch (group.type) {
    case types.GROUP:
      return `${group.string} [ ${group.dice.map(formatDie).join(', ')} ]`
    case types.FATE_POOL:
      return `${group.dice.length} [ ${group.dice.map(formatDie).join(', ')} ]`
    case types.POOL:
      return `${group.dice[0].size} [ ${group.dice.map(formatPoolDie(group.target)).join(', ')} ]`
  }
}

const formatGroupMods = (group) => {
  switch (group.type) {
    case types.MOD:
      return formatMod(group)
  }
}

const formatComment = (comment) => comment ? `**${comment}**: ` : ''

const formatSetGroups = (set) => {
  return `( \u2684 ${onlyDiceGroups(set).map(formatGroupDice).join(' + ')}${set.groups.map(formatGroupMods).join('')} = ${set.result} )`
}

const formatSetResult = (set) => {
  return `${formatComment(set.comment)}**\`${set.result}\`**`
}

const formatRoll = (roll) => {
  return `${roll.sets.map(formatSetResult).join(', ')}  :::  ${roll.sets.map(formatSetGroups).join('  :  ')}`
}

module.exports = {
  formatDie,
  formatGroupDice,
  formatSetGroups,
  formatPoolDie,
  formatRoll
}
