// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// 引用 restaurantList model
const Record = require('../../models/Record')

router.get('/', (req, res) => {
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

// 匯出路由模組
module.exports = router
