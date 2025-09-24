import React from 'react';
import { Box, Typography } from '@mui/material';

const tagStyles = {
  default: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
  },
  experiment: {
    backgroundColor: '#e0e7ff',
    color: '#4338ca',
  },
  insight: {
    backgroundColor: '#ccfbf1',
    color: '#0f766e',
  },
  recommendation: {
    backgroundColor: '#fce7f3',
    color: '#db2777',
  },
};

const Tag = ({ label, type = 'default', small = false }) => {
  const style = tagStyles[type] || tagStyles.default;

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: small ? 1 : 1.5,
        py: small ? 0.25 : 0.5,
        borderRadius: '9999px',
        backgroundColor: style.backgroundColor,
        color: style.color,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: 'medium',
          fontSize: small ? '0.7rem' : '0.75rem',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default Tag;