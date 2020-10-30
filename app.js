const express = require('express')
const app = express()

const mongoose = require('mongoose')
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/expense-tracker'
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const exphbs = require('express-handlebars')
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

const Handlebars = require('handlebars')
Handlebars.registerHelper('switch', function (value, options) {
  this.switch_value = value
  return options.fn(this)
})
Handlebars.registerHelper('case', function (value, options) {
  if (value === this.switch_value) {
    return options.fn(this)
  }
})

const Record = require('./models/Record')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/css', express.static('css'))

const port = process.env.PORT || 3000
// ----------------set environment-------------------- //

app.get('/', (req, res) => {
  Record.find()
    .lean()
    .then(Records => {
      if (Records.length) {
        const totalAmount = Records.map(item => item.amount).reduce((a, b) => a + b)
        res.render('index', { Records, totalAmount })
      } else {
        res.render('index', { Records })
      }
    })
    .catch(error => console.error(error))
})

app.get('/records/new', (req, res) => {
  return res.render('new')
})

app.post('/records/new', (req, res) => {
  console.log(req.body)
  const name = req.body.name
  const category = req.body.category
  const date = req.body.date
  const amount = Number(req.body.amount)
  Record.countDocuments({ type: Number })
    .then(count => {
      const id = count + 1
      return id
    })
    .then(id =>
      Record.find()
        .lean()
        .then(Records => {
          if (Records.length) {
            const totalAmount = Records.map(item => item.amount).reduce((a, b) => a + b) + amount
            Record.create({ id, name, category, date, amount, totalAmount })
              .then(() => res.redirect('/'))
              .catch(error => console.log(error))
          } else {
            const totalAmount = 0
            Record.create({ id, name, category, date, amount, totalAmount })
              .then(() => res.redirect('/'))
              .catch(error => console.log(error))
          }
        }))
})

// view edit expense post template
app.get('/records/:id/edit', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then(Records => res.render('edit', { Records }))
    .catch(error => console.log(error))
})

app.post('/record/create', (req, res) => {
  console.log(req.body)
})

app.post('/records/:id', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  const category = req.body.category
  const date = req.body.date
  const amount = Number(req.body.amount)
  return Record.findById(id)
    .then(Records => {
      Records.name = name
      Records.category = category
      Records.date = date
      Records.amount = amount
      return Records.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.post('/records/:id/delete', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then(Records => Records.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.get('/records/search', (req, res) => {
  const keyword = req.query.keyword
  Record.find({ category: keyword })
    .lean()
    .then(Records => {
      if (Records.length) {
        const totalAmount = Records.map(item => item.amount).reduce((a, b) => a + b)
        res.render('index', { Records, totalAmount })
      } else {
        res.render('index', { Records })
      }
    })
    .catch(error => console.error(error))
})

app.listen(port, () => {
  console.log(`the server is running in port:${port}`)
})
