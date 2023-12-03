import React, { useState, useEffect } from 'react';
import { Box, Input, Button, VStack, Select, FormControl, FormLabel, Center, Heading } from '@chakra-ui/react';


import SearchResult from './SearchResults';


const SearchHero = () => {
  const [publishers, setPublishers] = useState([]);

  useEffect(() => {
    const fetchPublishers = async () => {
      try {
        const response = await fetch('/api/publishers');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPublishers(data);
      } catch (error) {
        console.error('Error fetching publishers:', error);
      }
    };

    fetchPublishers();
  }, []);

  const powerOptions = [
    "Agility",
    "Accelerated Healing",
    "Lantern Power Ring",
    "Dimensional Awareness",
    "Cold Resistance",
    "Durability",
    "Stealth",
    "Energy Absorption",
    "Flight",
    "Danger Sense",
    "Underwater breathing",
    "Marksmanship",
    "Weapons Master",
    "Power Augmentation",
    "Animal Attributes",
    "Longevity",
    "Intelligence",
    "Super Strength",
    "Cryokinesis",
    "Telepathy",
    "Energy Armor",
    "Energy Blasts",
    "Duplication",
    "Size Changing",
    "Density Control",
    "Stamina",
    "Astral Travel",
    "Audio Control",
    "Dexterity",
    "Omnitrix",
    "Super Speed",
    "Possession",
    "Animal Oriented Powers",
    "Weapon-based Powers",
    "Electrokinesis",
    "Darkforce Manipulation",
    "Death Touch",
    "Teleportation",
    "Enhanced Senses",
    "Telekinesis",
    "Energy Beams",
    "Magic",
    "Hyperkinesis",
    "Jump",
    "Clairvoyance",
    "Dimensional Travel",
    "Power Sense",
    "Shapeshifting",
    "Peak Human Condition",
    "Immortality",
    "Camouflage",
    "Element Control",
    "Phasing",
    "Astral Projection",
    "Electrical Transport",
    "Fire Control",
    "Projection",
    "Summoning",
    "Enhanced Memory",
    "Reflexes",
    "Invulnerability",
    "Energy Constructs",
    "Force Fields",
    "Self-Sustenance",
    "Anti-Gravity",
    "Empathy",
    "Power Nullifier",
    "Radiation Control",
    "Psionic Powers",
    "Elasticity",
    "Substance Secretion",
    "Elemental Transmogrification",
    "Technopath/Cyberpath",
    "Photographic Reflexes",
    "Seismic Power",
    "Animation",
    "Precognition",
    "Mind Control",
    "Fire Resistance",
    "Power Absorption",
    "Enhanced Hearing",
    "Nova Force",
    "Insanity",
    "Hypnokinesis",
    "Animal Control",
    "Natural Armor",
    "Intangibility",
    "Enhanced Sight",
    "Molecular Manipulation",
    "Heat Generation",
    "Adaptation",
    "Gliding",
    "Power Suit",
    "Mind Blast",
    "Probability Manipulation",
    "Gravity Control",
    "Regeneration",
    "Light Control",
    "Echolocation",
    "Levitation",
    "Toxin and Disease Control",
    "Banish",
    "Energy Manipulation",
    "Heat Resistance",
    "Natural Weapons",
    "Time Travel",
    "Enhanced Smell",
    "Illusions",
    "Thirstokinesis",
    "Hair Manipulation",
    "Illumination",
    "Omnipotent",
    "Cloaking",
    "Changing Armor",
    "Power Cosmic",
    "Biokinesis",
    "Water Control",
    "Radiation Immunity",
    "Vision - Telescopic",
    "Toxin and Disease Resistance",
    "Spatial Awareness",
    "Energy Resistance",
    "Telepathy Resistance",
    "Molecular Combustion",
    "Omnilingualism",
    "Portal Creation",
    "Magnetism",
    "Mind Control Resistance",
    "Plant Control",
    "Sonar",
    "Sonic Scream",
    "Time Manipulation",
    "Enhanced Touch",
    "Magic Resistance",
    "Invisibility",
    "Sub-Mariner",
    "Radiation Absorption",
    "Intuitive aptitude",
    "Vision - Microscopic",
    "Melting",
    "Wind Control",
    "Super Breath",
    "Wallcrawling",
    "Vision - Night",
    "Vision - Infrared",
    "Grim Reaping",
    "Matter Absorption",
    "The Force",
    "Resurrection",
    "Terrakinesis",
    "Vision - Heat",
    "Vitakinesis",
    "Radar Sense",
    "Qwardian Power Ring",
    "Weather Control",
    "Vision - X-Ray",
    "Vision - Thermal",
    "Web Creation",
    "Reality Warping",
    "Odin Force",
    "Symbiote Costume",
    "Speed Force",
    "Phoenix Force",
    "Molecular Dissipation",
    "Vision - Cryo",
    "Omnipresent",
    "Omniscient"
  ];



  const [searchParams, setSearchParams] = useState({
    name: '',
    power: '',
    race: '',
    publisher: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if at least one field is filled
    if (Object.values(searchParams).every(param => param === '')) {
      alert('Please fill in at least one search criteria.');
      return;
    }

    setIsSearching(true);

    try {
      const query = new URLSearchParams(searchParams).toString();
      const response = await fetch(`/api/superheroes/search?${query}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearResults = () => {
    setSearchResults([]);
};

  return (
    <Center>
      <Box w="full" maxW="md" p={4} borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="lg">
      <Heading as="h1" size="lg" mb={4} textAlign="center">Search Hero</Heading>       

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="name">
              <FormLabel>Name</FormLabel>
              <Input placeholder="Name" name="name" value={searchParams.name} onChange={handleChange} />
            </FormControl>
            <FormControl id="power">
              <FormLabel>Power</FormLabel>
              <Select placeholder="Select Power" name="power" value={searchParams.power} onChange={handleChange}>
                {powerOptions.map((power, index) => (
                  <option key={index} value={power}>{power}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl id="race">
              <FormLabel>Race</FormLabel>
              <Input placeholder="Race" name="race" value={searchParams.race} onChange={handleChange} />
            </FormControl>
            <FormControl id="publisher">
              <FormLabel>Publisher</FormLabel>
              <Select placeholder="Select Publisher" name="publisher" value={searchParams.publisher} onChange={handleChange}>
                {publishers.map((publisher, index) => (
                  <option key={index} value={publisher}>{publisher}</option>
                ))}
              </Select>                    </FormControl>
            <Button type="submit" colorScheme="blue" isLoading={isSearching}>Search</Button>
          </VStack>
        </form>
        <Button onClick={handleClearResults} colorScheme="red" size='xs'>Clear Results</Button>

        <VStack spacing={4} mt={4}>
          {searchResults.map(hero => (
            <SearchResult key={hero.id} hero={hero} />
          ))}
        </VStack>
      </Box>
    </Center>
  );
};

export default SearchHero;
