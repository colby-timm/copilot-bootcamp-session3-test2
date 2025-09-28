import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState('');
  const [newItemPriority, setNewItemPriority] = useState('P3');

  useEffect(() => {
    fetchData();
  }, []);

  // Load tasks from localStorage and merge with backend data
  const loadFromLocalStorage = () => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        return JSON.parse(savedTasks);
      }
      return null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  };

  // Save tasks to localStorage
  const saveToLocalStorage = (tasks) => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/items');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      
      // Load existing tasks from localStorage to preserve priority changes
      const savedTasks = loadFromLocalStorage();
      const savedTasksMap = savedTasks ? 
        savedTasks.reduce((map, task) => {
          map[task.id] = task.priority;
          return map;
        }, {}) : {};

      // Map backend items to tasks, preserving saved priorities or defaulting to P3
      const tasksWithPriority = result.map(item => ({
        ...item,
        priority: savedTasksMap[item.id] || item.priority || 'P3'
      }));
      
      setData(tasksWithPriority);
      saveToLocalStorage(tasksWithPriority);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newItem }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      const result = await response.json();
      const newTask = {
        ...result,
        priority: newItemPriority
      };
      const updatedTasks = [...data, newTask];
      setData(updatedTasks);
      saveToLocalStorage(updatedTasks);
      setNewItem('');
      setNewItemPriority('P3');
    } catch (err) {
      setError('Error adding item: ' + err.message);
      console.error('Error adding item:', err);
    }
  };

  const handlePriorityChange = (itemId, newPriority) => {
    const updatedTasks = data.map(item => 
      item.id === itemId ? { ...item, priority: newPriority } : item
    );
    setData(updatedTasks);
    saveToLocalStorage(updatedTasks);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Frontend with Node Backend</h1>
        <p>Connected to in-memory database</p>
      </header>
      
      <main>
        <section className="add-item-section">
          <h2>Add New Item</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Enter New Item"
              />
              <button type="submit">Add</button>
            </div>
            <div className="priority-section">
              <div className="priority-options">
                {['P1', 'P2', 'P3'].map(priority => (
                  <label key={priority} className="priority-option">
                    <input
                      type="radio"
                      name="newItemPriority"
                      value={priority}
                      checked={newItemPriority === priority}
                      onChange={(e) => setNewItemPriority(e.target.value)}
                    />
                    <span className={`priority-label ${newItemPriority === priority ? 'selected' : ''}`}>
                      {priority}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </form>
        </section>

        <section className="items-section">
          <h2>Items from Database</h2>
          {loading && <p>Loading data...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
            <div className="items-list">
              {data.length > 0 ? (
                data.map((item) => (
                  <div key={item.id} className="item-row">
                    <span className="item-name">{item.name}</span>
                    <div className="item-priority">
                      {['P1', 'P2', 'P3'].map(priority => (
                        <label key={priority} className="priority-option">
                          <input
                            type="radio"
                            name={`priority-${item.id}`}
                            value={priority}
                            checked={item.priority === priority}
                            onChange={(e) => handlePriorityChange(item.id, e.target.value)}
                          />
                          <span className={`priority-label ${item.priority === priority ? 'selected' : ''}`}>
                            {priority}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p>No items found. Add some!</p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;