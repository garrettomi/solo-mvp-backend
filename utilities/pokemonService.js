const axios = require("axios");
const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

async function fetchAllPokemon() {
  const limit = 500;
  let offset = 0;
  let allPokemon = [];

  while (true) {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );
    const pokemon = response.data.results;
    allPokemon.push(...pokemon);

    if (pokemon.length < limit) {
      break;
    }

    offset += limit;
  }

  return Promise.all(
    allPokemon.map(async (pkmn) => {
      const pokemonData = await axios.get(pkmn.url);
      return {
        name: pokemonData.data.name,
        img_url: pokemonData.data.sprites.front_default,
      };
    })
  );
}

async function storePokemonData() {
  const pokemonData = await fetchAllPokemon();
  for (const pokemon of pokemonData) {
    await database("pokemon").insert({
      name: pokemon.name,
      img_url: pokemon.img_url,
    });
  }
}

//POSSIBLY USE TO UPDATE POKEMON AUTOMATIA
// async function updatePokemonData() {
//   try {
//     await storePokemonData();
//     console.log("Pokemon data updated successfully.");
//   } catch (error) {
//     console.error("Error updating Pokemon data:", error);
//   }
// }

// updatePokemonData();

module.exports = {
  storePokemonData,
};
