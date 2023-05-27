const express = require("express");
const router = express.Router();
const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

router.get("/", async (req, res) => {
  try {
    const games = await database("games").select(
      "id",
      "score",
      "created_at",
      "username"
    );
    res.status(200).json({ data: games });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const game = await database("games").where({ id: req.params.id }).first();
    if (!game) throw new Error("Game not found");
    res.status(200).json({ data: game });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post("/", async (req, res) => {
  try {
    const newGame = await database("games").insert(req.body).returning("*");
    res.status(200).json({ data: newGame });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const game = await database("games")
      .where({ id: req.params.id })
      .update(req.body)
      .returning("*");
    if (!game) throw new Error("Game not found");
    res.status(200).json({ data: game });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const game = await database("games").where({ id: req.params.id }).delete();
    if (!game) throw new Error("Game not found");
    res.status(200).json({ message: "Game deleted successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
