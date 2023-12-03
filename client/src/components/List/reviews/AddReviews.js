import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, FormControl, FormLabel, Input, Textarea, useToast } from '@chakra-ui/react';

const AddReviewModal = ({ isOpen, onClose, listId }) => {
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const toast = useToast();

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                 },
                body: JSON.stringify({ rating, comment, heroListId: listId }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to submit review');
            }

            toast({
                title: 'Review added successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            onClose(); // Close the modal
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

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add a Review</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl id="rating" isRequired>
                        <FormLabel>Rating</FormLabel>
                        <Input type="number" value={rating} onChange={(e) => setRating(e.target.value)} />
                    </FormControl>
                    <FormControl id="comment" mt={4}>
                        <FormLabel>Comment</FormLabel>
                        <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={handleSubmit}>
                        Submit Review
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddReviewModal;
