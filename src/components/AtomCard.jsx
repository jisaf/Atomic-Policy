import React from 'react';
import { Card, CardActionArea, CardContent, Typography, Box, Chip } from '@mui/material';
import { Link as LinkIcon, Tag as TagIcon } from '@mui/icons-material';

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
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardActionArea onClick={() => onSelect(atom)} sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconComponent fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {typeConfig.label}
              </Typography>
            </Box>
            {linkedAtoms.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                <LinkIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption">{linkedAtoms.length}</Typography>
              </Box>
            )}
          </Box>

          <Typography variant="h6" component="h3" sx={{ mb: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {atom.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
            {getDisplayContent()}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {atom.tags.slice(0, 3).map(tag => (
              <Chip key={tag} icon={<TagIcon fontSize="small" />} label={tag} size="small" />
            ))}
            {atom.tags.length > 3 && (
              <Typography variant="caption" color="text.secondary">
                +{atom.tags.length - 3} more
              </Typography>
            )}
          </Box>

          <Typography variant="caption" color="text.secondary">
            {new Date(atom.timestamp).toLocaleDateString()}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default AtomCard;
