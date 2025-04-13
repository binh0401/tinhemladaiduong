'use strict'
import {Client, GatewayIntentBits} from 'discord.js'

const DISCORD_TOKEN = process.env.DISCORD_TOKEN
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID
 
const msg_reply = ['mày sủa vừa vừa thôi', 'anh là máy chém bách khoa', 'địt cụ mày thằng hà nội 2', 'thằng khải', 'vãi lồn luôn', 'sv đàm', 'thuần bợ']

class LoggerService{
  constructor(){
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    })
    
    //channelId
    this.channel_id = DISCORD_CHANNEL_ID

    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user.tag}`)
    })

    this.client.login(DISCORD_TOKEN)

    this.client.on('messageCreate', (msg) => {
      if(msg.author.bot){
        return
      }
      const member = msg.guild.members.cache.get(msg.author.id)
      const nickname = member.nickname || msg.author.username
      
      if(msg.content.includes('hát')){
        msg.reply(`nần ná na na anh ${nickname} \n https://www.youtube.com/watch?v=iGxeKsT1rN0`)
      }else if(msg.content.includes('sex') || msg.content.includes('sếch')){
        msg.reply(`ok đi thèm bú lồn em nào, lên luôn này con vợ ${nickname} \n https://www.pornhub.com/`)
      }else{
        let index = Math.floor(Math.random() * msg_reply.length)
        msg.reply(` ${msg_reply[index]}.Im con cụ mày mồm vào thằng ${nickname}.`)
      }
    })
  }

  async sendToDiscord(message){
    const channel = await this.client.channels.fetch(this.channel_id)
    if(!channel){
      console.log('Cant find channel', this.channel_id)
      return
    }
    channel.send(message).then(() => console.log('message sent successfully')).catch(err => console.log(err))

  }

}

export default new LoggerService()