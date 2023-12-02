import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Center, Text } from '@chakra-ui/react';
import { useLogin } from '../../hooks/auth'; // Adjust the path as necessary

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState(''); // Local error state
    const { isLoading, error: firebaseError, login } = useLogin();

    const handleLogin = async () => {
        if (!email || !password) {
            setLocalError('Please enter both email and password.');
            return;
        }

        setLocalError(''); // Clear any existing local error
        await login(email, password);
    };

    return (
        <Center py={6}>
            <Box w="full" maxW="md" p={4} borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="lg">
                <VStack spacing={4}>
                    <FormControl isInvalid={localError || firebaseError}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>
                    <FormControl isInvalid={localError || firebaseError}>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormControl>
                    {(localError || firebaseError) && <Text color="red.500">{localError || firebaseError}</Text>}
                    <Button colorScheme="blue" onClick={handleLogin} isLoading={isLoading}>
                        Login
                    </Button>
                </VStack>
            </Box>
        </Center>
    );
};

export default Login;
