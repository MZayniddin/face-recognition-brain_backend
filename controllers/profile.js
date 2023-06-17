const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  if (!id) return res.status(400).json("ID required");

  db.select("*")
    .from("users")
    .where("id", "=", id)
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch((err) => console.log(err));
};

module.exports = {
  handleProfileGet,
};
