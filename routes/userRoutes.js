const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

router.get("/", async (req, res) => {
  try {
    const users = await database("users").select();
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await database("users").where({ id: req.params.id }).first();
    if (!user) throw new Error("User not found");
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await database("users")
      .insert({
        username,
        password: hashedPassword,
      })
      .returning("*");

    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const user = await database("users")
      .where({ id: req.params.id })
      .update(req.body)
      .returning("*");
    if (!user) throw new Error("User not found");
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await database("users").where({ id: req.params.id }).delete();
    if (!user) throw new Error("User not found");
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
