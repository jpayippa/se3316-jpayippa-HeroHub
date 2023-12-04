// Footer.js
import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const Footer = ({ onPolicyClick }) => {
  return (
    <Box as="footer" bg="gray.100" p={4}>
      <Text textAlign="center">
        <button onClick={() => onPolicyClick('Security and Privacy Policy')}>Security & Privacy Policy</button> | 
        <button onClick={() => onPolicyClick('DMCA Notice & Takedown Policy')}>DMCA Policy</button> |
        <button onClick={() => onPolicyClick('Acceptable Use Policy')}>Acceptable Use Policy</button>
      </Text>
    </Box>
  );
};

export default Footer;
