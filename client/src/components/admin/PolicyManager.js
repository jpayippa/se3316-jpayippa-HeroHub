import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Textarea,
  Heading,
  useToast,
  VStack
} from '@chakra-ui/react';

const PolicyCreation = () => {
  const [policyTitle, setPolicyTitle] = useState('');
  const [policyContent, setPolicyContent] = useState('');
  const toast = useToast();

  const handleTitleChange = (e) => setPolicyTitle(e.target.value);
  const handleContentChange = (e) => setPolicyContent(e.target.value);

  const handleSubmit = async () => {
    const endpoint = '/api/policies'; // Adjust the endpoint as necessary

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: policyTitle, content: policyContent })
      });

      if (!response.ok) {
        throw new Error('Failed to create policy');
      }

      toast({
        title: 'Policy created successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset form fields
      setPolicyTitle('');
      setPolicyContent('');
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
    <Box p={8}>
      <Heading mb={6}>Create New Policy</Heading>
      <VStack spacing={4}>
        <Input 
          placeholder="Policy Title"
          value={policyTitle}
          onChange={handleTitleChange}
        />
        <Textarea
          placeholder="Enter policy content here"
          value={policyContent}
          onChange={handleContentChange}
          size="lg"
        />
        <Button colorScheme="blue" onClick={handleSubmit}>
          Create Policy
        </Button>
      </VStack>
    </Box>
  );
};

export default PolicyCreation;
