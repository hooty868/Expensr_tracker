// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// 引用 restaurantList model
const Record = require('../../models/Record')

router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/new', (req, res) => {
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
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then(Records => res.render('edit', { Records }))
    .catch(error => console.log(error))
})

router.post('/:id', (req, res) => {
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

router.post('/:id/delete', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then(Records => Records.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.get('/search', (req, res) => {
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

// 匯出路由模組
module.exports = router
