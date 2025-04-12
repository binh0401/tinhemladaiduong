'use strict'
import {Client, GatewayIntentBits} from 'discord.js'


// client.on('ready', () => {
//   console.log(`Logged in as ${client.user.tag}`)
// })

// 

// client.on('messageCreate', message => {
//   if(message.author.bot){
//     return
//   }
//   if(message.content === 'a thèm bú lồn quá'){
//     message.reply('Oke đi muốn bú lồn em nào')
//   }else{
//     message.reply("im con cụ mày mồm vào")
//   }
// })

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

    client.login("MTM2MDcwMDk5MDg5Mzk4MTcxOA.Gw_JwY.ZVCXlqXlqgxWEbDvgpFL86xgUoSiKuxgdUrVYc")
  }



}

export default new LoggerService()