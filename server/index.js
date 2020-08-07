'use strict'

import express from 'express'
import http from 'http'
import cors from 'cors'
import bodyParser from 'body-parser'
import 'dotenv/config.js'
import clients from './routes/clients.js'
import doctors from './routes/doctors.js'

const app = express()
const server = http.createServer(app)

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => { 
  next()
})

app.get('/user', (req, res) => {
  res.send('CONFIRM')
})

app.use('/doctors', doctors)
app.use('/clients', clients)

server.listen(process.env.PORT, () => {
  console.log('Example app listening on port 4000!')
})


