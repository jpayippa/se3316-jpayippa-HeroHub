import React, { useState } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, Textarea, Stack, useToast, Select, Tag, TagLabel, Heading, TagCloseButton, HStack, Center,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const CreateHeroList = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [heroes, setHeroes] = useState([]);
  const [heroInput, setHeroInput] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleHeroInputChange = (e) => {
    setHeroInput(e.target.value);
  };

  const handleAddHero = () => {
    if (heroInput && !heroes.includes(heroInput)) {
      setHeroes([...heroes, heroInput]);
      setHeroInput('');
    }
  };

  const handleRemoveHero = (heroToRemove) => {
    setHeroes(heroes.filter(hero => hero !== heroToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/hero-lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, description, visibility, heroes })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Handle success
      toast({
        title: 'Hero list created.',
        description: "We've created your hero list for you.",
        status: 'success',
        duration: 9000,
        isClosable: true,
      });

      // Reset form (optional)
      setName('');
      setDescription('');
      setVisibility('private');
      setHeroes([]);
      navigate(0);

    } catch (error) {
      toast({
        title: 'An error occurred.',
        description: "Unable to create hero list.",
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Hero List</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Heading as="h1" size="lg" mb={4} textAlign="center">Create List</Heading>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl id="name" isRequired>
                  <FormLabel>List Name</FormLabel>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter list name"
                  />
                </FormControl>

                <FormControl id="description">
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={200}
                    placeholder="Describe your list"
                  />
                </FormControl>

                <FormControl id="visibility">
                  <FormLabel>Visibility</FormLabel>
                  <Select
                    placeholder="Select option"
                    onChange={(e) => setVisibility(e.target.value)}
                    value={visibility}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </Select>
                </FormControl>

                <FormControl id="heroes">
                  <FormLabel>Hero IDs</FormLabel>
                  <HStack>
                    <Input
                      type="text"
                      value={heroInput}
                      onChange={handleHeroInputChange}
                      placeholder="Enter Hero ID"
                    />
                    <Button onClick={handleAddHero}>Add</Button>
                  </HStack>
                  <HStack spacing={4} mt={2}>
                    {heroes.map(hero => (
                      <Tag
                        size="md"
                        key={hero}
                        borderRadius="full"
                        variant="solid"
                        colorScheme="green"
                      >
                        <TagLabel>{hero}</TagLabel>
                        <TagCloseButton onClick={() => handleRemoveHero(hero)} />
                      </Tag>
                    ))}
                  </HStack>
                </FormControl>

              </Stack>
            </form>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Create List
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateHeroList;
