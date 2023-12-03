import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Center, Text } from '@chakra-ui/react';
import { useCreateAccount } from '../../hooks/auth'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom'; 
import { LOGIN } from '../../router/Approuter';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { error: createAccountError, createAccount } = useCreateAccount();
    const [error, setError] = useState(''); // Define a local error state
    const navigate = useNavigate(); // Initialize useNavigate

    const registerUser = async (event) => {
        event.preventDefault();

        if (!name || !email || !password) {
            setError('Please fill in all fields');
            return;
        }

        await createAccount(email, password);

        const username = name;

        
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('User registered successfully');
                    navigate(LOGIN); 
                } else {
                    setError(data.error || 'Failed to register');
                }
            } catch (err) {
                setError('Failed to register');
            }
       
    };

    return (
        <Center py={6}>
            <Box w="full" maxW="md" p={4} borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="lg">
                <form onSubmit={registerUser}>
                    <VStack spacing={4}>
                        {/* Name input */}
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                            />
                        </FormControl>
                        {/* Email input */}
                        <FormControl isInvalid={!!error}>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                            />
                        </FormControl>
                        {/* Password input */}
                        <FormControl isInvalid={!!error}>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                            />
                        </FormControl>
                        {/* Error message */}
                        {error && <Text color="red.500">{error}</Text>}
                        {/* Register button */}
                        <Button type="submit" colorScheme="blue">Register</Button>
                    </VStack>
                </form>
            </Box>
        </Center>
    );
};

export default Register;
