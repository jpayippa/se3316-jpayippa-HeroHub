import React, { useState, useEffect } from 'react';
import { Box, VStack, Text, Spinner, Center, Collapse, Heading } from '@chakra-ui/react';
import SearchResult from '../SearchResults';

const PublicListView = ({ maxDisplay }) => {
    const [heroLists, setHeroLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedListId, setExpandedListId] = useState(null);
    const [heroesData, setHeroesData] = useState({}); // Store fetched hero details



    useEffect(() => {
        const fetchHeroLists = async () => {
            try {
                const response = await fetch('/api/hero-lists?visibility=public');
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                setHeroLists(data.slice(0, maxDisplay)); // Limiting the number of lists
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchHeroLists();
    }, [maxDisplay]);

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


    const toggleList = async (listId) => {
        if (expandedListId === listId) {
            setExpandedListId(null);
        } else {
            const list = heroLists.find(list => list._id === listId);
            if (list && list.heroes) {
                const fetchedHeroes = await fetchHeroDetails(list.heroes);
                setHeroesData(prev => ({ ...prev, [listId]: fetchedHeroes }));
            }
            setExpandedListId(listId);
        }
    };

    if (loading) {
        return (
            <Center>
                <Spinner />
            </Center>
        );
    }

    return (
        <Center py={6}>
            <Box w="full" maxW="md" p={4} borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="lg">
                <Heading as="h1" size="lg" mb={4} textAlign="center">Public Lists</Heading>                
                <VStack spacing={4}>
                {loading ? (
                    <Center><Spinner /></Center>
                ) : (
                    heroLists.slice(0, maxDisplay).map(list => (
                        <Box key={list._id} p={5} shadow="md" borderWidth="1px" borderRadius="md" width='100%'>
                            <Text fontWeight="bold" onClick={() => toggleList(list._id)} cursor="pointer">
                                {list.name} - Created by {list.createdBy.name}
                            </Text>
                            <Collapse in={expandedListId === list._id} animateOpacity>
                                <Text mt={4}>{list.description}</Text>
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
        </Center >
    );
};


export default PublicListView;