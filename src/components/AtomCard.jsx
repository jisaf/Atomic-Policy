import React, { useState } from 'react';
import { Box, Typography, Collapse, Paper, Chip } from '@mui/material';
import { ChevronDown, ChevronRight, Send, Edit, History } from 'lucide-react';
import Tag from './Tag';
import IconButton from './IconButton';

const cardStyles = {
  fact: {
    backgroundColor: '#fff',
    borderColor: '#d1d5db',
  },
  insight: {
    backgroundColor: '#eef2ff',
    borderColor: '#4338ca',
  },
  recommendation: {
    backgroundColor: '#fdf2f8',
    borderColor: '#db2777',
  },
};

const CardHeader = ({ isExpanded, onToggle, title, atom, titleRef }) => (
  <Box
    onClick={onToggle}
    sx={{
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      p: 1.5,
      borderBottom: isExpanded ? 1 : 0,
      borderColor: 'grey.300',
    }}
  >
    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
    <Typography ref={titleRef} variant="subtitle1" sx={{ ml: 1, fontWeight: 600, flexGrow: 1 }}>
      {title}
    </Typography>
    {atom.type === 'insight' && (
      <Chip label={`PROVES +${atom.proves || 0}`} color="success" size="small" sx={{ fontWeight: 'bold' }} />
    )}
  </Box>
);

const AtomCard = React.forwardRef(({ atom, onSelect, isExpanded: initiallyExpanded = false, headerRef }, ref) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const titleRef = React.useRef();

  React.useImperativeHandle(headerRef, () => ({
    getBoundingClientRect: () => titleRef.current?.getBoundingClientRect(),
  }));

  const cardStyle = atom.type === 'fact'
    ? cardStyles.insight
    : atom.type === 'insight'
      ? cardStyles.recommendation
      : cardStyles.fact;

  const handleToggle = () => {
    if (!initiallyExpanded) {
      setIsExpanded(prev => !prev);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Paper
      ref={ref}
      elevation={1}
      sx={{
        width: '100%',
        border: 1,
        borderColor: cardStyle.borderColor,
        borderRadius: 2,
        backgroundColor: cardStyle.backgroundColor,
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <CardHeader
        isExpanded={isExpanded}
        onToggle={handleToggle}
        title={atom.title}
        atom={atom}
      />
      <Collapse in={isExpanded}>
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>{atom.content}</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {atom.tags.map((tag, index) => (
              <Tag key={index} label={tag.label} type={tag.type} />
            ))}
          </Box>
          {atom.type === 'insight' && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" color="text.secondary">Supporting 2 experiments:</Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton icon={Send} />
                  <IconButton icon={Edit} />
                  <IconButton icon={History} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Tag label="FREE SHIPPING ROLLOUT FEAT" type="experiment" small />
                <Tag label="FRANCE - FREE SHIPPING MULTIVARIATE" type="experiment" small />
                <Tag label="UK - FREE SHIPPING MULTIVARIATE" type="experiment" small />
              </Box>
            </Box>
          )}
        </Box>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 1.5,
          borderTop: 1,
          borderColor: 'grey.200',
          backgroundColor: 'rgba(0,0,0,0.02)'
        }}>
          <Typography variant="caption" color="text.secondary">
            Created: {formatDate(atom.timestamp)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Edited: 17 May 2024 <a href="#">History</a>
          </Typography>
        </Box>
      </Collapse>
    </Paper>
  );
});

export default AtomCard;