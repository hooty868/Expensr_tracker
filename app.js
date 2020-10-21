const express = require('express')
const app = express()

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

const exphbs = require('express-handlebars')
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')


const port = 3000
// ----------------set environment-------------------- //
app.get('/', (req, res) => {
  res.render('index')
})

app.listen(port, () => {
  console.log(`the server is running in port:${port}`)
})
