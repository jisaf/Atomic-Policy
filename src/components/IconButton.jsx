import React from 'react';
import { Box } from '@mui/material';

const IconButton = ({ icon: Icon, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        borderRadius: '50%',
        backgroundColor: '#fff',
        border: 1,
        borderColor: 'grey.300',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'grey.100',
        },
      }}
    >
      <Icon size={16} color="#64748b" />
    </Box>
  );
};

export default IconButton;