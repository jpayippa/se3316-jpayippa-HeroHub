import React, { useState } from 'react';
import { 
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, 
  ModalBody, ModalFooter, Button, FormControl, FormLabel, Input, 
  Textarea, useToast, HStack, Text 
} from '@chakra-ui/react';

const AddReviewModal = ({ isOpen, onClose, listId }) => {
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const [ratingError, setRatingError] = useState('');
    const toast = useToast();

    const validateRating = (rating) => {
        const ratingValue = parseFloat(rating);
        return !isNaN(ratingValue) && ratingValue >= 0 && ratingValue <= 5 && /^\d(\.\d)?$/.test(rating);
    };

    const handleSubmit = async () => {
        if (!validateRating(rating)) {
            setRatingError('Rating must be a number between 0 to 5 with at most one decimal place.');
            return;
        }

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
        setRating('');
        setComment('');
        setRatingError('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add a Review</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl id="rating" isRequired isInvalid={!!ratingError}>
                        <FormLabel>Rating</FormLabel>
                        <HStack>
                            <Input type="number" step="0.1" min="0" max="5" value={rating} onChange={(e) => {
                                setRatingError('');
                                setRating(e.target.value);
                            }} />
                            <Text>/5</Text>
                        </HStack>
                        {ratingError && <Text color="red.500">{ratingError}</Text>}
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
