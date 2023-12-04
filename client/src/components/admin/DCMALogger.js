import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, Textarea } from '@chakra-ui/react';

const DMCALogger = () => {
    const [type, setType] = useState('');
    const [reviewId, setReviewId] = useState('');
    const [details, setDetails] = useState('');
  
    const handleSubmit = () => {
      fetch('/api/dmca-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header
        },
        body: JSON.stringify({ type, reviewId, details })
      })
        .then(() => alert('DMCA activity logged successfully'))
        .catch(error => console.error('Error logging DMCA activity:', error));
    };
  
    return (
      <Box>
        <FormControl>
          <FormLabel>Type</FormLabel>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="request">Takedown Request</option>
            <option value="notice">Infringement Notice</option>
            <option value="dispute">Dispute Claim</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Review ID</FormLabel>
          <Input value={reviewId} onChange={(e) => setReviewId(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Details</FormLabel>
          <Textarea value={details} onChange={(e) => setDetails(e.target.value)} />
        </FormControl>
        <Button onClick={handleSubmit}>Log Activity</Button>
      </Box>
    );
  };
  

  export default DMCALogger;