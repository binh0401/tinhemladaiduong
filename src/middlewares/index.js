'use strict'

import Logger from '../loggers/discord.log.js'


export const sendToDiscord = async (req,res,next) => {
  try {
    await Logger.sendToDiscord(req.get('host'))
    next()
  } catch (error) {
    next(error)
  }
}


