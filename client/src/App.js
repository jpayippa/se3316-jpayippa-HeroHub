import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import SearchHero from './components/searchHeros';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

function App() {
  return (
    <Box textAlign="center" fontSize="xl">
      <Register />
      <Login />
      <Text>Superhero App!</Text>
      <SearchHero />
    </Box>
  );
}

export default App;