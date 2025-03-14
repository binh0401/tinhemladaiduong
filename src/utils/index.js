const _ = require('lodash')

const getInfoData = ({fields = [], object = {}}) => {
    return _.pick(objects, fields)
}

module.exports = {
  getInfoData
}