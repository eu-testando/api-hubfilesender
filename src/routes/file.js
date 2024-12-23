

const fileController = require("../controllers/filesendingController");


const router = require("express").Router();



//Functions

router.route("/file/send").post((req ,res ) => fileController.sendMediaMessage(req, res));







module.exports = router;