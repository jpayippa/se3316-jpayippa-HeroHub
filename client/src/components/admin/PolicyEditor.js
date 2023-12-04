import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Textarea,
  Heading,
  useToast,
  VStack,
  Select,
    Center,
} from '@chakra-ui/react';

const PolicyEditor = () => {
  const [policyTitle, setPolicyTitle] = useState('');
  const [policyContent, setPolicyContent] = useState('');
  const [policyExists, setPolicyExists] = useState(true);
  const toast = useToast();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (policyTitle) {
      fetch(`/api/policies/${policyTitle}`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error(res.status);
        })
        .then((data) => {
          setPolicyContent(data.content);
          setPolicyExists(true);
        })
        .catch((error) => {
          if (error.message === '404') {
            setPolicyExists(false);
            setPolicyContent('');
          } else {
            console.error('Error fetching policy:', error);
          }
        });
    }
  }, [policyTitle]);

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/policies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: policyTitle, content: policyContent })
      });

      if (!response.ok) {
        throw new Error('Failed to submit policy');
      }

      toast({
        title: policyExists ? 'Policy Updated' : 'Policy Created',
        description: `The ${policyTitle} has been successfully ${policyExists ? 'updated' : 'created'}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Center py={6}>
      <Box w="full" maxW="md" p={4} borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="lg">
    <Box p={3} >
      <Heading mb={6}>{policyExists ? 'Edit' : 'Create'} Policy</Heading>
      <VStack spacing={4}>
        <Select placeholder="Select policy" onChange={(e) => setPolicyTitle(e.target.value)}>
          <option value="Security and Privacy Policy">Security & Privacy Policy</option>
          <option value="DMCA Notice & Takedown Policy">DMCA Policy</option>
          <option value="Acceptable Use Policy">Acceptable Use Policy</option>
        </Select>
        <Textarea
          placeholder="Enter policy content here"
          value={policyContent}
          onChange={(e) => setPolicyContent(e.target.value)}
          size="lg"
          minW="400px"
          minH="200px" // Adjust the minimum height for comfortable editing
        />
        <Button colorScheme="blue" onClick={handleSubmit}>
          {policyExists ? 'Update' : 'Create'}
        </Button>
      </VStack>
    </Box>
    </Box>
    </Center>
  );
};

export default PolicyEditor;
