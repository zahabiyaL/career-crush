import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthCallback = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      navigate('/student/dashboard');
    } else {
      navigate('/student-signup');
    }
  }, [location, navigate, setIsAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Completing sign in...</h2>
        <p className="text-gray-500">Please wait while we redirect you.</p>
      </div>
    </div>
  );
};

export default AuthCallback;