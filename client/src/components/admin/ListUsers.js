import React, { useState, useEffect } from 'react';
import {
  Box, Collapse, Button, VStack, Text, Flex, Switch, useToast
} from '@chakra-ui/react';

const UserSListView = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const toast = useToast();

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
    <VStack spacing={4}>
      {users.map(user => (
        <Box key={user._id} p={4} borderWidth="1px" borderRadius="lg" w="full">
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontWeight="bold" onClick={() => toggleUserDetails(user._id)}>
              {user.nickname} - {user.email}
            </Text>
            <Button onClick={() => handleToggleDisable(user._id, user.isDisabled)}>
              {user.isDisabled ? 'Enable' : 'Disable'}
            </Button>
          </Flex>
          <Collapse in={expandedUserId === user._id}>
            <Box mt={4}>
              <Text>Role: {user.role}</Text>
              <Text>Email Verified: {user.verified ? 'Yes' : 'No'}</Text>
              <Flex alignItems="center">
                <Text mr={2}>Disabled:</Text>
                <Switch
                  isChecked={user.isDisabled}
                  onChange={() => handleToggleDisable(user._id, user.isDisabled)}
                />
              </Flex>
            </Box>
          </Collapse>
        </Box>
      ))}
    </VStack>
  );
};

export default UserSListView;
