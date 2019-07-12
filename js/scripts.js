// DOM Elements
var $pokemonList = document.querySelector(".main-content_pokemon-list");

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

  // Function to add a new pokemon
  function add(pokemon) {
    if (!isPokemon(pokemon)) return;

    repository.push(pokemon);
  }

  // Function to get all pokemons listed
  function getAll() {
    return repository;
  }

  // Function to get all pokemons with the filter applied
  function getFiltered(filter) {
    if (!filter) return [];

    return repository.filter(c =>
      String(Object.values(c))
        .toLowerCase()
        .includes(String(filter).toLowerCase())
    );
  }

  // Function to remove a certain pokemon
  function remove(pokemon) {
    if (!isPokemon(pokemon)) return;

    repository.splice(repository.indexOf(pokemon), 1);
  }

  // Function to add the pokemon card to the DOM
  function renderPokemonCard(pokemonCard) {
    if (!pokemonCard) return;

    $pokemonList.appendChild(pokemonCard);
  }

  // Function to build pokemon cards
  function getPokemonCards(pokemons) {
    return pokemons.map(p => getPokemonCard(p));
  }

  // Function to build pokemon card
  function getPokemonCard(pokemon) {
    if (!isPokemon(pokemon)) return "";

    return getAsListItem(pokemon);
  }

  // Function to create a UI element form pokemon data
  function getAsListItem(pokemon) {
    var listItem = document.createElement("li");
    var itemButton = document.createElement("button");
    itemButton.innerText = pokemon.name;
    addButtonStyle(itemButton);
    listItem.appendChild(itemButton);
    return listItem;
  }

  // Function to add button styles
  function addButtonStyle(listItem) {
    listItem.classList.add("item_button");
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

    if (!isPropertyCountEqual(originalProperties, cloneProperties))
      return false;

    for (var i = 0; i < originalProperties.length; i++)
      if (originalProperties[i] !== cloneProperties[i]) return false;

    return true;
  }

  // Function to validate property count equality
  function isPropertyCountEqual(originalProperties, cloneProperties) {
    return originalProperties.length === cloneProperties.length;
  }

  return {
    add: add,
    getAll: getAll,
    getFiltered: getFiltered,
    getPokemonCards: getPokemonCards,
    remove: remove,
    renderPokemonCard: renderPokemonCard
  };
})();

// Function to add multiple pokemon cards to the DOM
function renderPokemonCards(pokemons) {
  if (!isEnumeratorValid(pokemons)) return;

  pokemonRepository
    .getPokemonCards(pokemons)
    .forEach(c => pokemonRepository.renderPokemonCard(c));
}

// Function to validate, if parameter is a valid enumerator
function isEnumeratorValid(enumerator) {
  return enumerator && Array.isArray(enumerator) && enumerator.length;
}

renderPokemonCards(pokemonRepository.getAll());
