import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
require("dotenv").config();
import bodyParser from "body-parser";
import connection from "./config/connectDB";

const app = express();
// config view engine
configViewEngine(app);
//config body parse
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// test connectionDB
connection();
// init web routes
initWebRoutes(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("===>>", "running on the port = " + PORT);
});
