const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./system/db/cashier.db')
module.exports = db
