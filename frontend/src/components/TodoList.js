import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Chip,
  CircularProgress
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';

const TodoList = ({ todos, loading, onUpdate, onDelete }) => {
  const [editDialog, setEditDialog] = useState({ open: false, todo: null });
  const [editText, setEditText] = useState('');

  const handleEdit = (todo) => {
    setEditDialog({ open: true, todo });
    setEditText(todo.text);
  };

  const handleEditSave = () => {
    if (editText.trim()) {
      onUpdate(editDialog.todo.id, { text: editText.trim() });
      setEditDialog({ open: false, todo: null });
      setEditText('');
    }
  };

  const handleToggleComplete = (todo) => {
    onUpdate(todo.id, { completed: !todo.completed });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (todos.length === 0) {
    return (
      <Box textAlign="center" mt={4}>
        <Add sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No tasks yet. Add your first task above!
        </Typography>
      </Box>
    );
  }

  const completedTodos = todos.filter(todo => todo.completed);
  const pendingTodos = todos.filter(todo => !todo.completed);

  return (
    <>
      <Box mb={2}>
        <Chip 
          label={`${pendingTodos.length} pending`} 
          color="primary" 
          variant="outlined"
          sx={{ mr: 1 }}
        />
        <Chip 
          label={`${completedTodos.length} completed`} 
          color="success" 
          variant="outlined"
        />
      </Box>
      
      <List>
        {[...pendingTodos, ...completedTodos].map((todo) => (
          <ListItem 
            key={todo.id} 
            sx={{ 
              bgcolor: todo.completed ? 'grey.100' : 'white',
              mb: 1,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.300'
            }}
          >
            <Checkbox
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo)}
              color="primary"
            />
            <ListItemText
              primary={todo.text}
              sx={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? 'text.secondary' : 'text.primary'
              }}
            />
            <ListItemSecondaryAction>
              <IconButton 
                edge="end" 
                onClick={() => handleEdit(todo)}
                disabled={todo.completed}
              >
                <Edit />
              </IconButton>
              <IconButton 
                edge="end" 
                onClick={() => onDelete(todo.id)}
                color="error"
              >
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, todo: null })}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleEditSave()}
            margin="normal"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, todo: null })}>
            Cancel
          </Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TodoList;