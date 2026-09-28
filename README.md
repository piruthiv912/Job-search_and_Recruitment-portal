# College Placement Management System - MERN Stack

A full-stack web application for managing college placements, built with MongoDB, Express.js, React, and Node.js.

## Features

### For Students
- Register and create profile
- Browse available job listings
- Apply for positions
- Track application status
- View placement dashboard with statistics

### For Recruiters
- Post job openings
- View student applications
- Update application status (Shortlisted, Interview, Accepted, Rejected)
- Manage company profile

### For Admins
- Manage all users and placements
- System oversight and reporting

## Tech Stack

- **Frontend**: React.js, React Router, Axios, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing

## Project Structure

```
project/
├── project_app/          # React Frontend
│   ├── src/
│   │   ├── pages/       # Page components (Login, Register, JobListing, Dashboard, Home)
│   │   ├── components/  # Reusable components (Navigation)
│   │   ├── services/    # API services (api.js with axios)
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── public/
│
└── project_server/       # Express Backend
    ├── models/          # MongoDB schemas (User, Job, Company, Application)
    ├── controllers/     # Route handlers
    ├── routes/          # API routes
    ├── middleware/      # Authentication middleware
    ├── server.js
    ├── package.json
    └── .env
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation & Setup

### 1. Install Dependencies

**Backend:**
```bash
cd project/project_server
npm install
```

**Frontend:**
```bash
cd project/project_app
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in `project_server/`:

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/placement_system
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Start MongoDB

```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas connection string
```

### 4. Run the Application

**Backend (from project_server/):**
```bash
npm run dev
```
Server will run on http://localhost:4000

**Frontend (from project_app/):**
```bash
npm start
```
App will run on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create job (Protected)
- `PUT /api/jobs/:id` - Update job (Protected)
- `DELETE /api/jobs/:id` - Delete job (Protected)

### Companies
- `GET /api/companies` - Get all companies
- `POST /api/companies` - Create company (Protected)

### Applications
- `POST /api/applications/apply` - Apply for job (Protected)
- `GET /api/applications` - Get user's applications (Protected)
- `PUT /api/applications/:id` - Update application status (Protected)

### Users
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update profile (Protected)

## Usage

1. **Register**: Create a new account as Student or Recruiter
2. **Login**: Sign in with your credentials
3. **Browse Jobs**: View available placements
4. **Apply**: Submit applications with cover letter
5. **Track Status**: Monitor your application progress in the dashboard

## Key Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Different features for students, recruiters, and admins
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Status**: Track application status updates
- **Dashboard Analytics**: View placement statistics

## Database Models

### User
- name, email, password, role, phone
- rollNumber, branch, cgpa
- skills, resume

### Job
- title, description, salary
- location, jobType, skills
- minCGPA, positions, deadline
- company reference

### Company
- name, description, website
- location, industry
- recruiter reference

### Application
- job reference, student reference
- status, appliedAt, coverletter

## Styling

The application uses modern CSS with:
- Gradient backgrounds
- Responsive grid layouts
- Smooth transitions and animations
- Mobile-friendly design

## Error Handling

- Validation for all inputs
- JWT token verification
- MongoDB error handling
- User-friendly error messages

## Security Features

- Password hashing with bcryptjs
- JWT token expiration
- HTTP-only cookies for token storage
- CORS enabled for frontend
- Environment variables for secrets

## Future Enhancements

- Add email notifications
- Resume upload and parsing
- Interview scheduling
- Analytics dashboard
- Payment integration
- Video call integration for interviews

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License

## Support

For any issues or questions, please contact the development team.

---

**Happy Placing! 🎓**
