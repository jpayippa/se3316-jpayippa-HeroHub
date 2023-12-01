import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Adjust the import path as necessary
import { ChakraProvider, extendTheme } from '@chakra-ui/react';


 // Configuring Chakra UI theme to use dark mode by default
 const theme = extendTheme({
  config: {
    initialColorMode: 'dark', // Set default color mode to dark
    useSystemColorMode: false, // Optionally, set to true to use the system color mode
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  
  document.getElementById('root')
);
