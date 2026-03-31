// OtpPage — Kavi's file
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, clearError } from '../store/authSlice';
import toast from 'react-hot-toast';
import { HiOutlineEnvelope, HiOutlineShieldCheck } from 'react-icons/hi2';
import './AuthPages.css';

export default function OtpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error, otpEmail } = useSelector((state) => state.auth);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!otpEmail) {
      navigate('/register', { replace: true });
    }
  }, [otpEmail, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Account verified successfully!');
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // only digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // take last char
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newOtp.every((d) => d !== '')) {
      dispatch(verifyOtp({ email: otpEmail, otp: newOtp.join('') }));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      dispatch(verifyOtp({ email: otpEmail, otp: pasted }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }
    dispatch(verifyOtp({ email: otpEmail, otp: code }));
  };

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-page__bg-shapes">
        <div className="auth-page__shape auth-page__shape--1" />
        <div className="auth-page__shape auth-page__shape--2" />
        <div className="auth-page__shape auth-page__shape--3" />
      </div>

      <div className="auth-card card-glass animate-scale-in" id="otp-card">
        {/* Header */}
        <div className="auth-card__header">
          <div className="auth-card__logo auth-card__logo--shield">
            <HiOutlineShieldCheck className="auth-card__logo-shield-icon" />
          </div>
          <h1 className="heading-2">Verify your email</h1>
          <p className="text-secondary">
            We sent a 6-digit code to{' '}
            <strong className="otp-email-highlight">{otpEmail}</strong>
          </p>
        </div>

        {/* OTP Form */}
        <form className="auth-card__form" onSubmit={handleSubmit}>
          <div className="otp-inputs" id="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`otp-input ${digit ? 'otp-input--filled' : ''}`}
                id={`otp-input-${index}`}
                autoComplete="one-time-code"
              />
            ))}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg auth-submit-btn"
            disabled={loading || otp.some((d) => !d)}
            id="otp-submit-btn"
          >
            {loading ? <div className="spinner" /> : 'Verify & Continue'}
          </button>
        </form>

        {/* Info */}
        <div className="otp-info">
          <HiOutlineEnvelope />
          <p className="text-small text-muted">
            Check your spam folder if you don&apos;t see the email. The code expires in 10 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
