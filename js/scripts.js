// DOM Elements
var $pokemonList = document.querySelector(".main-content_pokemon-list");

// Container for storing pokemon relevant data
function Pokemon(name, detailsUrl) {
  this.name = name;
  this.details = {};
  this.detailsUrl = detailsUrl;
}

// List which contains all pokemons to display
var pokemonRepository = (function() {
  var repository = [];
  var apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

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
    if (!pokemonCard || !$pokemonList) return;

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
    var itemButton = getNamedButton(pokemon);
    listItem.appendChild(itemButton);
    return listItem;
  }

  // Function to create a UI button
  function getNamedButton(pokemon) {
    var itemButton = document.createElement("button");
    itemButton.innerText = pokemon.name;
    addButtonEvent(itemButton, "click", pokemon);
    addButtonStyle(itemButton);
    return itemButton;
  }

  // Function to show pokemon details
  function showDetails(pokemon) {
    if (!isPokemon(pokemon)) return;

    loadDetails(pokemon).then(() => console.log(pokemon.details));
  }

  // Function to add button event listeners
  function addButtonEvent(button, eventName, pokemon) {
    if (!button || !eventName) return;

    button.addEventListener(eventName, () => {
      event.preventDefault();
      showDetails(pokemon);
    });
  }

  // Function to load pokemon details form external server
  function loadDetails(pokemon) {
    if (!isPokemon(pokemon)) return Promise.reject("No details found");
    showLoadingMessage();
    return fetch(pokemon.detailsUrl)
      .then(res => res.json())
      .then(res => {
        removeLoadingMessage();
        pokemon.details = JSON.parse(JSON.stringify(res));
      })
      .catch(err => console.log(err));
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

  // Function to load pokemons from an external server
  function loadList() {
    showLoadingMessage();
    return fetch(apiUrl)
      .then(res => res.json())
      .then(res => {
        removeLoadingMessage();
        res.results.forEach(r => add(new Pokemon(r.name, r.url)));
      })
      .catch(err => console.log(err));
  }

  return {
    add: add,
    getAll: getAll,
    getFiltered: getFiltered,
    getPokemonCards: getPokemonCards,
    remove: remove,
    renderPokemonCard: renderPokemonCard,
    loadList: loadList
  };
})();

var modalBox = (function(){
  
})();

// Function to display loading message
function showLoadingMessage() {
  if (!$pokemonList) return;

  var loadingHeader = document.createElement("h2");
  loadingHeader.classList.add("main-content_loading-message");
  loadingHeader.innerText = "Fetching data from server...";
  $pokemonList.parentNode.appendChild(loadingHeader);
}

// Function to remove loading message
function removeLoadingMessage() {
  if (!$pokemonList) return;

  $pokemonList.parentNode.removeChild($pokemonList.nextElementSibling);
}

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

pokemonRepository
  .loadList()
  .then(() => {
    renderPokemonCards(pokemonRepository.getAll());
  })
  .catch(err => console.log(err));
