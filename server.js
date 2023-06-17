require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const PORT = process.env.PORT || 3000;
const app = express();

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = require("knex")({
  client: "pg",
  connection: {
    host: "dpg-ci6ttmenqql0ldd6q3rg-a.oregon-postgres.render.com",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

app.use(cors());
app.use(express.json());

// ROUTES
app.get("/", (req, res) => res.send("SERVER IS WORKING"));
app.post("/signin", signin.handleSignin(db, bcrypt));
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db);
});
app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});
app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});
app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

// LISTENING PORT
app.listen(PORT, () => {
  console.log("Sever is running on port " + PORT);
});
