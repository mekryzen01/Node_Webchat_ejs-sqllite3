const db = require('../data/database')

const Registeruser = (Email, Password, Phoneumber, Address, filename, callback) => {
    const sql = `INSERT INTO User (Email, Password, Phonenumber, Address, image_user, Status_ID) VALUES ('${Email}', '${Password}', '${Phoneumber}', '${Address}', '${filename}', 0)`;
    db.appdb.run(sql, [], (error, row) => {
        if (error) {
            callback(error.message);
        } else {
            const successMessage = "successfully."
            callback(successMessage);
        }
    });
};

const Edituser = (id, Email, Password, Phonenumber, Address, callback) => {
    const sql = `UPDATE User SET Email='${Email}', Password='${Password}', Phonenumber='${Phonenumber}', Address='${Address}' WHERE (User_ID='${id}')`;
    db.appdb.run(sql, [], (error, row) => {
        if (error) {
            console.log(row,"erorr")
            callback(error.message);
        } else {
            console.log(row,"Success")
            const successMessage = "successfully."
            callback(successMessage);
        }
    });
};

const Login = (Email, Password, callback) => {
    const sql = `SELECT * FROM User WHERE Email = '${Email}' AND Password = '${Password}'`
    db.appdb.get(sql, [], (err, row) => {
        if (err) {
            callback(err)
        } else if (!row) {
            callback(new Error("Invalid email or password"))
        } else {
            callback(null, row)
        }
    })
}
const DeleteByid = (id, callback) => {
    const sql = `DELETE FROM User WHERE User_ID = '${id}' `
    db.appdb.run(sql, [], (error, rows) => {
        if (error) {
            callback(error.message)
        }
        const successMessage = "successfully deleted."
        callback(successMessage);
    })
}

const getinfo = (callback) => {
    const sql = `SELECT * FROM User`
    db.appdb.all(sql, [], (error, rows) => {
        if (error) {
            callback(error)
        } else if (!rows) {
            callback(new Error("Invalid data"))
        } else {
            callback(null, rows)
        }
    });
};
const getTask = (id, callback) => {
    const sql = `SELECT * FROM User WHERE User_ID = ${id}`;
    db.appdb.get(sql, [], (error, row) => {
        if (error) {
            callback(error.message);
        }
        callback(row);
    });
};

module.exports = {
    Registeruser,
    Login,
    getinfo,
    DeleteByid,
    getTask,
    Edituser
}
