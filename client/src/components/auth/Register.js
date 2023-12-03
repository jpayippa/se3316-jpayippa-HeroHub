import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Center, Text, Link, FormErrorMessage } from '@chakra-ui/react';
import { useCreateAccount } from '../../hooks/auth'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';
import { LOGIN } from '../../router/Approuter';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const { error: createAccountError, createAccount } = useCreateAccount();
    const [error, setError] = useState(''); // Define a local error state
    const navigate = useNavigate(); // Initialize useNavigate

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return passwordRegex.test(password);
    };

    const registerUser = async (event) => {
        event.preventDefault();

        if (!name || !email || !password) {
            setError('Please fill in all fields');
            return;
        }

        // Reset validation errors
        setEmailError('');
        setPasswordError('');

        // Perform validation checks
        if (!validateEmail(email)) {
            setEmailError('Invalid email format');
            return;
        }
        if (!validatePassword(password)) {
            setPasswordError('Password must be at least 6 characters and include uppercase, lowercase, numbers, and special characters.');
            return;
        }

        const username = name;

        await createAccount(email, password, username);

       

    };

    const goToLogin = () => {
        navigate(LOGIN); // Use the correct path for your login route
    };

    return (
        <Center h="100vh">
            <Box w="full" maxW="md" p={4} borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="lg">
                <form onSubmit={registerUser}>
                    <VStack spacing={4}>
                        {/* Name input */}
                        <FormControl>
                            <FormLabel>Nick Name</FormLabel>
                            <Input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                            />
                        </FormControl>
                        {/* Email input */}
                        <FormControl isInvalid={!!emailError}>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {emailError && <FormErrorMessage>{emailError}</FormErrorMessage>}
                        </FormControl>
                        {/* Password input */}
                        <FormControl isInvalid={!!passwordError}>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {passwordError && <FormErrorMessage>{passwordError}</FormErrorMessage>}
                        </FormControl>
                        {/* Error message */}
                        {error && <Text color="red.500">{error}</Text>}
                        {/* Register button */}
                        <Button type="submit" colorScheme="blue">Register</Button>
                    </VStack>
                </form>
                <Text mt={4} textAlign="center">
                    Already have an account?{' '}
                    <Link color="blue.500" onClick={goToLogin}>
                        Log In
                    </Link>.
                </Text>
            </Box>
        </Center>
    );
};

export default Register;
