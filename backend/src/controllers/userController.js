const UserModel = require('../models/userModel');

exports.getAllUsers = async (req, res) => {
  const rows = await UserModel.getAll();
  res.status(200).json({ success: true, count: rows.length, data: rows });
};

exports.getUserById = async (req, res) => {
  const user = await UserModel.getById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.status(200).json({ success: true, data: user });
};

exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  try {
    const id = await UserModel.register({
      name,
      email,
      password,
      role: role || 'tenant'
    });
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      id
    });
  } catch (err) {
    if (err.message === 'Email already registered') {
      return res.status(400).json({ success: false, message: err.message });
    }
    throw err;
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const existing = await UserModel.getById(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  const updated = await UserModel.update(id, req.body);
  if (!updated) {
    return res.status(400).json({ success: false, message: 'Update failed' });
  }
  res.status(200).json({ success: true, message: 'User updated successfully' });
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const existing = await UserModel.getById(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  await UserModel.delete(id);
  res.status(200).json({ success: true, message: 'User deleted successfully' });
};
