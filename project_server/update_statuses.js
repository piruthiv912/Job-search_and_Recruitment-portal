const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Application = require('./models/Application');

dotenv.config();

const updateStatuses = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected');

        const applications = await Application.find();
        console.log(`Found ${applications.length} applications.`);

        if (applications.length === 0) {
            console.log('No applications found to update.');
            process.exit(0);
        }

        const statuses = ['Shortlisted', 'Interview', 'Accepted', 'Rejected'];

        // Update each application to a different status cyclically
        for (let i = 0; i < applications.length; i++) {
            const status = statuses[i % statuses.length];
            await Application.findByIdAndUpdate(applications[i]._id, { status });
            console.log(`Updated application ${applications[i]._id} to ${status}`);
        }

        console.log('✅ All applications updated.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating statuses:', error);
        process.exit(1);
    }
};

updateStatuses();
