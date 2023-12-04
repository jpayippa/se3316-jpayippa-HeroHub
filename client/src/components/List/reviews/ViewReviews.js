import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Box,
    Text,
    VStack,
    Collapse,
    Switch,
    useToast
} from '@chakra-ui/react';

const ReviewModal = ({ isOpen, onClose, listId, admin = false }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedReviewId, setExpandedReviewId] = useState(null);
    const toast = useToast();

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/reviews/heroList/${listId}`);
                const data = await response.json();
                setReviews(data.filter(review => admin || review.visible));
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchReviews();
        }
    }, [isOpen, listId, admin]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }; // Customize as needed
        return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
    };

    const toggleReview = (id) => {
        setExpandedReviewId(prevId => (prevId === id ? null : id));
    };

    const handleVisibilityChange = async (reviewId, visible) => {
        try {
            const token = await localStorage.getItem('token');
            const response = await fetch(`/api/reviews/${reviewId}/visibility`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                 },
                body: JSON.stringify({ visible })
            });

            if (!response.ok) {
                throw new Error('Failed to update visibility');
            }

            // Update local state to reflect the change
            setReviews(reviews.map(review => review._id === reviewId ? { ...review, visible } : review));
            toast({
                title: 'Visibility Updated',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update visibility.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Reviews</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {loading ? (
                        <Text>Loading...</Text>
                    ) : (
                        <VStack spacing={4}>
                            {reviews.map((review) => (
                                <Box key={review._id} p={4} borderWidth="1px" borderRadius="lg">
                                    {admin && (<>
                                        <text>Visible: </text>
                                        <Switch
                                            isChecked={review.visible}
                                            onChange={() => handleVisibilityChange(review._id, !review.visible)}
                                            colorScheme="green"
                                            mb={2}
                                        />
                                        </>
                                    )}
                                    <Text fontWeight="bold" onClick={() => toggleReview(review._id)} cursor="pointer">
                                        {`Rating: ${review.rating}/5 - ${review.createdBy}`}
                                    </Text>
                                    <Collapse in={expandedReviewId === review._id} animateOpacity>
                                        <Box mt={2}>
                                            <Text>{review.comment}</Text>
                                            <Text fontSize="sm">Created on: {formatDate(review.createdAt)}</Text>
                                        </Box>
                                    </Collapse>
                                </Box>
                            ))}
                        </VStack>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ReviewModal;
