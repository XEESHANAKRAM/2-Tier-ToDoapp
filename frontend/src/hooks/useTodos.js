import { useState, useCallback } from 'react';
import api from '../services/api';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTodo = useCallback(async (text) => {
    try {
      const response = await api.post('/todos', { text });
      setTodos(prev => [response.data, ...prev]);
    } catch (error) {
      console.error('Error adding todo:', error);
      throw error;
    }
  }, []);

  const updateTodo = useCallback(async (id, updates) => {
    try {
      const response = await api.put(`/todos/${id}`, updates);
      setTodos(prev => 
        prev.map(todo => 
          todo.id === id ? response.data : todo
        )
      );
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }, []);

  const deleteTodo = useCallback(async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }, []);

  return {
    todos,
    loading,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo
  };
};