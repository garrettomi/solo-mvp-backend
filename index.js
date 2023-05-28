const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 9000;
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);
const pokemonService = require("./utilities/pokemonService");
const userRoutes = require("./routes/userRoutes");
const gameRoutes = require("./routes/gameRoutes");
const loginRoutes = require("./routes/loginRoutes");
const signUpRoutes = require("./routes/signUpRoutes");

dotenv.config();

//MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Pokemon API");
});

//ROUTES
app.use("/users", userRoutes);
app.use("/games", gameRoutes);
app.use("/login", loginRoutes);
app.use("/signup", signUpRoutes);

app.listen(port, () => console.log(`listening on port: ${port}`));

//FETCHED FROM POKEAPI
app.get("/pokemon", async (req, res) => {
  try {
    await pokemonService.storePokemonData();
    const pokemon = await database("pokemon").select();
    res.status(200).json({ data: pokemon });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// app.get("/pokemon/:idOrName", async (req, res) => {
//   const { idOrName } = req.params;

//   try {
//     const pokemon = await database("pokemon")
//       .where("id", idOrName)
//       .orWhere("name", idOrName)
//       .first();

//     if (pokemon) {
//       res.status(200).json({ data: pokemon });
//     } else {
//       res.status(404).json({ message: "Pokemon not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ error });
//   }
// });

//FETCH FOR FRONTEND LOGIC
app.get("/poketype/:name", async (req, res) => {
  try {
    const pokemon = await database("pokemon")
      .where({ name: req.params.name })
      .first();
    if (!pokemon) throw new Error("Pokemon not found");
    res.status(200).json({ name: pokemon.name, img_url: pokemon.img_url });
  } catch (error) {
    res.status(500).json({ error });
  }
});
