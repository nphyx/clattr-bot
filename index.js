const Discord = require('discord.js')
const client = new Discord.Client()
const commands = require('./lib/commands')

client.once('ready', () => {
  console.log('Ready!')
})

client.on('message', (message) => {
  const response = commands.handle(message)
  if (response) message.channel.send(response)
    .then(() => message.delete())
    .catch((e) => console.log(e))
})

client.login(process.env.DISCORD_TOKEN)
