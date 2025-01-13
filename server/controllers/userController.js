const User = require('../models/user');

let users = []; // Temporary in-memory storage

// Get all users
exports.getUsers = (req, res) => {
  res.status(200).json(users);
};

// Create new user
exports.createUser = (req, res) => {
  const { username, age, hobbies } = req.body;
  if (!username || !age || !Array.isArray(hobbies)) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  const newUser = new User(username, age, hobbies);
  users.push(newUser);
  res.status(201).json(newUser);
};

// Update user
exports.updateUser = (req, res) => {
  const userId = req.params.userId;
  const { username, age, hobbies } = req.body;
  const user = users.find(u => u.id === userId);

  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!username || !age || !Array.isArray(hobbies)) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  user.username = username;
  user.age = age;
  user.hobbies = hobbies;

  res.status(200).json(user);
};

// Delete user
exports.deleteUser = (req, res) => {
  const userId = req.params.userId;
  const index = users.findIndex(u => u.id === userId);

  if (index === -1) return res.status(404).json({ error: 'User not found' });

  users.splice(index, 1);
  res.status(204).send();
};
