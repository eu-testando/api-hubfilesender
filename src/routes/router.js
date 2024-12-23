const router = require("express").Router();


const fileRouter = require('./file');
const tbRouter = require('./typebot');

router.use("/",fileRouter);
router.use("/",tbRouter);

module.exports = router;