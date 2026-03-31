// OwnerBookingsPage — Property Owner Booking Management
// Shows all bookings on the owner's properties with confirm/reject actions

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOwnerBookings,
  confirmOwnerBooking,
  rejectOwnerBooking,
  clearBookingError,
  clearBookingSuccess,
} from '../store/bookingSlice';
import {
  HiOutlineMapPin,
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineTicket,
  HiOutlineEnvelope,
  HiOutlineBuildingOffice2,
  HiOutlineChatBubbleLeftEllipsis,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import './OwnerBookingsPage.css';

const TABS = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'REJECTED', label: 'Rejected' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

export default function OwnerBookingsPage() {
  const dispatch = useDispatch();
  const { ownerBookings, ownerLoading, confirming, rejecting, error, success } =
    useSelector((state) => state.booking);
  const [activeTab, setActiveTab] = useState('ALL');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    dispatch(fetchOwnerBookings());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearBookingError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearBookingSuccess());
    }
  }, [success, dispatch]);

  const handleConfirm = async (id) => {
    try {
      await dispatch(confirmOwnerBooking(id)).unwrap();
      dispatch(fetchOwnerBookings()); // refresh list
    } catch (err) {
      toast.error(err || 'Failed to confirm booking');
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectModal) return;
    try {
      await dispatch(rejectOwnerBooking({ id: rejectModal, reason: rejectReason })).unwrap();
      setRejectModal(null);
      setRejectReason('');
      dispatch(fetchOwnerBookings()); // refresh list
    } catch (err) {
      toast.error(err || 'Failed to reject booking');
    }
  };

  const filteredBookings =
    activeTab === 'ALL'
      ? ownerBookings
      : ownerBookings.filter((b) => b.status === activeTab);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'badge-approved';
      case 'REJECTED':
      case 'CANCELLED':
        return 'badge-rejected';
      case 'PENDING':
      default:
        return 'badge-pending';
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

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="page-wrapper">
      <div className="owner-bookings container animate-fade-in">
        {/* Header */}
        <div className="owner-bookings__header">
          <h1 className="heading-2">
            Owner Bookings
            <span className="owner-bookings__header-badge">
              <HiOutlineBuildingOffice2 /> Property Owner
            </span>
          </h1>
          <p className="text-secondary">
            Manage booking requests on your listed properties
          </p>
        </div>

        {/* Tabs */}
        <div className="owner-bookings__tabs" id="owner-bookings-tabs">
          {TABS.map((tab) => {
            const count =
              tab.key === 'ALL'
                ? ownerBookings.length
                : ownerBookings.filter((b) => b.status === tab.key).length;
            return (
              <button
                key={tab.key}
                className={`owner-bookings__tab ${
                  activeTab === tab.key ? 'owner-bookings__tab--active' : ''
                }`}
                onClick={() => setActiveTab(tab.key)}
                id={`owner-tab-${tab.key.toLowerCase()}`}
              >
                {tab.label}
                {count > 0 && (
                  <span className="owner-bookings__tab-count">{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {ownerLoading ? (
          <div className="owner-bookings__list">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="ob-card">
                <div className="ob-card__body">
                  <div className="skeleton" style={{ height: 24, width: '60%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 16, width: '40%', marginBottom: 12 }} />
                  <div className="skeleton" style={{ height: 50, width: '100%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 36, width: '100%', marginTop: 'auto' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="owner-bookings__list" id="owner-bookings-list">
            {filteredBookings.map((booking, index) => (
              <div
                key={booking.id}
                className={`ob-card animate-fade-in-up delay-${(index % 6) + 1}`}
                id={`owner-booking-${booking.id}`}
              >
                <div className="ob-card__body">
                  {/* Top: Property info + status */}
                  <div className="ob-card__top">
                    <div>
                      <h3 className="ob-card__prop-title">
                        {booking.property?.title || 'Property'}
                      </h3>
                      <div className="ob-card__prop-location">
                        <HiOutlineMapPin />
                        <span>
                          {booking.property?.location || '—'},{' '}
                          {booking.property?.city || ''}
                        </span>
                      </div>
                    </div>
                    <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>

                  {/* User who booked */}
                  <div className="ob-card__user-info">
                    <div className="ob-card__user-avatar">
                      {getInitials(booking.userName)}
                    </div>
                    <div className="ob-card__user-details">
                      <h4>{booking.userName || 'User'}</h4>
                      <span>
                        <HiOutlineEnvelope
                          style={{ verticalAlign: 'middle', marginRight: 4 }}
                        />
                        {booking.userEmail || '—'}
                      </span>
                    </div>
                  </div>

                  {/* Booking details */}
                  <div className="ob-card__details">
                    <div className="ob-card__detail">
                      <HiOutlineCalendarDays />
                      <span>
                        <strong>Visit Date:</strong>{' '}
                        {formatDate(booking.preferredDate || booking.createdAt)}
                      </span>
                    </div>
                    {(booking.preferredDate || booking.createdAt) && (
                      <div className="ob-card__detail">
                        <HiOutlineClock />
                        <span>
                          <strong>Time:</strong>{' '}
                          {formatTime(booking.preferredDate || booking.createdAt)}
                        </span>
                      </div>
                    )}
                    <div className="ob-card__detail">
                      <HiOutlineTicket />
                      <span>
                        <strong>Type:</strong> {booking.bookingType || 'VISIT'}
                      </span>
                    </div>
                  </div>

                  {/* Message */}
                  {booking.message && (
                    <div className="ob-card__message">
                      <HiOutlineChatBubbleLeftEllipsis
                        style={{ verticalAlign: 'middle', marginRight: 6 }}
                      />
                      {booking.message}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="ob-card__footer">
                    <Link
                      to={`/properties/${booking.property?.id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      View Property
                    </Link>
                    {booking.status === 'PENDING' && (
                      <>
                        <button
                          className="btn btn-primary btn-sm"
                          style={{
                            background: 'var(--color-success)',
                            boxShadow: 'none',
                          }}
                          onClick={() => handleConfirm(booking.id)}
                          disabled={confirming === booking.id}
                        >
                          {confirming === booking.id ? (
                            <div
                              className="spinner"
                              style={{ width: 14, height: 14 }}
                            />
                          ) : (
                            <>
                              <HiOutlineCheckCircle /> Confirm
                            </>
                          )}
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setRejectModal(booking.id)}
                          disabled={rejecting === booking.id}
                        >
                          <HiOutlineXCircle /> Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="owner-bookings__empty animate-fade-in"
            id="owner-bookings-empty"
          >
            <div className="owner-bookings__empty-icon">
              <HiOutlineBuildingOffice2 />
            </div>
            <h3 className="heading-3">
              {activeTab === 'ALL'
                ? 'No bookings yet'
                : `No ${activeTab.toLowerCase()} bookings`}
            </h3>
            <p>
              {activeTab === 'ALL'
                ? 'Bookings will appear here when users schedule visits on your properties.'
                : `You don't have any ${activeTab.toLowerCase()} bookings right now.`}
            </p>
            <Link to="/my-properties" className="btn btn-primary">
              View My Properties
            </Link>
          </div>
        )}

        {/* Reject Reason Modal */}
        {rejectModal && (
          <div
            className="ob-reject-modal-overlay animate-fade-in"
            onClick={() => setRejectModal(null)}
          >
            <div
              className="ob-reject-modal animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="heading-4">Reject Booking</h3>
              <label
                className="form-label"
                style={{ marginBottom: 'var(--space-2)', display: 'block' }}
              >
                Reason for rejection (optional)
              </label>
              <textarea
                placeholder="Enter reason for rejecting this booking..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                id="owner-reject-reason-input"
              />
              <div className="ob-reject-modal__actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setRejectModal(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleRejectSubmit}
                  disabled={rejecting === rejectModal}
                  id="btn-owner-confirm-reject"
                >
                  {rejecting === rejectModal ? (
                    <div
                      className="spinner"
                      style={{ width: 16, height: 16 }}
                    />
                  ) : (
                    <>
                      <HiOutlineXCircle /> Reject Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
