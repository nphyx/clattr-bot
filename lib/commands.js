const dice = require('./dice')
const cards = require('./cards')
const parser = require('./parser')
const help = require('./help')

const targetChannel = (handler) => (command, author, guildId) => ({
  body: handler(command, author, guildId),
  target: 'channel'
})

/**
 * The long-form handler
 */
const clattr = {
  handler: (command, author, guildId) => {
    const [subcommand, rest] = parser.dropExclude(command, ' ')
    switch (subcommand) {
      case 'p':
      case 'priv':
      case 'private':
        return {
          ...clattr.handler(rest, author, guildId),
          target: 'dm'
        }
      case 'r':
      case 'roll':
        return { body: dice.handler(rest, author, guildId), target: 'channel' }
      case 'd':
      case 'draw':
        return { body: cards.handler(rest, author, guildId), target: 'channel' }
      case 'h':
      case 'help':
        return { body: help.handler(rest, author, guildId), target: 'dm' }
      default:
        return { body: `I don't understand \`${command}\` :(`, target: 'dm' }
    }
  }
}

/**
 * Map of possible commands and associated handlers.
 */
const commands = new Map([
  [':r', targetChannel(dice.handler)],
  [':c', targetChannel(cards.handler)],
  ['/clattr', clattr.handler]
])

/**
 * Looks up a command in the command Map.
 * @param {string} content message content
 */
function handle(message) {
  const { content, author, guild } = message
  const guildId = guild ? guild.id : `dm-${message.author.id}`
  try {
    const [command, params] = parser.dropExclude(content, ' ')
    if (!commands.has(command)) return false
    const handler = commands.get(command)
    if (handler) return { ...handler(params, author, guildId), command, params }
    return false
  } catch (e) {
    console.error(e.message, content)
  }
}

module.exports = { handle }
