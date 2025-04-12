'use strict'

import apiKeyModel from '../models/apikey.model.js';

const findById = async(key) => {
  const objKey = await apiKeyModel.findOne({key, status: true}).lean()
  return objKey
}

export {
  findById
}