const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const schema = new mongoose.Schema({
  result: {
    type: Object,
    required: true
  }
})

schema.set('toJSON', {virtuals: true})
schema.set('toObject', {virtuals: true})

module.exports = mongoose.model('Lookup', schema)
