// Container for storing pokemon relevant data
function Pokemon(name, height, types) {
  this.name = name;
  this.height = height;
  this.types = types;
}

// List which contains all pokemons to display
var repository = [
  new Pokemon("Bulbasur", 7, ["grass", "poison"]),
  new Pokemon("Sandslash", 1, ["Ground"]),
  new Pokemon("Golduck", 1.7, ["water"])
];

// Function to display all pokemons on webpage
function printPokemonDetails(pokemons) {
  if (!isEnumeratorValid(pokemons)) return;

  getPokemonCards(pokemons).forEach(c => document.write(c));
}

// Function to build pokemon cards
function getPokemonCards(pokemons) {
  if (!isEnumeratorValid(pokemons)) return [];

  return pokemons.map(p => {
    var displayText = `${p.name}, (height: ${p.height})`;
    if (p.height > 5) displayText += " - Wow, that's big!";

    return `<p>${displayText}</p>`;
  });
}

// Function to validate, if
function isEnumeratorValid(enumerator) {
  return enumerator && Array.isArray(enumerator) && enumerator.length;
}

printPokemonDetails(repository);
