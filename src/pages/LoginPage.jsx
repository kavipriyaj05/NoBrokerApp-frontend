// LoginPage — Kavi's file
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import { loginUser, googleLogin, clearError } from '../store/authSlice';
import toast from 'react-hot-toast';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import './AuthPages.css';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    dispatch(loginUser(form));
  };

  const handleGoogleSuccess = (credentialResponse) => {
    dispatch(googleLogin(credentialResponse.credential));
  };

  const handleGoogleError = () => {
    toast.error('Google sign-in failed. Please try again.');
  };

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-page__bg-shapes">
        <div className="auth-page__shape auth-page__shape--1" />
        <div className="auth-page__shape auth-page__shape--2" />
        <div className="auth-page__shape auth-page__shape--3" />
      </div>

      <div className="auth-card card-glass animate-scale-in" id="login-card">
        {/* Header */}
        <div className="auth-card__header">
          <div className="auth-card__logo">
            <div className="auth-card__logo-icon">NB</div>
          </div>
          <h1 className="heading-2">Welcome back</h1>
          <p className="text-secondary">Sign in to your NoBroker account</p>
        </div>

        {/* Form */}
        <form className="auth-card__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
            <div className="auth-input-wrap">
              <HiOutlineEnvelope className="auth-input-icon" />
              <input
                type="email"
                id="login-email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="form-input auth-input"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div className="auth-input-wrap">
              <HiOutlineLockClosed className="auth-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="form-input auth-input"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-input-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg auth-submit-btn"
            disabled={loading}
            id="login-submit-btn"
          >
            {loading ? <div className="spinner" /> : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-card__divider">
          <span>or continue with</span>
        </div>

        {/* Google */}
        <div className="auth-card__google" id="google-login-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="continue_with"
            shape="pill"
            size="large"
            width="100%"
          />
        </div>

        {/* Footer */}
        <p className="auth-card__footer">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="auth-card__link" id="login-to-register">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
