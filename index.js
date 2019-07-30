const Discord = require('discord.js')
const client = new Discord.Client()
const commands = require('./lib/commands')

client.once('ready', () => {
  console.log('Ready!')
  console.log(`Add me at https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8192`)
  Promise.all([...client.guilds.values()].map(guild => {
    if (guild.systemChannel) return guild.systemChannel.send('I\'m ready to roll! try `/clattr help` for usage.')
    return Promise.resolve()
  }))
})

client.on('message', async (message) => {
  const response = commands.handle(message)
  if (response) {
    try {
      if (message.channel.type !== 'dm') await message.delete()
    } catch (e) {
      console.error('could not delete message:', e.message)
    } try {
      let dm
      switch (response.target) {
        case 'channel':
          await message.channel.send(`<@${message.author.id}> ${response.body}`)
          break;
        case 'dm':
          if (message.channel.type !== 'dm') await message.channel.send(`<@${message.author.id}> I sent you a DM ::: *${response.command} ${response.params}*.`)
          dm = await message.author.createDM()
          await dm.send(`${response.body}`)
          break;
      }
    } catch (e) {
      console.error('could not send message:', e)
    }
  }
})

client.login(process.env.DISCORD_TOKEN)
