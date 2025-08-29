import React from 'react';
import { Link2, Tag } from 'lucide-react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

const AtomCard = ({ atom, atomTypes, onSelect, atoms }) => {
  const typeConfig = atomTypes[atom.type];
  const IconComponent = typeConfig.icon;
  const linkedAtoms = (atom.linkedTo || []).map(id => atoms.find(a => a.id === id)).filter(Boolean);

  const getDisplayContent = () => {
    if (atom.type === 'experiment' && atom.billNumber && atom.sectionTitle) {
      return `${atom.billNumber} - ${atom.sectionTitle}`;
    } else if (atom.type === 'recommendation' && atom.fileReference) {
      return `📁 ${atom.fileReference}${atom.description ? ` - ${atom.description}` : ''}`;
    }
    return atom.content;
  };

  return (
    <Card
      onClick={() => onSelect(atom)}
      sx={{
        cursor: 'pointer',
        border: 2,
        borderColor: typeConfig.borderColor,
        bgcolor: typeConfig.color,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.3s',
        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconComponent size={16} />
            <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
              {typeConfig.label}
            </Typography>
          </Box>
          {linkedAtoms.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
              <Link2 size={14} />
              <Typography variant="caption">{linkedAtoms.length}</Typography>
            </Box>
          )}
        </Box>

        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', minHeight: '3.5rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }}>
          {atom.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '3rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
         }}>
          {getDisplayContent()}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2, minHeight: '1.5rem' }}>
          {atom.tags.slice(0, 3).map(tag => (
            <Chip
              key={tag}
              icon={<Tag size={12} />}
              label={tag}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.7)' }}
            />
          ))}
          {atom.tags.length > 3 && (
            <Typography variant="caption" sx={{ alignSelf: 'center' }}>
              +{atom.tags.length - 3} more
            </Typography>
          )}
        </Box>
      </CardContent>
      <CardContent sx={{ pt: 0 }}>
        <Typography variant="caption" color="text.secondary">
          {new Date(atom.timestamp).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AtomCard;
