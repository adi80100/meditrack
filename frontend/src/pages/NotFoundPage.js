import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const NotFoundPage = () => (
  <Container>
    <Box mt={10} textAlign="center">
      <Typography variant="h3" color="error" gutterBottom>
        404
      </Typography>
      <Typography variant="h5">
        Page Not Found
      </Typography>
    </Box>
  </Container>
);

export default NotFoundPage; 