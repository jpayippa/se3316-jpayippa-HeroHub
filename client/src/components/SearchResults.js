import React, { useState } from 'react';
import { Box, VStack, Text, HStack, Badge, Link, IconButton, Collapse } from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';

const SearchResult = ({ hero }) => {
  const [showDetails, setShowDetails] = useState(false);
  const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(hero.name)}-superhero`;
  const powersList = Array.isArray(hero.powers) ?
    hero.powers.map((power, index) => <Badge key={index} colorScheme="blue">{power}</Badge>) :
    <Text>{hero.powers}</Text>;

  const handleToggle = () => setShowDetails(!showDetails);

  return (
    <Box border="1px" borderColor="gray.200" p={4} rounded="md" shadow="md" width="100%">
      <HStack justifyContent="space-between">
        <VStack align="start">
          <Text fontWeight="bold" fontSize="xl">ID:{hero.id}, {hero.name}</Text>
          <Text fontSize="md">Publisher: {hero.Publisher}</Text>
        </VStack>
        <IconButton
          onClick={handleToggle}
          icon={showDetails ? <ChevronUpIcon /> : <ChevronDownIcon />}
          aria-label="Show Details"
          size="sm"
        />
      </HStack>
      <Collapse in={showDetails} animateOpacity>
        <VStack mt={4} align="start">
          
          <Text>Gender: {hero.Gender}</Text>
          <Text>Eye color: {hero['Eye color']}</Text>
          <Text>Race: {hero.Race}</Text>
          <Text>Hair color: {hero['Hair color']}</Text>
          <Text>Height: {hero.Height} cm</Text>
          <Text>Skin color: {hero['Skin color']}</Text>
          <Text>Alignment: {hero.Alignment}</Text>
          <Text>Weight: {hero.Weight} kg</Text>
          <Text fontWeight="bold">Powers:</Text>
          <HStack spacing={2} wrap="wrap">{powersList}</HStack>
          <Link href={searchUrl} isExternal color="blue.500">Search on DDG</Link>
        </VStack>
      </Collapse>
    </Box>
  );
};

export default SearchResult;
