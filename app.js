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

const routes = require('./routes')// 引用路由器
// 將 request 導入路由器
app.use(routes)

// ----------------set environment-------------------- //

app.listen(port, () => {
  console.log(`the server is running in port:${port}`)
})
