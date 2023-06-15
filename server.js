const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;
const db = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "mz",
    password: "4321",
    database: "smartbrain",
  },
});

app.use(bodyParser.json());
app.use(cors());

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name) return res.json({ message: "Each space required" });

  db("users")
    .returning("*")
    .insert({
      email,
      name,
      joined: new Date(),
    })
    .then((response) => res.json(response[0]))
    .catch((error) => res.status(400).json({ message: "Enable to join" }));
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((response) => {
      if (response.length) {
        res.json(response[0]);
      } else {
        res.status(400).json({ message: "User not found" });
      }
    })
    .catch((error) => res.status(400).json({ message: "Error getting user" }));
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: "ID is required" });

  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => console.log(entries));
});

app.get("/", (req, res) => res.send("SERVER IS WORKING"));

app.listen(PORT, () => {
  console.log("Sever is running on port " + PORT);
});
