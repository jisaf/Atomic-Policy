import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const AtomDetailModal = ({ atom, onClose, atomTypes, atoms, onLink }) => {
  if (!atom) return null;
  const typeConfig = atomTypes[atom.type];
  const linkedAtoms = (atom.linkedTo || []).map(id => atoms.find(a => a.id === id)).filter(Boolean);

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {atom.title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <typeConfig.icon />
          <Typography variant="h6">{typeConfig.label}</Typography>
        </Box>
        <Typography paragraph>{atom.content}</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {atom.tags.map(tag => (
            <Chip key={tag} label={tag} />
          ))}
        </Box>
        <Box>
          <Typography variant="h6">Linked Atoms</Typography>
          <List dense>
            {linkedAtoms.map(linked => (
              <ListItem key={linked.id}>
                <ListItemText primary={linked.title} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="link-atom-label">Link another atom</InputLabel>
            <Select
              labelId="link-atom-label"
              label="Link another atom"
              onChange={e => onLink(atom.id, e.target.value)}
              defaultValue=""
            >
              {atoms
                .filter(a => a.id !== atom.id && !(atom.linkedTo || []).includes(a.id))
                .map(a => (
                  <MenuItem key={a.id} value={a.id}>
                    {a.title}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AtomDetailModal;
