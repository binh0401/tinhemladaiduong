const _ = require('lodash')

const getInfoData = ({fields = [], object = {}}) => {
    return _.pick(object, fields)
}

const convertSelectData = (select = []) => {
  return Object.fromEntries(select.map(e => [e, 1]))
}

const convertUnselectData = (select = []) => {
  return Object.fromEntries(select.map(e => [e, 0]))
}

const removeUndefinedObjects = obj => {
  
}

module.exports = {
  getInfoData,
  convertSelectData,
  convertUnselectData
}