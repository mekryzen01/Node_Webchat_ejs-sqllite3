const controller = require('../controllers/controller')
const express = require("express")
const router = express.Router()
router.get("/", (req, res) => {
    res.render('page/login');
})
router.get("/register", (req, res) => {
    res.render("page/register")
})
router.get("/room/:room", (req, res) => {
    res.render("room", { roomId: req.params.room });
});

router.get('/logout', controller.Logout);
router.get("/", controller.get_login)
router.post("/", controller.login)
router.get('/register', controller.task_create_get)
router.post('/register', controller.Register)
router.get("/Adminindex", controller.showinfo)
router.post("/delete/:id", controller.Deleteuser)
router.get("/edituser/:id", controller.task_update_get)
router.post("/edituser/:id", controller.Edituserbyid)
router.get("/profile/:id", controller.task_update_get)

// Export router
module.exports = router