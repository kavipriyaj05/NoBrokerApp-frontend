// MyBookingsPage — Jeyanth's file
// Shows all visit bookings made by the logged-in user

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBookings, cancelBooking, clearBookingError } from '../store/bookingSlice';
import {
  HiOutlineMapPin,
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineXCircle,
  HiOutlineTicket,
  HiOutlineBuildingOffice2,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import './MyBookingsPage.css';

const TABS = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

export default function MyBookingsPage() {
  const dispatch = useDispatch();
  const { bookings, loading, cancelling, error } = useSelector((state) => state.booking);
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearBookingError());
    }
  }, [error, dispatch]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await dispatch(cancelBooking(id)).unwrap();
      toast.success('Booking cancelled');
    } catch (err) {
      toast.error(err || 'Failed to cancel booking');
    }
  };

  const filteredBookings =
    activeTab === 'ALL'
      ? bookings
      : bookings.filter((b) => b.status === activeTab);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'badge-approved';
      case 'CANCELLED': return 'badge-rejected';
      case 'PENDING':
      default: return 'badge-pending';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="page-wrapper">
      <div className="my-bookings container animate-fade-in">
        {/* Header */}
        <div className="my-bookings__header">
          <h1 className="heading-2">My Bookings</h1>
          <p className="text-secondary">Track your property visit bookings</p>
        </div>

        {/* Tabs */}
        <div className="my-bookings__tabs" id="bookings-tabs">
          {TABS.map((tab) => {
            const count = tab.key === 'ALL'
              ? bookings.length
              : bookings.filter((b) => b.status === tab.key).length;
            return (
              <button
                key={tab.key}
                className={`my-bookings__tab ${activeTab === tab.key ? 'my-bookings__tab--active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
                id={`tab-${tab.key.toLowerCase()}`}
              >
                {tab.label}
                {count > 0 && <span className="my-bookings__tab-count">{count}</span>}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="my-bookings__list">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="booking-card">
                <div className="booking-card__image-wrap">
                  <div className="skeleton" style={{ width: '100%', height: '100%' }} />
                </div>
                <div className="booking-card__body">
                  <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 12 }} />
                  <div className="skeleton" style={{ height: 14, width: '80%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 36, width: '100%', marginTop: 'auto' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="my-bookings__list" id="bookings-list">
            {filteredBookings.map((booking, index) => (
              <div
                key={booking.id}
                className={`booking-card animate-fade-in-up delay-${(index % 6) + 1}`}
                id={`booking-${booking.id}`}
              >
                {/* Property image */}
                <div className="booking-card__image-wrap">
                  <img
                    src={
                      booking.propertyImage ||
                      booking.property?.images?.[0] ||
                      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80'
                    }
                    alt={booking.propertyTitle || booking.property?.title || 'Property'}
                    className="booking-card__image"
                    loading="lazy"
                  />
                </div>

                {/* Body */}
                <div className="booking-card__body">
                  <div className="booking-card__top">
                    <div>
                      <h3 className="booking-card__title">
                        {booking.propertyTitle || booking.property?.title || 'Property Visit'}
                      </h3>
                      <div className="booking-card__location">
                        <HiOutlineMapPin />
                        <span>
                          {booking.propertyLocation || booking.property?.location || '—'},{' '}
                          {booking.propertyCity || booking.property?.city || ''}
                        </span>
                      </div>
                    </div>
                    <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="booking-card__details">
                    <div className="booking-card__detail">
                      <HiOutlineCalendarDays />
                      <span><strong>Date:</strong> {formatDate(booking.visitDate || booking.createdAt)}</span>
                    </div>
                    {(booking.visitDate || booking.createdAt) && (
                      <div className="booking-card__detail">
                        <HiOutlineClock />
                        <span><strong>Time:</strong> {formatTime(booking.visitDate || booking.createdAt)}</span>
                      </div>
                    )}
                    <div className="booking-card__detail">
                      <HiOutlineTicket />
                      <span><strong>Type:</strong> {booking.type || 'VISIT'}</span>
                    </div>
                  </div>

                  <div className="booking-card__footer">
                    <div className="booking-card__price">
                      {booking.propertyPrice || booking.property?.price
                        ? `₹${(booking.propertyPrice || booking.property?.price || 0).toLocaleString('en-IN')}`
                        : ''}
                      {(booking.propertyType || booking.property?.type) === 'RENT' && <span>/month</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <Link
                        to={`/properties/${booking.propertyId || booking.property?.id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        View Property
                      </Link>
                      {booking.status === 'PENDING' && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancel(booking.id)}
                          disabled={cancelling === booking.id}
                        >
                          {cancelling === booking.id ? (
                            <div className="spinner" style={{ width: 14, height: 14 }} />
                          ) : (
                            <><HiOutlineXCircle /> Cancel</>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="my-bookings__empty animate-fade-in" id="bookings-empty">
            <div className="my-bookings__empty-icon">
              <HiOutlineBuildingOffice2 />
            </div>
            <h3 className="heading-3">
              {activeTab === 'ALL' ? 'No bookings yet' : `No ${activeTab.toLowerCase()} bookings`}
            </h3>
            <p>
              {activeTab === 'ALL'
                ? 'Browse properties and schedule a visit to get started.'
                : `You don't have any ${activeTab.toLowerCase()} bookings right now.`}
            </p>
            <Link to="/" className="btn btn-primary">
              Browse Properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
