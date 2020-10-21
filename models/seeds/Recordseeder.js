const Record = require('../Record') // 載入 Record model

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  for (let i = 10; i < 100; i = i + 10) {
    Record.create({ name: '吃飯', category: '餐飲食品', amount: i })
  }
  console.log('done')
})
