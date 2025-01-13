const User = require('../models/user');

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving users' });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  const { username, age, hobbies } = req.body;

  if (!username || !age || !Array.isArray(hobbies)) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  try {
    const newUser = new User({ username, age, hobbies });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  const userId = req.params.userId;
  const { username, age, hobbies } = req.body;

  if (!username || !age || !Array.isArray(hobbies)) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.username = username;
    user.age = age;
    user.hobbies = hobbies;

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.remove();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};
