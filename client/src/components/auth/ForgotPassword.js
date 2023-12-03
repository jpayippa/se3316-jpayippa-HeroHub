import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, FormControl, FormLabel, Input, useToast } from '@chakra-ui/react';
import { auth } from '../../firebase/firebase-config'; // Adjust the import path as necessary
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const toast = useToast();

   
    

    const handleResetPassword = async () => {

        if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
            toast({
                title: 'Invalid Email',
                description: 'Please enter a valid email address.',
                status: 'warning',
                isClosable: true,
            });
            return;
        }
        try {
            await sendPasswordResetEmail(auth,email);
            toast({
                title: 'Password Reset Email Sent',
                description: 'Check your inbox/spam folder to reset your password.',
                status: 'success',
                isClosable: true,
            });
            onClose(); // Close the modal
        } catch (error) {
            console.error("Error sending password reset email: ", error);
            toast({
                title: 'Error',
                description: `Failed to send password reset email: ${error.message}`,
                status: 'error',
                isClosable: true,
            });
        }
    };
    

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Reset Password</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl id="email">
                        <FormLabel>Email Address</FormLabel>
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={handleResetPassword}>
                        Send Reset Request
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ForgotPasswordModal;
