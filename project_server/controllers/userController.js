const User = require('../models/User');
const logActivity = require('../utils/logActivity');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, req.body, { new: true }).select('-password');
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin Controllers
const getAllUsers = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      await logActivity({
        type: 'user.deleted',
        actorId: req.userId,
        actorName: deletedUser.name,
        message: `User removed: ${deletedUser.name}`,
        metadata: { deletedUserId: deletedUser._id, role: deletedUser.role }
      });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile, getAllUsers, deleteUser };
