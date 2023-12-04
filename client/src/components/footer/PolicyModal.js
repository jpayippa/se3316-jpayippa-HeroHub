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
    console.log("PolicyModal.js: policyTitle: ", policyTitle);
  const [policyContent, setPolicyContent] = useState('');

  useEffect(() => {
    // Fetch policy content based on the policyTitle
    fetch(`/api/policies/${policyTitle}`)
      .then((res) => res.json())
      .then((data) => setPolicyContent(data.content))
      .catch((error) => console.error('Error fetching policy:', error));
  }, [policyTitle]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{policyTitle}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text whiteSpace="pre-wrap">{policyContent}</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PolicyModal;
