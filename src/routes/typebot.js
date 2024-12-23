
const typebotController = require("../controllers/typebotController")

const router = require("express").Router();



//Functions
router.route("/typebot").post((req ,res ) => typebotController.startTypeBot(req, res));






module.exports = router;
