function Pokemon(name, height, types) {
  this.name = name;
  this.height = height;
  this.types = types;
}

// The container which contains all pokemons to display
var repository = [
  new Pokemon("Bulbasur", 7, ["grass", "poison"]),
  new Pokemon("Sandslash", 1, ["Ground"]),
  new Pokemon("Golduck", 1.7, ["water"])
];
