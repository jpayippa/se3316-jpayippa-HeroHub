import React, { useState } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, Textarea, Stack, useToast, Select, Tag, TagLabel, Heading, TagCloseButton, HStack,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const CreateHeroList = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [heroes, setHeroes] = useState([]);
  const [heroInput, setHeroInput] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleHeroInputChange = (e) => {
    setHeroInput(e.target.value);
  };

  const handleAddHero = () => {
    const heroId = parseInt(heroInput); // Ensure heroInput is treated as a number
    if (!isNaN(heroId) && heroId >= 0 && heroId <= 733 && !heroes.includes(heroId)) {
        setHeroes([...heroes, heroId]);
        setHeroInput('');
    } else {
        // Provide feedback if the hero ID is invalid or already added
        toast({
            title: 'Invalid or Duplicate Hero ID',
            description: isNaN(heroId) ? "Hero ID must be a number." : "This Hero ID is already added or out of valid range (0-733).",
            status: 'warning',
            duration: 5000,
            isClosable: true,
        });
    }
};

  const handleRemoveHero = (heroToRemove) => {
    setHeroes(heroes.filter(hero => hero !== heroToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ensure name, visibility, and heroes are filled in
  if (!name.trim() || !visibility.trim() || (heroes.length === 0)) {
    toast({
      title: 'Missing information',
      description: "Please fill in all required fields.",
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
    return;
  }

  // Validate hero IDs
  if (heroes.some(heroId => isNaN(heroId) || heroId < 0 || heroId > 733)) {
    toast({
      title: 'Invalid Hero ID',
      description: "Hero IDs must be between 0 and 733.",
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
    return;
  }

  const token = localStorage.getItem('token');
  // Check for duplicate list name
  const nameExistsResponse = await fetch('/api/user-hero-lists/check-name', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name })
  });

  const nameExistsData = await nameExistsResponse.json();
if (nameExistsData.exists) {  // Change this line
    toast({
      title: 'Name already exists',
      description: "You already have a list with this name.",
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
    return;
}

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
