const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await database("users").where({ username }).first();

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        res.status(200).json({ id: user.id, message: "Login successful" });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
