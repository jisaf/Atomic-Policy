import React from 'react';
import {
  Modal, Box, Typography, Chip, Button, Select, MenuItem,
  List, ListItem, ListItemText, Divider, IconButton, FormControl, InputLabel
} from '@mui/material';
import { Close } from '@mui/icons-material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 700,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 0,
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '90vh',
};

const AtomDetailModal = ({ atom, onClose, atomTypes, atoms, onLink }) => {
  if (!atom) return null;
  const typeConfig = atomTypes[atom.type];
  const IconComponent = typeConfig.icon;
  const linkedAtoms = (atom.linkedTo || []).map(id => atoms.find(a => a.id === id)).filter(Boolean);

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">{atom.title}</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Box sx={{ p: 3, overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <IconComponent size={20} />
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>{typeConfig.label}</Typography>
          </Box>
          <Typography paragraph sx={{ whiteSpace: 'pre-wrap' }}>{atom.content}</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {atom.tags.map(tag => <Chip key={tag} label={tag} />)}
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>Linked Atoms</Typography>
            <List dense>
              {linkedAtoms.length > 0 ? (
                linkedAtoms.map(linked => <ListItem key={linked.id}><ListItemText primary={linked.title} /></ListItem>)
              ) : (
                <ListItem><ListItemText secondary="No linked atoms." /></ListItem>
              )}
            </List>
          </Box>
        </Box>
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <FormControl fullWidth>
            <InputLabel>Link another atom</InputLabel>
            <Select
              label="Link another atom"
              onChange={(e) => onLink(atom.id, e.target.value)}
              defaultValue=""
              data-testid="link-atom-select"
            >
              {atoms
                .filter(a => a.id !== atom.id && !(atom.linkedTo || []).includes(a.id))
                .map(a => (
                  <MenuItem key={a.id} value={a.id}>{a.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Modal>
  );
};

export default AtomDetailModal;
