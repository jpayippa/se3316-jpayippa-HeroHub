import React, { useState, useEffect } from 'react';
import {
    Box, Collapse, VStack, Text, Flex, Switch, useToast, Center, Heading, IconButton, Tooltip
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';


const UserSListView = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedUserId, setExpandedUserId] = useState(null);
    const toast = useToast();
    const navigate = useNavigate();
    const loggedInUserRole = localStorage.getItem('role');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/users', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const toggleUserDetails = (userId) => {
        setExpandedUserId(expandedUserId === userId ? null : userId);
    };

    const handleToggleDisable = async (userId, isDisabled) => {
        try {
            const response = await fetch(`/api/users/${userId}/disable`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ isDisabled: !isDisabled })
            });


            if (!response.ok) {
                throw new Error('Failed to update user status');
            }

            setUsers(users.map(user => user._id === userId ? { ...user, isDisabled: !user.isDisabled } : user));
            toast({
                title: `User ${isDisabled ? 'enabled' : 'disabled'} successfully`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            navigate(0)
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

    const handleToggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';

        try {
            const response = await fetch(`/api/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ newRole })
            });

            if (!response.ok) {
                throw new Error('Failed to update user role');
            }

            setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
            toast({
                title: `User role updated to ${newRole}`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            navigate(0);
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

    if (loading) {
        return <Text>Loading...</Text>;
    }

    return (
        <Center py={6}>
            <Box w="full" maxW="lg" p={6} borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="lg">
                <Heading as="h2" size="xl" mb={6} textAlign="center">User Management</Heading>
                <VStack spacing={6}>
                    {users.map(user => (
                        <Box key={user.id} p={5} borderWidth="1px" borderRadius="lg" w="full" boxShadow="md">
                            <Flex justifyContent="space-between" alignItems="center">
                                <Text fontWeight="bold" fontSize="lg" onClick={() => toggleUserDetails(user.id)}>
                                    {user.nickname} ({user.email})
                                </Text>
                                <Flex>
                                    <Tooltip label={user.isDisabled ? 'Enable User' : 'Disable User'}>
                                        <IconButton
                                            icon={user.isDisabled ? <CheckIcon /> : <CloseIcon />}
                                            onClick={() => handleToggleDisable(user.id, user.isDisabled)}
                                            colorScheme={user.isDisabled ? 'green' : 'red'}
                                            mr={2}
                                        />
                                    </Tooltip>
                                    {loggedInUserRole === 'GrandAdmin' && (
                                        <Tooltip label={user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}>
                                            <IconButton
                                                icon={<EditIcon />}
                                                onClick={() => handleToggleRole(user.id, user.role)}
                                                colorScheme={user.role === 'admin' ? 'orange' : 'blue'}
                                            />
                                        </Tooltip>
                                    )}
                                </Flex>
                            </Flex>
                            <Collapse in={expandedUserId === user.id} animateOpacity>
                                <Box mt={4} bg="gray.50" p={3} borderRadius="md">
                                    <Text fontSize="sm"><b>Role:</b> {user.role}</Text>
                                    <Text fontSize="sm"><b>Email Verified:</b> {user.verified ? 'Yes' : 'No'}</Text>
                                    <Flex alignItems="center" mt={2}>
                                        <Text fontSize="sm" mr={2}><b>Account Status:</b></Text>
                                        <Switch
                                            isChecked={user.isDisabled}
                                            onChange={() => handleToggleDisable(user.id, user.isDisabled)}
                                        />
                                    </Flex>
                                </Box>
                            </Collapse>
                        </Box>
                    ))}
                </VStack>
            </Box>
        </Center >
    );
};


export default UserSListView;
