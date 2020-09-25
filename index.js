// -- Module

const schedule = require('node-schedule')
const socketio = require('socket.io')
const path = require('path').resolve
const fetch = require('node-fetch')
const {renderFile} = require('ejs')
const express = require('express')
const chalk = require('chalk')
const http = require('http')
const knex = require('knex')
const app = express()

// -- coustom module & Service start

const remove = require('./modules/remove.js')
const create = require('./modules/create.js')
const retoken = require('./modules/gettoken.js')
const check = require('./modules/check.js')
const settings = require('./settings.js')
const srv = http.createServer(app)
const socket = socketio(srv)
const db = knex({
  client: 'mysql',
  connection: {
    user: settings.username,
    password: settings.password,
    host: 'localhost',
    database: 'shelter',
    port: 3306
  }
})

// -- ws

socket.on('connection', (session) => {
  session.on('search', async (searchdata) => {
    let response = await fetch('https://rest.shelter.id/v1.0/shelters?type=search&keyword='+ encodeURIComponent(searchdata)+'&page=1&size=100', { method: 'get'})
    if(response.status === 204) return session.emit('result', await false)
    let json = await response.json()
    session.emit('result', await json)
  })
})

// -- express setting

app.use('/src', express.static(path() + '/src'))
app.use('/api', express.urlencoded({ extended: true }))
app.use('/api2', express.urlencoded({ extended: true }))

// -- ejs render, send

app.get('/', (req, res) => {
  renderFile(path() + '/page/index.ejs', (err, str) => {
    if (err) return
    res.send(str)
  })
})

app.get('/remove', (req, res) => {
  renderFile(path() + '/page/remove.ejs', (err, str) => {
    if (err) return
    res.send(str)
  })
})

// -- api

app.post('/api', async (req, res) => {
  const { email, passwd, tag, send } = req.body
  create(email, passwd, tag, send, db).then( async (result) => {
    res.send(await result)
  })
})

app.post('/api2', async (req, res) => {
  const { email, passwd } = req.body
  remove(email, passwd, db).then( async (result) => {
    res.send(await result)
  })
})

// -- port open

srv.listen(settings.port, () => {
  console.log(chalk.green('Server Online : localhost:' + settings.port))
})

// -- schedule

schedule.scheduleJob('55 23 * * *', async function retokens() {
  await retoken(db)
})

schedule.scheduleJob('1 0 * * *', async function checks() {
  await check(db)
})
