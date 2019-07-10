// Container for storing pokemon relevant data
function Pokemon(name, height, types) {
  this.name = name;
  this.height = height;
  this.types = types;
}

// List which contains all pokemons to display
var pokemonRepository = (function() {
  var repository = [
    new Pokemon("Bulbasur", 7, ["grass", "poison"]),
    new Pokemon("Sandslash", 1, ["Ground"]),
    new Pokemon("Golduck", 1.7, ["water"])
  ];

  function add(pokemon) {
    if (!isPokemon(pokemon)) return;

    repository.push(pokemon);
  }

  function getAll() {
    return repository;
  }

  return {
    add: add,
    getAll: getAll
  };
})();

// Function to display all pokemons on webpage
function printPokemonDetails(pokemons) {
  if (!isEnumeratorValid(pokemons)) return;

  getPokemonCards(pokemons).forEach(c => document.write(c));
}

// Function to validate, if parameter is a valid enumerator
function isEnumeratorValid(enumerator) {
  return enumerator && Array.isArray(enumerator) && enumerator.length;
}

// Function to build pokemon cards
function getPokemonCards(pokemons) {
  return pokemons.map(p => getCardText(p));
}

// Function to build pokemon card text
function getCardText(pokemon) {
  if (!isPokemon(pokemon)) return "";

  var cardText = `${pokemon.name}, (height: ${pokemon.height})`;
  return pokemon.height > 5
    ? `<p>${cardText} - Wow, that's big!</p>`
    : `<p>${cardText}</p>`;
}

// Function to validate an object as pokemon
function isPokemon(item) {
  return isObject(item) && isObjectEqual(item, new Pokemon());
}

// Function to validate an item as object
function isObject(item) {
  return item !== null && item !== undefined && typeof item === "object";
}

// Function to validate object equality
function isObjectEqual(original, clone) {
  var originalProperties = Object.keys(original);
  var cloneProperties = Object.keys(clone);

  if (!isPropertyCountEqual(originalProperties, cloneProperties)) return false;

  for (var i = 0; i < originalProperties.length; i++)
    if (originalProperties[i] !== cloneProperties[i]) return false;

  return true;
}

// Function to validate property count equality
function isPropertyCountEqual(originalProperties, cloneProperties) {
  return originalProperties.length === cloneProperties.length;
}

printPokemonDetails(pokemonRepository.getAll());
