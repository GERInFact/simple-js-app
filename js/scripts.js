// DOM Elements
var $pokemonList = document.querySelector('.main-content_pokemon-list');

// Container for storing pokemon relevant data
function Pokemon(name, detailsUrl) {
  this.name = name;
  this.details = {};
  this.detailsUrl = detailsUrl;
}

var modalBox = (function() {
  var $modalContainer = document.querySelector('#modal-container');

  // Function to hide pokemon details
  function hide() {
    if ($modalContainer.classList.contains('is-visible'))
      $modalContainer.classList.remove('is-visible');
  }

  // Function to display pokemon details
  function show(pokemon) {
    if (!$modalContainer) return;

    $modalContainer.innerHTML = '';
    $modalContainer.classList.add('is-visible');

    var modal = getModal();
    setModalContent(modal, pokemon)
      .then(() => {
        renderModal(modal);
      })
      .catch(err => console.log(err));
  }

  // Function to create modal box for pokemon details
  function getModal() {
    var modal = document.createElement('div');
    modal.classList.add('modal');
    return modal;
  }

  // Function to create modal box content
  function setModalContent(modal, pokemon) {
    return new Promise((resolve, reject) => {
      if (!pokemon || !modal) reject();
      else {
        modal.appendChild(getHeader(pokemon));
        modal.appendChild(getImage(pokemon.details));
        modal.appendChild(getInfos(pokemon.details));
        resolve();
      }
    });
  }

  // Function to create modal header
  function getHeader(pokemon) {
    var header = document.createElement('div');
    header.classList.add('modal_header');
    header.appendChild(getCloseButton());
    header.appendChild(getTitle(pokemon));
    return header;
  }

  // Function to create close button
  function getCloseButton() {
    var closeButton = document.createElement('button');
    closeButton.classList.add('modal_close');
    closeButton.addEventListener('click', hide);
    closeButton.innerText = 'Close';
    return closeButton;
  }

  // Function to create modal box title
  function getTitle(pokemon) {
    var title = document.createElement('h2');
    title.classList.add('modal_title');
    title.innerText = pokemon.name;
    return title;
  }

  // Function to get modal box image
  function getImage(pokemonDetails) {
    var image = document.createElement('img');
    image.setAttribute('src', pokemonDetails.sprites.front_default);
    image.setAttribute(
      'alt',
      `The front view of ${pokemonDetails.species.name}`
    );
    image.classList.add('modal_image');
    return image;
  }

  // Function to get modal box info text
  function getInfos(pokemonDetails) {
    var textContainer = document.createElement('div');
    textContainer.classList.add('modal_text-container');

    Object.keys(pokemonDetails).forEach(p => {
      if (!Array.isArray(pokemonDetails[p]) && !isObject(pokemonDetails[p])) {
        textContainer.appendChild(getInfoElement(pokemonDetails, p));
      }
    });

    return textContainer;
  }

  // Function to get info texts subtext
  function getInfoElement(pokemonDetails, property) {
    var info = document.createElement('p');
    info.classList.add('text-container_item');
    info.innerText = `${property}: ${pokemonDetails[property]}`;
    return info;
  }

  // Function to attach modal box to the DOM
  function renderModal(modal) {
    requestAnimationFrame(() => $modalContainer.appendChild(modal));
  }

  // Function to close modal on ESCAPE pressed
  window.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;

    hide();
  });

  // Function to close modal, if clicked around it
  $modalContainer.addEventListener('click', e => {
    e.preventDefault();

    if (e.target !== $modalContainer) return;

    hide();
  });

  return {
    show: show,
    hide: hide
  };
})();

// List which contains all pokemons to display
var pokemonRepository = (function() {
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

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
    if (!isPokemon(pokemon)) return '';

    return getAsListItem(pokemon);
  }

  // Function to create a UI element form pokemon data
  function getAsListItem(pokemon) {
    var listItem = document.createElement('li');
    var itemButton = getNamedButton(pokemon);
    listItem.appendChild(itemButton);
    return listItem;
  }

  // Function to create a UI button
  function getNamedButton(pokemon) {
    var itemButton = document.createElement('button');
    itemButton.innerText = pokemon.name;
    itemButton.setAttribute('id', pokemon.name);
    addButtonEvent(itemButton, 'click', pokemon);
    addButtonStyle(itemButton);
    return itemButton;
  }

  // Function to add button event listeners
  function addButtonEvent(button, eventName, pokemon) {
    if (!button || !eventName) return;

    button.addEventListener(eventName, () => {
      event.preventDefault();
      showDetails(pokemon);
    });
  }

  // Function to add button styles
  function addButtonStyle(listItem) {
    listItem.classList.add('item_button');
  }

  // Function to show pokemon details
  function showDetails(pokemon) {
    if (!isPokemon(pokemon)) return;

    loadDetails(pokemon).then(() => modalBox.show(pokemon));
  }

  // Function to load pokemon details form external server
  function loadDetails(pokemon) {
    if (!isPokemon(pokemon)) return Promise.reject('No details found');
    showLoadingMessage();
    return fetch(pokemon.detailsUrl)
      .then(res => res.json())
      .then(res => {
        removeLoadingMessage();
        pokemon.details = JSON.parse(JSON.stringify(res));
      })
      .catch(err => console.log(err));
  }

  // Function to validate an object as pokemon
  function isPokemon(item) {
    return isObject(item) && isObjectEqual(item, new Pokemon());
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
        addSearchFunctionality();
      })
      .catch(err => console.log(err));
  }

  // Function to display searched pokemon details
  function addSearchFunctionality() {
    var $searchBar = document.querySelector('.search_bar');
    var $searchSubmit = document.querySelector('.search_submit');
    if (!($searchBar && $searchSubmit)) return;

    // Function to display found pokemon
    $searchSubmit.addEventListener('click', e => {
      e.preventDefault();
      if (!$searchBar.value) return;

      showFound($searchBar.value, $searchBar);
    });

    // Function to display found pokemon
    $searchBar.addEventListener('keydown', e => {
      if (e.keyCode !== 13) return;

      showFound(e.target.value, $searchBar);
    });
  }

  // Function to show details of pokemon searched for
  function showFound(filter, $searchBar) {
    if (!filter || !$searchBar) return;

    var pokemonFound = getFiltered(filter).shift();
    if (pokemonFound) showDetails(pokemonFound);
    else showNotFoundMessage($searchBar);
  }

  // Function to show pokemon could not be found
  function showNotFoundMessage($searchBar) {
    if (!$searchBar) return;

    const notFoundMessage = document.createElement('p');
    notFoundMessage.innerText = 'Pokémon not found.';
    $searchBar.parentElement.appendChild(notFoundMessage);
    setTimeout(() => {
      $searchBar.parentElement.removeChild(notFoundMessage);
    }, 1000);
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

// Function to display loading message
function showLoadingMessage() {
  if (!$pokemonList) return;

  var loadingHeader = document.createElement('h2');
  loadingHeader.classList.add('main-content_loading-message');
  loadingHeader.innerText = 'Fetching data from server...';
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

// Function to validate an item as object
function isObject(item) {
  return item !== null && item !== undefined && typeof item === 'object';
}

pokemonRepository
  .loadList()
  .then(() => {
    renderPokemonCards(pokemonRepository.getAll());
  })
  .catch(err => console.log(err));
