const Record = require('../Record') // 載入 Record model

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})

const object = []
for (let i = 0; i < 10; i++) {
  object[i] = {}
  object[i].id = i + 1
  object[i].name = '吃飯'
  object[i].category = '餐飲食品'
  object[i].date = '2020-10-30'
  object[i].amount = ((i + 1) * 10)
  object[i].totalAmount = 100
}

db.once('open', () => {
  Record.create(object)
    .then(() => {
      console.log('insert customer done...!')
      return db.close()
    }).then(() => {
      console.log('database connection close...!')
    })
  console.log('done')
})
