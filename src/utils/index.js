const _ = require('lodash')

const getInfoData = ({fields = [], object = {}}) => {
    return _.pick(object, fields)
}

const convertSelectData = (select = []) => {
  return Object.fromEntries(select.map(e => [e, 1]))
}

module.exports = {
  getInfoData,
  convertSelectData
}