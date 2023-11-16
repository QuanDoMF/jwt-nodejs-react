import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import initApiRoutes from "./routes/api";
import configCors from "./config/cors";
require("dotenv").config();
import bodyParser from "body-parser";
import connection from "./config/connectDB";

const app = express();
const PORT = process.env.PORT || 8080;

//config cors (cors để khi kết nối từ fe -> be mà khác cổng local host để tránh bị ăn cắp cookie)
configCors(app);
// config view engine
configViewEngine(app);
//config body parse
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// init web routes
initWebRoutes(app);
initApiRoutes(app);
app.listen(PORT, () => {
  console.log("===>>", "running on the port = " + PORT);
});
