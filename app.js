const express = require('express')
const app = express()

const mongoose = require('mongoose')
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/todo-list'
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

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

const Record = require('./models/Record') // 載入 Todo model

const bodyParser = require('body-parser')// 引用 body-parser
app.use(bodyParser.urlencoded({ extended: true }))// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理

// setting static files
app.use('/css', express.static('css'))

const port = process.env.PORT || 3000
// ----------------set environment-------------------- //
// global variable//
app.get('/', (req, res) => {
  Record.find() // 取出 Record model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(Records => {
      if (Records.length) {
        const totalAmount = Records.map(item => item.amount).reduce((a, b) => a + b)
        res.render('index', { Records, totalAmount })
      } else {
        res.render('index', { Records })
      }
    })
    .catch(error => console.error(error)) // 錯誤處理
})

app.get('/records/new', (req, res) => {
  return res.render('new')
})

app.post('/records/new', (req, res) => {
  const name = req.body.name// 從 req.body 拿出表單裡的 name 資料
  const category = req.body.category// 從 req.body 拿出表單裡的 name 資料
  const date = req.body.date// 從 req.body 拿出表單裡的 name 資料
  const amount = Number(req.body.amount)// 從 req.body 拿出表單裡的 name 資料
  Record.countDocuments({ type: Number })
    .then(count => {
      const id = count + 1
      return id
    })
    .then(id =>
      Record.find() // 取出 Todo model 裡的所有資料
        .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列 const totalprice = Records[0].totalAmount
        .then(Records => {
          const totalAmount = Records.map(item => item.amount).reduce((a, b) => a + b) + amount
          Record.create({ id, name, category, date, amount, totalAmount })// 存入資料庫
            .then(() => res.redirect('/')) // 新增完成後導回首頁
            .catch(error => console.log(error))
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

app.post('/records/:id', (req, res) => {
  const id = req.params.id
  const name = req.body.name// 從 req.body 拿出表單裡的 name 資料
  const category = req.body.category// 從 req.body 拿出表單裡的 name 資料
  const date = req.body.date// 從 req.body 拿出表單裡的 name 資料
  const amount = Number(req.body.amount)// 從 req.body 拿出表單裡的 name 資料
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
  Record.find({ category: keyword }) // 取出 Todo model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列 const totalprice = Records[0].totalAmount
    .then(Records => {
      if (Records.length) {
        const totalAmount = Records.map(item => item.amount).reduce((a, b) => a + b)
        res.render('index', { Records, totalAmount })
      } else {
        res.render('index', { Records })
      }
    })
    .catch(error => console.error(error)) // 錯誤處理
})

app.listen(port, () => {
  console.log(`the server is running in port:${port}`)
})
