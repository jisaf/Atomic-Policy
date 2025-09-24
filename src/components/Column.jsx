import React from 'react';
import { Box, Typography } from '@mui/material';

const Column = ({ title, children }) => {
  return (
    <Box sx={{
      minWidth: 300,
      width: 350,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    }}>
      <Typography
        variant="h6"
        sx={{
          textAlign: 'left',
          fontWeight: 'bold',
          color: '#475569',
          borderBottom: 2,
          borderColor: '#e2e8f0',
          pb: 1,
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
};

export default Column;