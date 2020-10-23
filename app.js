const express = require('express')
const app = express()

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

const exphbs = require('express-handlebars')
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

const Record = require('./models/Record') // 載入 Todo model

const bodyParser = require('body-parser')// 引用 body-parser
app.use(bodyParser.urlencoded({ extended: true }))// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理

// setting static files
app.use('/css', express.static('css'))
app.use('/webfonts', express.static('/webfonts'))

const port = 3000
// ----------------set environment-------------------- //
// global variable//
app.get('/', (req, res) => {
  // 將資料傳給 index 樣板
  Record.find({}) // 取出 Todo model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列 const totalprice = Records[0].totalAmount
    .then(Records => {
      Record.find({}) // 取出 Todo model 裡的所有資料
        .sort({ _id: -1 })
        .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列 const totalprice = Records[0].totalAmount
        .then(Records => {
          const totalprice = Records[0].totalAmount
          return totalprice
        })
        .then(totalprice => res.render('index', { Records, totalprice })
        )
    })// 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})

app.get('/records/new', (req, res) => {
  return res.render('new')
})

app.post('/records', (req, res) => {
  const name = req.body.name// 從 req.body 拿出表單裡的 name 資料
  const category = req.body.category// 從 req.body 拿出表單裡的 name 資料
  const date = req.body.date// 從 req.body 拿出表單裡的 name 資料
  const amount = req.body.amount// 從 req.body 拿出表單裡的 name 資料
  console.log(req.body)
  return Record.create({ name, category, date, amount })// 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

app.listen(port, () => {
  console.log(`the server is running in port:${port}`)
})
