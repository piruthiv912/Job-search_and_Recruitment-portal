const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Company = require('./models/Company');
const Job = require('./models/Job');
const Application = require('./models/Application');
require('dotenv').config();

const seedData = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/placement_system';

        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB at', mongoURI);

        // Clear existing data
        await User.deleteMany({});
        await Company.deleteMany({});
        await Job.deleteMany({});
        await Application.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // --- USERS ---
        const password = await bcrypt.hash('password123', 10);

        // Recruiter
        const recruiter = await User.create({
            name: 'John Recruiter',
            email: 'recruiter@techcorp.com',
            password: password,
            role: 'recruiter',
            phone: '9876543210'
        });

        // Student (Alice)
        const student = await User.create({
            name: 'Alice Student',
            email: 'alice@student.com',
            password: password,
            role: 'student',
            branch: 'Computer Science',
            cgpa: 8.5,
            skills: ['React', 'Node.js', 'Python', 'Java'],
            rollNumber: 'CS2023001'
        });

        // Admin
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@college.edu',
            password: password,
            role: 'admin'
        });

        console.log(`👤 Created Users: Recruiter, Student (Alice), Admin`);

        // --- COMPANIES ---
        const companyData = [
            { name: 'Tech Corp', industry: 'IT Services', location: 'Bangalore', website: 'https://techcorp.com' },
            { name: 'Innovate Inc', industry: 'Product Development', location: 'Hyderabad', website: 'https://innovate.io' },
            { name: 'Future Systems', industry: 'AI & Robotics', location: 'Pune', website: 'https://futuresys.ai' },
            { name: 'Cloud Nine', industry: 'Cloud Computing', location: 'Bangalore', website: 'https://cloud9.net' },
            { name: 'FinTech Solutions', industry: 'Finance', location: 'Mumbai', website: 'https://fintechsol.com' },
            { name: 'EduLearn', industry: 'EdTech', location: 'Delhi', website: 'https://edulearn.in' }
        ];

        const companies = [];
        for (const data of companyData) {
            const comp = await Company.create({
                ...data,
                description: `Leading company in ${data.industry}.`,
                recruiter: recruiter._id
            });
            companies.push(comp);
        }
        console.log(`🏢 Created ${companies.length} Companies`);

        // --- JOBS ---
        const jobRoles = [
            { title: 'Full Stack Developer', skills: ['React', 'Node.js', 'MongoDB'], min: 600000, max: 1200000 },
            { title: 'Frontend Engineer', skills: ['React', 'CSS', 'JavaScript'], min: 500000, max: 900000 },
            { title: 'Backend Developer', skills: ['Node.js', 'Express', 'SQL'], min: 700000, max: 1100000 },
            { title: 'Data Scientist', skills: ['Python', 'Machine Learning', 'SQL'], min: 900000, max: 1500000 },
            { title: 'DevOps Engineer', skills: ['AWS', 'Docker', 'Kubernetes'], min: 800000, max: 1400000 },
            { title: 'UI/UX Designer', skills: ['Figma', 'Adobe XD'], min: 450000, max: 800000 },
            { title: 'Product Manager', skills: ['Agile', 'Jira', 'Communication'], min: 1000000, max: 1800000 }
        ];

        const expLevels = ['Entry Level', 'Mid Level', 'Senior Level'];
        const types = ['Full-time', 'Internship'];

        const specificJobs = []; // To track for applications

        for (let i = 0; i < 25; i++) {
            const company = companies[Math.floor(Math.random() * companies.length)];
            const role = jobRoles[Math.floor(Math.random() * jobRoles.length)];
            const type = types[Math.floor(Math.random() * types.length)];

            // Adjust salary based on type
            let salaryMin = role.min;
            let salaryMax = role.max;
            if (type === 'Internship') {
                salaryMin = 15000;
                salaryMax = 35000;
            }

            const job = await Job.create({
                title: type === 'Internship' ? `${role.title} Intern` : role.title,
                description: `We are hiring for a ${role.title}. dynamic team and exciting projects.`,
                company: company._id,
                salary: { min: salaryMin, max: salaryMax },
                location: company.location,
                jobType: type,
                skills: role.skills,
                minCGPA: 6.5 + Math.random() * 2,
                positions: Math.floor(Math.random() * 5) + 1,
                experienceLevel: expLevels[Math.floor(Math.random() * expLevels.length)],
                deadline: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000), // Random deadline within 60 days
                postedDate: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000) // Posted within last 10 days
            });
            specificJobs.push(job);
        }
        console.log(`💼 Created ${specificJobs.length} Jobs`);

        // --- APPLICATIONS ---
        const statuses = ['Applied', 'Shortlisted', 'Interview', 'Rejected', 'Accepted'];

        // Ensure some applications for Alice
        const jobsForMap = [...specificJobs].sort(() => 0.5 - Math.random()); // Shuffle
        const selectedJobs = jobsForMap.slice(0, 15); // Apply to 15 jobs

        for (const job of selectedJobs) {
            let status = statuses[Math.floor(Math.random() * statuses.length)];
            let interviewDate = null;

            // Force some statuses to ensure variety
            if (job === selectedJobs[0] || job === selectedJobs[1]) status = 'Accepted';
            if (job === selectedJobs[2] || job === selectedJobs[3] || job === selectedJobs[4]) status = 'Interview';

            if (status === 'Interview') {
                // Schedule interview in next 7 days or past 2 days
                interviewDate = new Date(Date.now() + (Math.random() * 9 - 2) * 24 * 60 * 60 * 1000);
            }

            await Application.create({
                job: job._id,
                student: student._id,
                status: status,
                coverletter: `I am passionate about ${job.title} and believe I am a good fit.`,
                appliedAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000), // Applied within last 10 days
                interviewDate: interviewDate
            });
        }
        console.log(`📝 Created ${selectedJobs.length} Applications for Alice`);

        console.log('✨ Database seeded successfully with RICH data!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
