const mongoose = require('mongoose')
const Schema = mongoose.Schema
const RecordSchema = new Schema({
  name: {
    type: String, // 資料型別是字串
    required: true // 這是個必填欄位
  },
  category: {
    type: String, // 資料型別是字串
    required: true // 這是個必填欄位
  },
  date: {
    type: String // 資料型別是字串
  },
  amount: {
    type: Number, // 資料型別是數字
    required: true // 這是個必填欄位
  },
  totalAmount: {
    type: Number // 資料型別是數字
  }
})
module.exports = mongoose.model('recordExpense', RecordSchema)
