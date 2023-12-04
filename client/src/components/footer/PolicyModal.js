import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
} from '@chakra-ui/react';

const PolicyModal = ({ isOpen, onClose, policyTitle = 'Acceptable Use Policy' }) => {
  const [policyContent, setPolicyContent] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');

  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
    } catch (error) {
      console.error('Error formatting date:', error);
      return ''; // or a default message like "Not available"
    }
  };

  useEffect(() => {
    fetch(`/api/policies/${policyTitle}`)
      .then((res) => res.json())
      .then((data) => {
        setPolicyContent(data.content);
        if (data.updated_at) {
          setLastUpdate(formatDate(data.updated_at));
        }
      })
      .catch((error) => console.error('Error fetching policy:', error));
  }, [policyTitle]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{policyTitle}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {lastUpdate && <Text fontWeight="bold">Last Updated: {lastUpdate}</Text>}
          <Text whiteSpace="pre-wrap">{policyContent}</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PolicyModal;
