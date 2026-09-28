const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const email = 'abishek@gmail.com';
        const user = await User.findOne({ email });
        if (user) {
            console.log('✅ User found:', { id: user._id, email: user.email, role: user.role });
        } else {
            console.log('❌ User not found:', email);
            const allUsers = await User.find({}, 'email');
            console.log('Available users:', allUsers.map(u => u.email));
        }
        process.exit(0);
    })
    .catch(err => {
        console.error('Connection error:', err);
        process.exit(1);
    });
