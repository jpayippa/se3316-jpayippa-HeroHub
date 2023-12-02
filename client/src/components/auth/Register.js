import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Center, Text } from '@chakra-ui/react';
import { useCreateAccount } from '../../hooks/auth'; // Adjust the path as necessary

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState(''); // Define email state
    const [password, setPassword] = useState(''); // Define password state
    const { error, createAccount } = useCreateAccount();

    const registerUser = async (event) => {
        event.preventDefault();
        // Use the createAccount hook here
        await createAccount(email, password);
        // Additional logic
    

        // If there's no error, proceed with additional logic (e.g., updating the user profile)
        if (!error) {
            console.log('User registered successfully');
            // Additional logic here
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
