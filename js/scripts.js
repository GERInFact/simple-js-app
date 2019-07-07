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

// Display all pokemons on webpage
for (var pokemon of repository) {
  var displayText = `${pokemon.name}, (height: ${pokemon.height})`;
  
  if(pokemon.height > 5)
    displayText += ' - Wow, that\'s big!';
  document.write(`<p>${displayText}</p>`);
}

