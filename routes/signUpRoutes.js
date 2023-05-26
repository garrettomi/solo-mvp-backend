const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUser = await database("users").where({ username }).first();

    if (existingUser) {
      res.status(400).json({ message: "Username already exists" });
    } else {
      const user = await database("users")
        .insert({
          username,
          password: hashedPassword,
        })
        .returning("*");

      res.status(200).json({ data: user });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
