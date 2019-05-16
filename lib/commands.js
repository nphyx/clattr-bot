const dice = require('./dice')
const cards = require('./cards')
const parser = require('./parser')
/**
 * Map of possible commands and associated handlers.
 */
const commands = new Map([
  [':r', dice.handler],
  [':c', cards.handler]
])

// const commandSearch = ':rc '

/**
 * Looks up a command in the command Map.
 * @param {string} content message content
 */
function handle(message) {
  const { content, author, guild } = message
  const guildId = guild ? guild.id : `dm-${message.author.id}`
  try {
    const [command, params] = parser.exclude(content, ' ')
    if (!commands.has(command)) return false
    const handler = commands.get(command.trim())
    if (handler) return `<@${message.author.id}>  ${handler(params.trim(), author, guildId)}`
    return false
  } catch (e) {
    console.error(e.message, content)
  }
}

module.exports = { handle }
