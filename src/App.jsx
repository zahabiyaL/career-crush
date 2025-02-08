import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CompanySignUp from './pages/CompanySignUp';
import StudentSignUp from './pages/StudentSignUp';
import Home from './components/Home';
import Navbar from './components/Navbar';
import AuthCallback from './components/AuthCallback';
//import StudentDashboard from './pages/StudentDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="main-container bg-main">
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/company-signup" element={<CompanySignUp />} />
          <Route 
            path="/student-signup" 
            element={
              <StudentSignUp 
                isAuthenticated={isAuthenticated} 
                setIsAuthenticated={setIsAuthenticated} 
              />
            } 
          />
          {/* Comment out dashboard route for now
          <Route 
            path="/student/dashboard" 
            element={
              isAuthenticated ? (
                <StudentDashboard />
              ) : (
                <Navigate to="/student-signup" />
              )
            } 
          />
          */}
          <Route path="/auth/callback" element={<AuthCallback setIsAuthenticated={setIsAuthenticated} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;