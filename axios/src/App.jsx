import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [editingUser, setEditingUser] = useState(null);

  // Fetch all users from the API
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  // Add a new user
  const addUser = () => {
    axios.post('https://jsonplaceholder.typicode.com/users', newUser)
      .then(response => setUsers([...users, response.data]))
      .catch(error => console.error('Error adding user:', error));
    setNewUser({ name: '', email: '' });
  };

  // Edit an existing user
  const editUser = (id, updatedUser) => {
    axios.put(`https://jsonplaceholder.typicode.com/users/${id}`, updatedUser)
      .then(response => setUsers(users.map(user => (user.id === id ? response.data : user))))
      .catch(error => console.error('Error editing user:', error));
    setEditingUser(null);
  };

  // Delete a user
  const deleteUser = (id) => {
    axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(() => setUsers(users.filter(user => user.id !== id)))
      .catch(error => console.error('Error deleting user:', error));
  };

  return (
    <div className="container">
      <h1>User Management</h1>

      {/* Add/Edit User Form */}
      <div>
        <h2>{editingUser ? 'Edit User' : 'Add User'}</h2>
        <input
          type="text"
          placeholder="Name"
          value={editingUser ? editingUser.name : newUser.name}
          onChange={e => {
            const name = e.target.value;
            editingUser ? setEditingUser({ ...editingUser, name }) : setNewUser({ ...newUser, name });
          }}
        />
        <input
          type="email"
          placeholder="Email"
          value={editingUser ? editingUser.email : newUser.email}
          onChange={e => {
            const email = e.target.value;
            editingUser ? setEditingUser({ ...editingUser, email }) : setNewUser({ ...newUser, email });
          }}
        />
        <button onClick={editingUser ? () => editUser(editingUser.id, editingUser) : addUser}>
          {editingUser ? 'Update' : 'Add'}
        </button>
        {editingUser && <button onClick={() => setEditingUser(null)}>Cancel</button>}
      </div>

      {/* Display Users */}
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} ({user.email})
            <button onClick={() => setEditingUser(user)}>Edit</button>
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
