const Model = require('../models/model')
const multer = require('multer');
// Set up session middleware

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public'); // Store uploaded files in the uploads/ directory
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname); // Use the original filename of the uploaded file
        }
    })
});

function uploadMiddleware(req, res, next) {
    upload.single('file')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            res.status(500).send('Multer error')
        } else if (err) {
            // An unknown error occurred when uploading.
            console.error(err); // log the error message to the console
            res.status(500).send('Unknown error')
        } else {
            // File uploaded successfully.
            next()
        }
    })
}

function task_create_get(req, res) {
    res.render('register');
}
//////////////// สมัครสมาชิก
function Register(req, res) {
    uploadMiddleware(req, res, function () {
        if (!req.file) {
            res.status(400).send('No file uploaded');
        }
        const { filename } = req.file;
        const Email = req.body.Email
        const Password = req.body.Password
        const Phoneumber = req.body.Phoneumber
        const Address = req.body.Address
        Model.Registeruser(Email, Password, Phoneumber, Address, filename, (result) => {
            console.log(result)
            res.redirect('/')
        })
    })
}

function get_login(req, res) {
    res.render("/")
}
function showinfo(req, res) {
    Model.getinfo((err, dataall) => {
        if (err) {
            console.log(err.message);
            res.status(500).send("Internal server error");
        } else {
            console.log(dataall);
            res.render("/Adminindex", { dataall });
        }
    });
};

function login(req, res) {
    const Email = req.body.Email;
    const Password = req.body.Password;
    Model.Login(Email, Password, (err, row) => {
        if (err) {
            console.log(err.message);
            res.status(500).send("Internal server error");
        } else if (!row) {
            console.log("Invalid email or password");
            res.status(401).send("Invalid email or password");
        } else {
            if (row.Status_ID == 0) {
                res.render("room", { roomId: req.params.room, id: row.User_ID });
            } else if (row.Status_ID == 1) {
                Model.getinfo((err, dataall) => {
                    if (err) {
                        console.log(err.message);
                        res.status(500).send("Internal server error");
                    } else {
                        res.render("page/Adminindex", { dataall });
                    }
                });
            }
        }
    });
}

function Deleteuser(req, res) {
    const id = req.params.id;
    Model.DeleteByid(id, () => {
        Model.getinfo((err, dataall) => {
            if (err) {
                console.log(err.message);
                res.status(500).send("Internal server error");
            } else {
                // console.log(dataall);
                res.render("page/Adminindex", { dataall });
            }
        });
    })

}


function Profileuser(req, res) {
    const id = req.params.id
    Model.getuserByid(id, (queryresult) => {
        console.log(queryresult)
        res.render("/_userheader", { queryresult })
    })
}

function Edituserbyid(req, res) {
    const Email = req.body.Email
    const Password = req.body.Password
    const Phonenumber = req.body.Phonenumber
    const Address = req.body.Address
    const id = req.params.id;
    console.log(Email,Password,Phonenumber,Address,id);
    Model.Edituser(Email, Password, Phonenumber, Address, id, () => {
        Model.getinfo((err, dataall) => {
            if (err) {
                console.log(err.message);
                res.status(500).send("Internal server error");
            } else {
                // console.log(dataall);
                res.render("page/Adminindex", { dataall });
            }
        });
    })

}
function task_update_get(request, response) {
    const id = request.params.id;
    console.log(id)
    Model.getuserByid(id, (result) => {
        if (result) {
            console.log(result);
            response.render('page/edituser', {result });
        } else {
            console.log('User not found');
        }
    });
};
function Logout(req, res) {
    req.session.destroy()
    res.redirect("/")
}
module.exports = {
    task_create_get,
    Register,
    get_login,
    login,
    Logout,
    showinfo,
    Deleteuser,
    task_update_get,
    Edituserbyid,
    Profileuser
}
////////// สร้างตัวแปร sql User
// const sql_crateuser = `CREATE TABLE IF NOT EXISTS User (
//     User_ID INTEGER PRIMARY KEY AUTOINCREMENT,
//     Email VARCHAR(255) NOT NULL,
//     Password VARCHAR(255) NOT NULL,
//     Phonenumber VARCHAR(10),
//     Address VARCHAR(255),
//     image_user VARCHAR(255),
//     Status_ID int(11)
// );`
// const sql_status = `CREATE TABLE IF NOT EXISTS Status (
//     Status_ID INTEGER PRIMARY KEY AUTOINCREMENT,
//     Status_name VARCHAR(255) NOT NULL
// );`
// //////////////////// Upadate ////////////////////////////////////////
// const updatestatus = `UPDATE User SET Status_ID = 1 WHERE User_ID = 2 `
// db.run(updatestatus, err => {
//     if (err) {
//         return console.error(err.message);
//     }
//     console.log("update สำเร็จ");
// })
// //////////////////////////////////////////////////////////////////////
// ///////// execut ตัวแปร sql status
// db.run(sql_status, err => {
//     if (err) {
//         return console.error(err.message);
//     }
//     console.log("สร้าง database status สำเร็จ");

//     const sql_insertStatus = `INSERT INTO Status(Status_ID,Status_name) VALUES
//     (1,'user'),(2,"Admin"),(3,"SuperAdmin")`;
//     db.run(sql_insertStatus, err => {
//         if (err) {
//             return console.error(err.message)
//         }
//         console.log("เพิ่มข้อมูล Status สำเร็จ")
//     })
// })
