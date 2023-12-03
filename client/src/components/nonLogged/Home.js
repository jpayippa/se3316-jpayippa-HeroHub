import React from 'react';
import { Box, Text, Center } from '@chakra-ui/react';
import NavBar from '../NavBar/Navbar';
import SearchHero from '../searchHeros';
import PublicListView from '../List/PublicListView';

export default function Home() {
  return (
    <div>
        <NavBar />
        <Center py={6}>
          <Box maxW="xl" borderWidth="1px" borderRadius="lg" overflow="hidden" p={6} boxShadow="lg">
            <Text fontSize="xl" fontWeight="bold" mb={2}>Welcome to Hero Hub</Text>
            <Text>
              Discover your favorite superheroes, their powers, and more! 
              Use our search tool to find detailed information about any superhero in our database.
            </Text>
          </Box>
        </Center>
        <SearchHero maxdisplay={10} />
        <PublicListView />
    </div>
  );
};


