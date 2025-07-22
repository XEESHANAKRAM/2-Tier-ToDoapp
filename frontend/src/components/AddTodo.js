import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper
} from '@mui/material';
import { Add } from '@mui/icons-material';

const AddTodo = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim()) {
      setLoading(true);
      try {
        await onAdd(text.trim());
        setText('');
      } catch (error) {
        console.error('Error adding todo:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Box component="form" onSubmit={handleSubmit} display="flex" gap={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Add a new task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading || !text.trim()}
          startIcon={<Add />}
          sx={{ minWidth: 100 }}
        >
          Add
        </Button>
      </Box>
    </Paper>
  );
};

export default AddTodo;