// GoogleCallback — Kavi's file
// Handles redirect-based Google OAuth flow (fallback)
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function GoogleCallback() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    } else {
      // If we arrive here without being authenticated,
      // the user may have cancelled. Redirect to login.
      const timer = setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="page-loader page-wrapper">
      <div className="google-callback-content animate-fade-in">
        <div className="spinner spinner-dark" style={{ width: 40, height: 40 }} />
        <p className="text-secondary" style={{ marginTop: '1rem' }}>
          Completing sign-in...
        </p>
      </div>
    </div>
  );
}
