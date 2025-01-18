const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

const connectDataBase = require("./database/index.js");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const _dirname = path.dirname("");
const buildpath = path.join(_dirname, "../client/dist");

app.use(express.static(buildpath));

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;
connectDataBase().then(() => {
  app.listen(PORT, () => {
    console.log("http:localhost:4444");
  });
});

app.use("/", require("./routes/user.route.js"));
app.use("/", require("./routes/article.route.js"));
app.use("/", require("./routes/comment.route.js"));

module.exports = app;
