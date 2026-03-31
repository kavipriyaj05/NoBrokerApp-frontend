// Navbar — Kavi's file
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../utils/constants';
import { HiOutlineHome, HiOutlinePlus, HiOutlineViewGrid, HiOutlineCalendar, HiOutlineShieldCheck } from 'react-icons/hi';
import { HiOutlineUser, HiOutlineArrowRightOnRectangle, HiOutlineBars3 } from 'react-icons/hi2';
import './Navbar.css';

export default function Navbar() {
  const { isAuthenticated, name, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);
  const menuRef = useRef(null);

  // Track scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handle = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Browse', icon: <HiOutlineHome /> },
  ];

  if (isAuthenticated) {
    navLinks.push({ to: '/add-property', label: 'List Property', icon: <HiOutlinePlus /> });
    navLinks.push({ to: '/my-properties', label: 'My Properties', icon: <HiOutlineViewGrid /> });
    navLinks.push({ to: '/my-bookings', label: 'My Bookings', icon: <HiOutlineCalendar /> });
    navLinks.push({ to: '/owner-bookings', label: 'Owner Bookings', icon: <HiOutlineCalendar /> });
    if (role === USER_ROLES.ADMIN) {
      navLinks.push({ to: '/admin', label: 'Admin', icon: <HiOutlineShieldCheck /> });
    }
  }

  const getInitials = (n) => {
    if (!n) return '?';
    return n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="main-navbar">
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo" id="navbar-logo">
          <div className="navbar__logo-icon">NB</div>
          <span className="navbar__logo-text">NoBroker</span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar__links">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar__link ${isActive(link.to) ? 'navbar__link--active' : ''}`}
              id={`nav-link-${link.to.replace(/\//g, '') || 'home'}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="navbar__actions">
          {isAuthenticated ? (
            <div className="navbar__profile" ref={profileRef}>
              <button
                className="navbar__avatar"
                onClick={() => setProfileOpen(!profileOpen)}
                id="navbar-avatar-btn"
                aria-label="User menu"
              >
                {getInitials(name)}
              </button>
              {profileOpen && (
                <div className="navbar__dropdown animate-scale-in" id="navbar-profile-dropdown">
                  <div className="navbar__dropdown-header">
                    <span className="navbar__dropdown-name">{name}</span>
                    <span className="navbar__dropdown-role badge badge-{role === USER_ROLES.ADMIN ? 'sale' : 'rent'}">
                      {role}
                    </span>
                  </div>
                  <div className="navbar__dropdown-divider" />
                  <button className="navbar__dropdown-item" onClick={handleLogout} id="navbar-logout-btn">
                    <HiOutlineArrowRightOnRectangle />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar__auth-btns">
              <Link to="/login" className="btn btn-ghost btn-sm" id="navbar-login-btn">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="navbar-register-btn">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            id="navbar-hamburger"
            aria-label="Toggle navigation menu"
          >
            <HiOutlineBars3 />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar__mobile-menu animate-fade-in" ref={menuRef} id="navbar-mobile-menu">
          <div className="navbar__mobile-links">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`navbar__mobile-link ${isActive(link.to) ? 'navbar__mobile-link--active' : ''}`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
            {!isAuthenticated && (
              <>
                <Link to="/login" className="navbar__mobile-link">
                  <HiOutlineUser />
                  <span>Log In</span>
                </Link>
                <Link to="/register" className="navbar__mobile-link navbar__mobile-link--primary">
                  <HiOutlinePlus />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
            {isAuthenticated && (
              <button className="navbar__mobile-link navbar__mobile-link--danger" onClick={handleLogout}>
                <HiOutlineArrowRightOnRectangle />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
