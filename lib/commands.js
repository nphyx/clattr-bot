const dice = require('./dice')
const parser = require('./parser')
/**
 * Map of possible commands and associated handlers.
 */
const commands = new Map([
  [':r', dice.handler]
])

const commandSearch = ':r '

/**
 * Looks up a command in the command Map.
 * @param {string} content message content
 */
function handle(message) {
  const { content } = message
  try {
    const [command, params] = parser.parse(content, commandSearch)
    if (!command) return false
    const handler = commands.get(command.trim())
    if (handler) return `<@${message.author.id}>  ${handler(params)}`
    return false
  } catch (e) {
    console.error(e.message, content)
  }
}

module.exports = { handle }
