import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Stack,
  Center,
  Box,
  Heading,
  useToast
} from '@chakra-ui/react';

const EditModal = ({ isOpen, onClose, list, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState('');
    const [heroes, setHeroes] = useState([]);
    const [heroInput, setHeroInput] = useState('');
    const toast = useToast();

    useEffect(() => {
        if (list) {
            setName(list.name || '');
            setDescription(list.description || '');
            setVisibility(list.visibility || '');
            setHeroes(list.heroes.map(heroId => parseInt(heroId)) || []);
        }
    }, [list]);
    

    if (!list) {
        return null; // or some other placeholder content
    }

    const handleHeroInputChange = (e) => setHeroInput(e.target.value);

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
    

    const handleRemoveHero = (heroId) => {
        setHeroes(heroes.filter(hero => hero !== heroId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        try {
            const token = localStorage.getItem('token'); // Replace with actual token retrieval logic
            const response = await fetch(`/api/hero-lists/${list._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, description, visibility, heroes })
            });

            if (!response.ok) {
                throw new Error('Failed to update the list');
            }

            onSave(); // Refresh the lists in the parent component
            onClose(); // Close the modal
            toast({ title: 'List updated successfully', status: 'success' });
        } catch (error) {
            toast({ title: 'Error updating list', status: 'error', description: error.message });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit List</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Center py={6}>
                        <Box w="full" maxW="md" p={4} borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="lg">
                            <Heading as="h1" size="lg" mb={4} textAlign="center">Edit List</Heading>
                            <form onSubmit={handleSubmit}>
                                <Stack spacing={4}>
                                    {/* Name */}
                                    <FormControl id="name" isRequired>
                                        <FormLabel>List Name</FormLabel>
                                        <Input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </FormControl>

                                    {/* Description */}
                                    <FormControl id="description">
                                        <FormLabel>Description</FormLabel>
                                        <Textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </FormControl>

                                    {/* Visibility */}
                                    <FormControl id="visibility">
                                        <FormLabel>Visibility</FormLabel>
                                        <Select
                                            value={visibility}
                                            onChange={(e) => setVisibility(e.target.value)}
                                        >
                                            <option value="public">Public</option>
                                            <option value="private">Private</option>
                                        </Select>
                                    </FormControl>

                                    {/* Hero IDs */}
                                    <FormControl id="heroes">
                                        <FormLabel>Hero IDs</FormLabel>
                                        <HStack>
                                            <Input
                                                type="text"
                                                value={heroInput}
                                                onChange={handleHeroInputChange}
                                            />
                                            <Button onClick={handleAddHero}>Add</Button>
                                        </HStack>
                                        <HStack spacing={4} mt={2}>
                                            {heroes.map(hero => (
                                                <Tag size="md" key={hero} borderRadius="full" variant="solid" colorScheme="green">
                                                    <TagLabel>{hero}</TagLabel>
                                                    <TagCloseButton onClick={() => handleRemoveHero(hero)} />
                                                </Tag>
                                            ))}
                                        </HStack>
                                    </FormControl>

                                    <Button mt={4} colorScheme="blue" type="submit">
                                        Save Changes
                                    </Button>
                                </Stack>
                            </form>
                        </Box>
                    </Center>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default EditModal;
