const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize in-memory SQLite database
const db = new Database(':memory:');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    priority TEXT DEFAULT 'P3' CHECK (priority IN ('P1', 'P2', 'P3')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert some initial data
const initialItems = [
  { name: 'Item 1', priority: 'P3' },
  { name: 'Item 2', priority: 'P3' },
  { name: 'Item 3', priority: 'P3' }
];
const insertStmt = db.prepare('INSERT INTO items (name, priority) VALUES (?, ?)');

initialItems.forEach(item => {
  insertStmt.run(item.name, item.priority);
});

console.log('In-memory database initialized with sample data');

// API Routes
app.get('/api/items', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM items ORDER BY created_at DESC').all();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

app.post('/api/items', (req, res) => {
  try {
    const { name, priority = 'P3' } = req.body;
    
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Item name is required' });
    }
    
    if (priority && !['P1', 'P2', 'P3'].includes(priority)) {
      return res.status(400).json({ error: 'Priority must be P1, P2, or P3' });
    }
    
    const result = insertStmt.run(name, priority);
    const id = result.lastInsertRowid;
    
    const newItem = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// PUT endpoint to update item priority
app.put('/api/items/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;
    
    if (!priority || !['P1', 'P2', 'P3'].includes(priority)) {
      return res.status(400).json({ error: 'Priority must be P1, P2, or P3' });
    }
    
    const updateStmt = db.prepare('UPDATE items SET priority = ? WHERE id = ?');
    const result = updateStmt.run(priority, id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const updatedItem = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

module.exports = { app, db, insertStmt };