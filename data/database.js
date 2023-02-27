const sqlite3 = require("sqlite3").verbose()
const path = require("path")
const db_name = path.join(__dirname, "../data", "ProjectCIT3518.db")
const appdb = new sqlite3.Database(db_name, err => {
    if (err) {
        return console.error(err.message)
    }
    console.log("เชื่อมต่อ database สำเร็จ")
})
module.exports = {appdb}