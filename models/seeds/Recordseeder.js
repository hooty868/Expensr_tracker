const Record = require('../Record') // 載入 Record model

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  for (let i = 1; i < 11; i++) {
    Record.create({ id: i, name: '吃飯', category: '餐飲食品', amount: i * 10, totalAmount: 0 })
  }
  console.log('done')
})
