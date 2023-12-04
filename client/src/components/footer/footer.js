import React from 'react';
import { Box, Flex, Link, Text } from '@chakra-ui/react';

const Footer = ({ onPolicyClick }) => {
  return (
    <Box as="footer" bg="gray.100" p={6}>
      <Flex justify="center" align="center">
        <Link as="button" onClick={() => onPolicyClick('Security and Privacy Policy')} color="blue.500" fontWeight="semibold" mr={4}>
          Security & Privacy Policy
        </Link>
        |
        <Link as="button" onClick={() => onPolicyClick('DMCA Notice & Takedown Policy')} color="blue.500" fontWeight="semibold" mx={4}>
          DMCA Policy
        </Link>
        |
        <Link as="button" onClick={() => onPolicyClick('Acceptable Use Policy')} color="blue.500" fontWeight="semibold" ml={4}>
          Acceptable Use Policy
        </Link>
      </Flex>
      <Text textAlign="center" mt={4} fontSize="sm" color="gray.600">
        © {new Date().getFullYear()} HeroSphere. All rights reserved.
      </Text>
    </Box>
  );
};

export default Footer;
