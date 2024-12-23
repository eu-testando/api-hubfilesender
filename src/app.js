require("dotenv").config();
const express = require("express");
const cors = require("cors");



const app = express();


app.use(cors());

app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({limit: '5mb'}));

app.use(express.json());

const routes = require("./routes/router");

app.use("/api", routes);

app.listen(3000, function () {
	console.log("Servidor Onine na porta:",3000);
});
