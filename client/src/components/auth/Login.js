import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Center, Text, Link } from '@chakra-ui/react';
import { useLogin } from '../../hooks/auth'; // Adjust the path as necessary
import { ADMINVIEW, DASHBOARD, REGISTER } from '../../router/Approuter';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebase-config';
import ForgotPasswordModal from './ForgotPassword';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const { isLoading, error: firebaseError, login } = useLogin();
    const navigate = useNavigate(); 

    const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

    const openForgotPasswordModal = () => setIsForgotPasswordModalOpen(true);
    const closeForgotPasswordModal = () => setIsForgotPasswordModalOpen(false);

    const handleLogin = async () => {
        if (!email || !password) {
            setLocalError('Please enter both email and password.');
            return;
        }

        const emailLowerCase = email.toLowerCase();

        try {
            setLocalError(''); // Clear any existing local error



            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailLowerCase, password }),
            });

            const data = await response.json();

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('role', data.user.role);
            localStorage.setItem('email', data.user.email);

            if (!response.ok) {
                throw new Error(data.error || 'Failed to login');
            }

            if (data.user.isDisabled) {
                alert('Your account is disabled. Please contact the site administrator.');
                return;
            }

            await login(emailLowerCase, password);

            // Handle email verification
            if (!data.user.verified) {

                await auth.currentUser.reload();
                const firebaseUser = auth.currentUser;

                if (firebaseUser.emailVerified) {
                    // If the email is now verified, update the verification status in your database
                    await fetch('/api/users/update-verification', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ firebaseId: firebaseUser.uid }),
                    });
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('role');
                    localStorage.removeItem('email');
                    const response = await fetch('/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: emailLowerCase, password }),
                    });
                    const data = await response.json();


                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    localStorage.setItem('role', data.user.role);
                    localStorage.setItem('email', data.user.email);
                    

                    if (data.user.role === 'admin' || data.user.role === 'GrandAdmin') {
                        
                        navigate(ADMINVIEW);
                    }else if (data.user.role === 'user') {
                        navigate(DASHBOARD);
                    }
                } else {
                    alert('Please verify your email before logging in.');
                    navigate('/'); // or any other route you prefer
                    return;
                }
            } else {
                if (data.user.role === 'admin' || data.user.role === 'GrandAdmin') {
                        
                    navigate(ADMINVIEW);
                }else if (data.user.role === 'user') {
                    navigate(DASHBOARD);
                }
            }




        } catch (err) {
            setLocalError(err.message);
        }
    };

    const goToRegister = () => {
        navigate(REGISTER);
    }

    return (
        <Center h="100vh">
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
                
                <Text mt={2} textAlign="center">
                Forgot your password? 
                <Link color="blue.500" onClick={openForgotPasswordModal}>
                    Reset it here
                </Link>.
            </Text>
            <ForgotPasswordModal isOpen={isForgotPasswordModalOpen} onClose={closeForgotPasswordModal} />

                <Text mt={4} textAlign="center">
                    Don't have an account?{' '}
                    <Link color="blue.500" onClick={goToRegister}>
                        Register
                    </Link>.
                </Text>
            </Box>
        </Center>
    );
};

export default Login;
