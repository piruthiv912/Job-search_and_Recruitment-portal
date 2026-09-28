# Getting Started with College Placement Management System

## Quick Start Guide

### Step 1: Install Dependencies

**Terminal 1 - Backend:**
```bash
cd project/project_server
npm install
```

**Terminal 2 - Frontend:**
```bash
cd project/project_app
npm install
```

### Step 2: Start MongoDB

If you have MongoDB installed locally:
```bash
mongod
```

Or update the `MONGODB_URI` in `.env` to use MongoDB Atlas cloud database.

### Step 3: Start the Backend

```bash
cd project/project_server
npm run dev
```

Expected output:
```
Server running on port 4000
MongoDB connected
```

### Step 4: Start the Frontend

```bash
cd project/project_app
npm start
```

The app will open automatically in your browser at `http://localhost:3000`

## Usage Workflow

### For Students:
1. Click "Register Now" on the home page
2. Select "Student" as role and fill in details
3. Login with your credentials
4. Go to "Jobs" to see available placements
5. Click "Apply Now" and submit your application
6. Check "Dashboard" to track application status

### For Recruiters:
1. Register with "Recruiter" role
2. Create your company profile
3. Post job openings
4. View and manage student applications
5. Update application statuses

### Test Credentials (after registration):

**Student Account:**
```
Email: student@example.com
Password: password123
```

**Recruiter Account:**
```
Email: recruiter@example.com
Password: password123
```

## Common Commands

### Backend
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

### Frontend
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Troubleshooting

### Port Already in Use
If port 4000 or 3000 is already in use:

```bash
# Change backend port in .env
PORT=5000

# Frontend automatically uses 3000, or use:
PORT=3001 npm start
```

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MongoDB connection string in `.env`
- Verify MongoDB is listening on `localhost:27017`

### CORS Error
- Ensure backend is running on port 4000
- Check that frontend proxy is set to `http://localhost:4000` in package.json

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Project Features Overview

✅ User authentication with JWT
✅ Role-based access (Student, Recruiter, Admin)
✅ Job posting and management
✅ Application tracking
✅ Dashboard with statistics
✅ Company management
✅ Responsive design
✅ Modern UI with gradients

## File Structure

```
project/
├── project_app/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.js - Landing page
│   │   │   ├── Login.js - Login page
│   │   │   ├── Register.js - Registration page
│   │   │   ├── JobListing.js - Job listings
│   │   │   └── Dashboard.js - Student dashboard
│   │   ├── components/
│   │   │   └── Navigation.js - Navigation bar
│   │   ├── services/
│   │   │   └── api.js - API service with axios
│   │   ├── App.js - Main app component
│   │   └── index.js
│   └── package.json
│
└── project_server/
    ├── models/
    │   ├── User.js
    │   ├── Job.js
    │   ├── Company.js
    │   └── Application.js
    ├── controllers/
    │   ├── authController.js
    │   ├── jobController.js
    │   ├── userController.js
    │   ├── companyController.js
    │   └── applicationController.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── jobRoutes.js
    │   ├── userRoutes.js
    │   ├── companyRoutes.js
    │   └── applicationRoutes.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── server.js
    ├── package.json
    └── .env
```

## API Testing

Use Postman or similar tool to test APIs:

1. **Register User:**
```
POST http://localhost:4000/api/auth/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

2. **Login:**
```
POST http://localhost:4000/api/auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
```

3. **Get All Jobs:**
```
GET http://localhost:4000/api/jobs
```

## Next Steps

1. ✅ Complete setup and run the application
2. ✅ Test with different user roles
3. ✅ Add more features as needed
4. ✅ Deploy to production

## Deployment Tips

- Use environment variables for all sensitive data
- Set `NODE_ENV=production` in backend
- Build React app: `npm run build`
- Use a service like Heroku, Render, or AWS for hosting
- Use MongoDB Atlas for cloud database

---

**Need Help?** Check the main README.md or contact support!
