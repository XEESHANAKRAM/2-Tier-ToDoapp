const db = require('../models/database');
const logger = require('../utils/logger');

class TodoController {
  async getAllTodos(req, res) {
    try {
      const userId = req.user.id;
      const [todos] = await db.execute(
        'SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      
      res.json(todos);
    } catch (error) {
      logger.error('Error fetching todos:', error);
      res.status(500).json({ error: 'Failed to fetch todos' });
    }
  }

  async createTodo(req, res) {
    try {
      const { text } = req.body;
      const userId = req.user.id;

      if (!text || text.trim().length === 0) {
        return res.status(400).json({ error: 'Todo text is required' });
      }

      const [result] = await db.execute(
        'INSERT INTO todos (text, user_id, completed, created_at) VALUES (?, ?, false, NOW())',
        [text.trim(), userId]
      );

      const [newTodo] = await db.execute(
        'SELECT * FROM todos WHERE id = ?',
        [result.insertId]
      );

      logger.info(`Todo created: ${result.insertId}`);
      res.status(201).json(newTodo[0]);
    } catch (error) {
      logger.error('Error creating todo:', error);
      res.status(500).json({ error: 'Failed to create todo' });
    }
  }

  async updateTodo(req, res) {
    try {
      const { id } = req.params;
      const { text, completed } = req.body;
      const userId = req.user.id;

      // Check if todo exists and belongs to user
      const [existingTodo] = await db.execute(
        'SELECT * FROM todos WHERE id = ? AND user_id = ?',
        [id, userId]
      );

      if (existingTodo.length === 0) {
        return res.status(404).json({ error: 'Todo not found' });
      }

      // Build update query dynamically
      let updateFields = [];
      let updateValues = [];

      if (text !== undefined) {
        updateFields.push('text = ?');
        updateValues.push(text.trim());
      }

      if (completed !== undefined) {
        updateFields.push('completed = ?');
        updateValues.push(completed);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
      }

      updateFields.push('updated_at = NOW()');
      updateValues.push(id, userId);

      await db.execute(
        `UPDATE todos SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`,
        updateValues
      );

      const [updatedTodo] = await db.execute(
        'SELECT * FROM todos WHERE id = ?',
        [id]
      );

      logger.info(`Todo updated: ${id}`);
      res.json(updatedTodo[0]);
    } catch (error) {
      logger.error('Error updating todo:', error);
      res.status(500).json({ error: 'Failed to update todo' });
    }
  }

  async deleteTodo(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const [result] = await db.execute(
        'DELETE FROM todos WHERE id = ? AND user_id = ?',
        [id, userId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Todo not found' });
      }

      logger.info(`Todo deleted: ${id}`);
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting todo:', error);
      res.status(500).json({ error: 'Failed to delete todo' });
    }
  }

  async getStats(req, res) {
    try {
      const userId = req.user.id;
      
      const [stats] = await db.execute(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END) as pending
        FROM todos WHERE user_id = ?
      `, [userId]);

      res.json(stats[0]);
    } catch (error) {
      logger.error('Error fetching stats:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  }
}

module.exports = new TodoController();