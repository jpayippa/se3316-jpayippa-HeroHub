
import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';

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

        // Clear error message
        setError('');

        // Proceed with login logic
    };

    return (
        <Box p={4}>
            <VStack spacing={4} align="center">
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isInvalid={error}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        isInvalid={error}
                    />
                </FormControl>
                {error && <Box color="red">{error}</Box>}
                <Button colorScheme="blue" onClick={handleLogin}>
                    Login
                </Button>
            </VStack>
        </Box>
    );
};

export default Login;
