// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// 引入 home 模組程式碼
const home = require('./modules/home')// 將網址結構符合 / 字串的 request 導向 home 模組
router.use('/', home)

// 引入 recordsList 模組程式碼
const recordsList = require('./modules/records')// 將網址結構符合 /restaurents 字串開頭的 request 導向 restaurents 模組
router.use('/records', recordsList)

// 匯出路由器
module.exports = router
