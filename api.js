require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const async = require('async')
const axios = require('axios')

// Application constants
const app = express()
const PORT = process.env.PORT
const Lookup = require('./lib/lookup')

// Application middleware
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

// Mongo connection
let mongoOpts = {
  poolSize: Number(process.env.MONGO_POOLSIZE),
  useMongoClient: true
}
let mongoUri = `mongodb://${process.env.MONGO_HOST}/${process.env.MONGO_DB}`
mongoose.connect(mongoUri, mongoOpts)

// API call
app.get('/domains/:companies', (req, res) => {
  let queryString = req.params.companies
  let list = queryString.split(',').slice(0,26)
  async.map(list, fetchDomain, (err, result) => {
    if (err) {
      return res.status(500).send(err)
    }
    let lookup = new Lookup()
    lookup.result = result
    lookup.save()
    return res.status(200).json({
      data: result,
      length: result.length
    })
  })
})

async function fetchDomain (name) {
  let url = process.env.GOOGLE_API_URL
  let cx = process.env.GOOGLE_API_CX
  let key = process.env.GOOGLE_API_KEY
  let queryUrl = `${url}?cx=${cx}&key=${key}&q=${name}`
  let result = await axios(queryUrl)
  return {
    name,
    domain: result.data.items[0].displayLink
  }
}

// API call
app.get('/lookups', (req, res) => {
  Lookup.find()
  .then(lookups => {
    return res.status(200).json({
      data: lookups,
      length: lookups.length
    })
  })
})

// If Route not found, 404
app.all('*', (req, res) => {
  res.status(404).send('Not Found')
})

// Run service
app.listen(PORT, () => {
  console.log(`[${process.env.NODE_ENV}] Auth-Service ready on port ${PORT}`)
})
