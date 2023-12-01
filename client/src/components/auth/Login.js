import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Center, Text } from '@chakra-ui/react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        // Perform validation and sanitization logic here
        setError(''); // Clear error message
        // Proceed with login logic
    };

    return (
        <Center py={6}>
            <Box w="full" maxW="md" p={4} borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="lg">
                <VStack spacing={4}>
                    <FormControl isInvalid={error}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>
                    <FormControl isInvalid={error}>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormControl>
                    {error && <Text color="red.500">{error}</Text>}
                    <Button colorScheme="blue" onClick={handleLogin}>
                        Login
                    </Button>
                </VStack>
            </Box>
        </Center>
    );
};

export default Login;
