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
    Collapse
} from '@chakra-ui/react';

const ReviewModal = ({ isOpen, onClose, listId, admin = false }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedReviewId, setExpandedReviewId] = useState(null);

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
