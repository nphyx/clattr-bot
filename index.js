const Discord = require('discord.js')
const client = new Discord.Client()
const commands = require('./lib/commands')

client.once('ready', () => {
  console.log('Ready!')
})

client.on('message', async (message) => {
  const response = commands.handle(message)
  if (response) {
    try {
      await message.delete()
    } catch (e) {
      console.error('could not delete message:', e.message)
    } try {
      await message.channel.send(response)
    } catch (e) {
      console.log('could not send message:', e)
    }
  }
})

client.login(process.env.DISCORD_TOKEN)
