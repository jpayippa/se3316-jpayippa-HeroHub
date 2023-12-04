const { readSuperheroInfo, readSuperheroPowers } = require('./readData');
const { sanitizeInput, validateId } = require('./sanitization');

// Helper function to get unique powers for a hero
const getHeroPowers = (heroName, superheroPowers) => {

  const heroPowerData = superheroPowers.find(powerHero => powerHero.hero_names === heroName);
  if (!heroPowerData) return ["No Powers found in our database for this hero"];
  return Object.keys(heroPowerData).filter(key => heroPowerData[key].toLowerCase() === 'true');
  };
  

const getPublishers = async () => {
  const superheroInfo = await readSuperheroInfo();
  const publishers = [...new Set(superheroInfo.map(sh => sh.Publisher).filter(pub => pub))];
  return publishers;
};
const getSuperheroInfoById = async (id) => {
  const superheroInfo = await readSuperheroInfo();
  const superheroPowers = await readSuperheroPowers();

  const superhero = superheroInfo.find(hero => hero.id.toString() === id.toString());

  if (!superhero) {
    throw new Error('Superhero not found');
  }

  return { ...superhero, powers: getHeroPowers(superhero.name, superheroPowers) };
};

const getAllSuperheroInfoByName = async (name) => {
  const sanitizedInput = sanitizeInput(name);
  const superheroInfo = await readSuperheroInfo();
  const superheroPowers = await readSuperheroPowers();

  return superheroInfo
    .filter(hero => hero.name?.toLowerCase().includes(sanitizedInput.toLowerCase()))
    .map(hero => ({ ...hero, powers: getHeroPowers(hero.name, superheroPowers) }));
};

const getAllSuperheroInfoByRace = async (race) => {
  const sanitizedInput = sanitizeInput(race);
  const superheroInfo = await readSuperheroInfo();
  const superheroPowers = await readSuperheroPowers();

  return superheroInfo
    .filter(hero => hero.Race?.toLowerCase().includes(sanitizedInput.toLowerCase()))
    .map(hero => ({ ...hero, powers: getHeroPowers(hero.name, superheroPowers) }));
};

const getAllSuperheroInfoByPublisher = async (publisher) => {
  const sanitizedInput = sanitizeInput(publisher);
  const superheroInfo = await readSuperheroInfo();
  
  const superheroPowers = await readSuperheroPowers();

  return superheroInfo
    .filter(hero => hero.Publisher?.toLowerCase().includes(sanitizedInput.toLowerCase()))
    .map(hero => ({ ...hero, powers: getHeroPowers(hero.name, superheroPowers) }));
};

const getAllSuperheroInfoByPower = async (power) => {
  const sanitizedInput = sanitizeInput(power).toLowerCase();

  const superheroInfo = await readSuperheroInfo();
  const superheroPowers = await readSuperheroPowers();

  return superheroInfo
    .filter(hero => {
      // Check if this hero has the power, ignoring case
      const heroPowers = superheroPowers
        .find(powerHero => powerHero.hero_names === hero.name);

      if (!heroPowers) return false;

      // Check if the hero has the specified power (ignoring case for power keys)
      return Object.keys(heroPowers).some(key => 
        key.toLowerCase() === sanitizedInput && heroPowers[key].toLowerCase() === 'true'
      );
    })
    .map(hero => ({ ...hero, powers: getHeroPowers(hero.name, superheroPowers).join(', ') }));
};



  

function filterSuperheroes(superheroesArrays) {
    // Check if superheroesArrays is an array and its first element is also an array
    if (!Array.isArray(superheroesArrays) || !Array.isArray(superheroesArrays[0])) {
      throw new Error('Expected an array of arrays');
    }
    
    if (superheroesArrays.length === 0 || superheroesArrays[0].length === 0) {
      return [];
    }
  
    // Use the first array as the base and filter based on other arrays
    const filteredSuperheroesList = superheroesArrays[0].filter((hero) => {
      return superheroesArrays.every((otherArray) => 
        otherArray.some((commonHero) => commonHero.name === hero.name)
      );
    });
  
    return filteredSuperheroesList;
  }
  

module.exports = {
  getPublishers,
  getSuperheroInfoById,
  getAllSuperheroInfoByName,
  getAllSuperheroInfoByPublisher,
  getAllSuperheroInfoByRace,
  getAllSuperheroInfoByPower,
  filterSuperheroes
};
