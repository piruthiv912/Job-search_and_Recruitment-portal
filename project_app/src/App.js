import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PostJob from "./pages/PostJob";
import JobListing from "./pages/JobListing";
import CompanyProfile from "./pages/CompanyProfile";
import CreateCompany from "./pages/CreateCompany";
import { AuthProvider, useAuth } from "./context/AuthContext";

import "./App.css";

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const role = user?.role;

  if (loading) return <div className="loading">Checking authentication...</div>;

  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            !user ? <Navigate to="/login" /> :
              role === 'admin' ? <AdminDashboard /> :
                role === 'recruiter' ? <RecruiterDashboard /> : <Dashboard />
          }
        />
        <Route path="/post-job" element={user && role === 'recruiter' ? <PostJob /> : <Navigate to={user ? "/dashboard" : "/login"} />} />
        <Route path="/create-company" element={user && role === 'recruiter' ? <CreateCompany /> : <Navigate to="/dashboard" />} />
        <Route path="/jobs" element={<JobListing />} />

        <Route path="/companies/:id" element={<CompanyProfile />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

