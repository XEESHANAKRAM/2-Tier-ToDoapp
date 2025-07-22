import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Button,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import Auth from './components/Auth';
import { useTodos } from './hooks/useTodos';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [user, setUser] = useState(null);
  const { todos, loading, addTodo, updateTodo, deleteTodo, fetchTodos } = useTodos();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
      fetchTodos();
    }
  }, [fetchTodos]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    fetchTodos();
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Auth onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <CheckCircle sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todo App
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            My Todo List
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your tasks efficiently
          </Typography>
        </Box>
        
        <AddTodo onAdd={addTodo} />
        <TodoList 
          todos={todos}
          loading={loading}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;