const UserModel = require('../models/userModel');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: name, email, password'
    });
  }

  let assignedRole = 'tenant';
  const allowedStaffRoles = ['admin', 'staff', 'tenant'];
  if (role && req.user?.role === 'admin' && allowedStaffRoles.includes(role)) {
    assignedRole = role;
  }

  try {
    const id = await UserModel.register({
      name,
      email,
      password,
      role: assignedRole
    });

    const token = UserModel.generateToken(id, assignedRole);

    res.status(201).json({
      success: true,
      message: 'Registered successfully',
      data: { id, name, email, role: assignedRole, token }
    });
  } catch (err) {
    if (err.message === 'Email already registered') {
      return res.status(400).json({ success: false, message: err.message });
    }
    throw err;
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: email, password'
    });
  }

  const user = await UserModel.getByEmail(email);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  const valid = await UserModel.verifyPassword(password, user.password);
  if (!valid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  const token = UserModel.generateToken(user.id, user.role);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    }
  });
};

exports.getMe = async (req, res) => {
  const user = await UserModel.getById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
};
