const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logActivity = require('../utils/logActivity');

const register = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;
    email = email.toLowerCase();

    console.log('📝 Register request:', { name, email, role });

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Disallow admin registration
    if (role === 'admin') {
      return res.status(403).json({ message: 'Admin registration is not allowed' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (allow only student or recruiter)
    const userRole = role === 'recruiter' ? 'recruiter' : 'student';
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: userRole
    });

    await user.save();

    await logActivity({
      type: 'user.signup',
      actorId: user._id,
      actorName: user.name,
      message: `${user.name} joined as ${user.role}`,
      metadata: { role: user.role },
      sourceKey: `user.signup:${user._id}`
    });

    console.log('✅ User registered:', email);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('❌ Register error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();

    console.log('🔑 Login request:', { email });

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error('❌ Login error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

module.exports = { register, login, logout };
