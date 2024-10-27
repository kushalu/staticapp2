import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [items, setItems] = useState([]);       // Store fetched items
  const [newItem, setNewItem] = useState('');    // Store new item input
  const [editItem, setEditItem] = useState(null); // Track item being edited

  // Fetch items from a mock API on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      setItems(response.data.slice(0, 10)); // Limit to first 10 items for simplicity
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const addItem = async () => {
    if (!newItem.trim()) return;
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
        title: newItem,
      });
      setItems([...items, response.data]);
      setNewItem('');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const updateItem = async (id) => {
    if (!editItem?.title?.trim()) return;
    try {
      const response = await axios.put(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        title: editItem.title,
      });
      setItems(items.map((item) => (item.id === id ? response.data : item)));
      setEditItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Simple CRUD App</h1>

      {/* Add New Item */}
      <div>
        <input
          type="text"
          placeholder="Add new item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button onClick={addItem}>Add</button>
      </div>

      {/* Item List */}
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: 10 }}>
            {editItem?.id === item.id ? (
              <>
                <input
                  type="text"
                  value={editItem.title}
                  onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                />
                <button onClick={() => updateItem(item.id)}>Save</button>
                <button onClick={() => setEditItem(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{item.title}</span>
                <button onClick={() => setEditItem(item)}>Edit</button>
                <button onClick={() => deleteItem(item.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
