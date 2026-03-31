// RegisterPage — Kavi's file
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import { registerUser, googleLogin, clearError } from '../store/authSlice';
import { PASSWORD_REGEX, PASSWORD_RULES } from '../utils/constants';
import toast from 'react-hot-toast';
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineUser,
  HiOutlinePhone,
} from 'react-icons/hi2';
import './AuthPages.css';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error, otpSent } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValid, setPasswordValid] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (otpSent) {
      toast.success('OTP sent to your email!');
      navigate('/verify-otp', { replace: true });
    }
  }, [otpSent, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'password') {
      setPasswordValid(value ? PASSWORD_REGEX.test(value) : null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!PASSWORD_REGEX.test(form.password)) {
      toast.error('Password does not meet requirements');
      return;
    }
    dispatch(registerUser(form));
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

      <div className="auth-card card-glass animate-scale-in" id="register-card">
        {/* Header */}
        <div className="auth-card__header">
          <div className="auth-card__logo">
            <div className="auth-card__logo-icon">NB</div>
          </div>
          <h1 className="heading-2">Create your account</h1>
          <p className="text-secondary">Join NoBroker and connect directly with owners</p>
        </div>

        {/* Form */}
        <form className="auth-card__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">Full Name *</label>
            <div className="auth-input-wrap">
              <HiOutlineUser className="auth-input-icon" />
              <input
                type="text"
                id="register-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="form-input auth-input"
                autoComplete="name"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">Email *</label>
            <div className="auth-input-wrap">
              <HiOutlineEnvelope className="auth-input-icon" />
              <input
                type="email"
                id="register-email"
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
            <label className="form-label" htmlFor="register-phone">Phone</label>
            <div className="auth-input-wrap">
              <HiOutlinePhone className="auth-input-icon" />
              <input
                type="tel"
                id="register-phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="form-input auth-input"
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-password">Password *</label>
            <div className="auth-input-wrap">
              <HiOutlineLockClosed className="auth-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="register-password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className={`form-input auth-input ${passwordValid === false ? 'error' : ''}`}
                autoComplete="new-password"
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
            <p className={`form-hint ${passwordValid === false ? 'form-error' : ''} ${passwordValid === true ? 'auth-password-valid' : ''}`}>
              {PASSWORD_RULES}
            </p>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg auth-submit-btn"
            disabled={loading}
            id="register-submit-btn"
          >
            {loading ? <div className="spinner" /> : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-card__divider">
          <span>or continue with</span>
        </div>

        {/* Google */}
        <div className="auth-card__google" id="google-register-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="signup_with"
            shape="pill"
            size="large"
            width="100%"
          />
        </div>

        {/* Footer */}
        <p className="auth-card__footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-card__link" id="register-to-login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
