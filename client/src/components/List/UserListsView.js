import React, { useState, useEffect } from 'react';
import { Box, VStack, Text, Spinner, Center, Collapse, Heading, IconButton, Flex, useToast, Button } from '@chakra-ui/react';
import SearchResult from '../SearchResults';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import EditModal from './EditList';
import { AddIcon } from '@chakra-ui/icons';
import CreateHeroList from './CreateList';



const UserListsView = () => {
    const [userLists, setUserLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedListId, setExpandedListId] = useState(null);
    const [heroesData, setHeroesData] = useState({}); // Store fetched hero details
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentList, setCurrentList] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false);
    const toast = useToast();
    const navigate = useNavigate();



    useEffect(() => {
        const fetchUserLists = async () => {
            setLoading(true);
            try {
                // Replace with your actual authentication token retrieval logic
                const token = localStorage.getItem('token');
                const response = await fetch('/api/user-hero-lists', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch user lists');
                const data = await response.json();
                setUserLists(data);
            } catch (error) {
                console.error('Error fetching user lists:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserLists();
    }, []);


    const fetchHeroDetails = async (heroIds) => {
        const heroDetails = await Promise.all(heroIds.map(async (id) => {
            const response = await fetch(`/api/superheroes/search?id=${id}`);
            if (response.ok) {
                return response.json();
            }
            return null; // or some error handling
        }));
        return heroDetails.filter(hero => hero != null);
    };

    const handleEdit = (list) => {
        setCurrentList(list);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const refreshLists = () => {
        navigate(0)
    };

    const handleDelete = async (listId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this list?');
        if (!confirmDelete) {
            return; // Exit if the user cancels
        }

        try {
            // Retrieve the JWT token
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Make the DELETE request to the server
            const response = await fetch(`/api/hero-lists/${listId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete the list');
            }

            // Remove the deleted list from state to update the UI
            setUserLists(prevLists => prevLists.filter(list => list._id !== listId));

            toast({
                title: 'List successfully deleted',
                status: 'success',
                duration: 9000,
                isClosable: true,
                position: 'top'
            });

        } catch (error) {
            console.error('Error deleting list:', error);
            alert('Error deleting list');
        }
        navigate(0);
    };

    const toggleList = async (listId) => {
        if (expandedListId === listId) {
            setExpandedListId(null);
        } else {
            const list = userLists.find(list => list._id === listId);
            if (list && list.heroes) {
                const fetchedHeroes = await fetchHeroDetails(list.heroes);
                setHeroesData(prev => ({ ...prev, [listId]: fetchedHeroes }));
            }
            setExpandedListId(listId);
        }
    };
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }; // Customize as needed
        return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
    };


    if (loading) {
        return <Center><Spinner /></Center>;
    }

    return (
        <><EditModal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            list={currentList}
            onSave={refreshLists}
        />
            <CreateHeroList // Use the modal component here
                isOpen={isCreateModalOpen}
                onClose={closeCreateModal}
            />
            <Center py={6}>
                <Box w="full" maxW="md" p={4} borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="lg">
                    <Flex justifyContent="space-between" alignItems="center">

                        <Heading as="h1" size="lg" mb={4} textAlign="center">My Hero Lists</Heading>
                        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={openCreateModal}>
                            Add List
                        </Button>
                    </Flex>
                    <VStack spacing={4}>
                        {loading ? (
                            <Center><Spinner /></Center>
                        ) : (
                            userLists.map(list => (
                                <Box key={list._id} p={5} shadow="md" borderWidth="1px" borderRadius="md" width='100%'>
                                    <Flex justifyContent="space-between" alignItems="center">

                                        <Text fontWeight="bold" onClick={() => toggleList(list._id)} cursor="pointer">
                                            {list.name} - {list.visibility}
                                        </Text>
                                        <Box>
                                            <IconButton
                                                aria-label="Edit list"
                                                icon={<AiFillEdit />}
                                                onClick={() => handleEdit(list)}
                                                marginRight={2}
                                            />
                                            <IconButton
                                                aria-label="Delete list"
                                                icon={<AiFillDelete />}
                                                onClick={() => handleDelete(list._id)}
                                            />
                                        </Box>
                                    </Flex>
                                    <Collapse in={expandedListId === list._id} animateOpacity>
                                        <Text mt={4}>{list.description}</Text>
                                        <Text mt={4}>Create on: {formatDate(list.createdAt)}</Text>
                                        <Text mt={4}>Last updated: {formatDate(list.updatedAt)}</Text>
                                        <VStack mt={4}>
                                            {heroesData[list._id]?.map(heroArray => {
                                                const hero = heroArray[0]; // Assuming each array contains one hero object
                                                return <SearchResult key={hero.id} hero={hero} />;
                                            })}
                                        </VStack>
                                    </Collapse>

                                </Box>
                            ))
                        )}
                    </VStack>
                </Box>
            </Center>
        </>
    );
};

export default UserListsView;
