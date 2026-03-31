// AdminDashboardPage — Jeyanth's file
// Admin panel with stats, pending approvals, user management, booking overview

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAdminStats,
  fetchPendingProperties,
  fetchAllUsers,
  fetchAllBookings,
  approveProperty,
  rejectProperty,
  clearAdminError,
  clearAdminSuccess,
} from '../store/adminSlice';
import {
  HiOutlineBuildingOffice2,
  HiOutlineUsers,
  HiOutlineCalendarDays,
  HiOutlineClipboardDocumentCheck,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineShieldCheck,
  HiOutlineMapPin,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import './AdminDashboardPage.css';

const ADMIN_TABS = [
  { key: 'pending', label: 'Pending Approvals', icon: <HiOutlineClipboardDocumentCheck /> },
  { key: 'users', label: 'Users', icon: <HiOutlineUsers /> },
  { key: 'bookings', label: 'Bookings', icon: <HiOutlineCalendarDays /> },
];

export default function AdminDashboardPage() {
  const dispatch = useDispatch();
  const {
    stats,
    pendingProperties,
    allUsers,
    allBookings,
    loading,
    actionLoading,
    error,
    success,
  } = useSelector((state) => state.admin);

  const [activeTab, setActiveTab] = useState('pending');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchPendingProperties());
  }, [dispatch]);

  useEffect(() => {
    if (activeTab === 'users' && allUsers.length === 0) {
      dispatch(fetchAllUsers());
    }
    if (activeTab === 'bookings' && allBookings.length === 0) {
      dispatch(fetchAllBookings());
    }
  }, [activeTab, dispatch, allUsers.length, allBookings.length]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAdminError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearAdminSuccess());
    }
  }, [success, dispatch]);

  const handleApprove = async (id) => {
    try {
      await dispatch(approveProperty(id)).unwrap();
    } catch (err) {
      toast.error(err || 'Failed to approve');
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectModal) return;
    try {
      await dispatch(rejectProperty({ id: rejectModal, reason: rejectReason })).unwrap();
      setRejectModal(null);
      setRejectReason('');
    } catch (err) {
      toast.error(err || 'Failed to reject');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatPrice = (p) => {
    if (!p) return '—';
    if (p >= 10000000) return `₹${(p / 10000000).toFixed(1)} Cr`;
    if (p >= 100000) return `₹${(p / 100000).toFixed(1)} L`;
    if (p >= 1000) return `₹${(p / 1000).toFixed(0)}K`;
    return `₹${p}`;
  };

  const statCards = [
    {
      label: 'Total Properties',
      value: stats?.totalProperties ?? '—',
      icon: <HiOutlineBuildingOffice2 />,
      variant: 'primary',
    },
    {
      label: 'Total Users',
      value: stats?.totalUsers ?? '—',
      icon: <HiOutlineUsers />,
      variant: 'info',
    },
    {
      label: 'Pending Approvals',
      value: stats?.pendingProperties ?? pendingProperties.length,
      icon: <HiOutlineClipboardDocumentCheck />,
      variant: 'warning',
    },
    {
      label: 'Total Bookings',
      value: stats?.totalBookings ?? '—',
      icon: <HiOutlineCalendarDays />,
      variant: 'success',
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="admin-dash container animate-fade-in">
        {/* Header */}
        <div className="admin-dash__header">
          <h1 className="heading-2">
            Admin Dashboard
            <span className="admin-dash__header-badge">
              <HiOutlineShieldCheck /> Admin
            </span>
          </h1>
          <p className="text-secondary">Manage properties, users, and bookings</p>
        </div>

        {/* Stats */}
        <div className="admin-dash__stats" id="admin-stats">
          {statCards.map((card, i) => (
            <div
              key={card.label}
              className={`admin-stat-card admin-stat-card--${card.variant} animate-fade-in-up delay-${i + 1}`}
            >
              <div className="admin-stat-card__icon">{card.icon}</div>
              <div className="admin-stat-card__value">{card.value}</div>
              <div className="admin-stat-card__label">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="admin-dash__tabs" id="admin-tabs">
          {ADMIN_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`admin-dash__tab ${activeTab === tab.key ? 'admin-dash__tab--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
              id={`admin-tab-${tab.key}`}
            >
              {tab.icon}
              {tab.label}
              {tab.key === 'pending' && pendingProperties.length > 0 && (
                <span className="admin-dash__tab-badge">{pendingProperties.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="admin-table-wrap">
            <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
              <div className="spinner spinner-dark" style={{ margin: '0 auto', width: 32, height: 32 }} />
              <p className="text-secondary" style={{ marginTop: 'var(--space-3)' }}>Loading...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Pending Approvals Tab */}
            {activeTab === 'pending' && (
              <div className="admin-table-wrap animate-fade-in" id="admin-pending-table">
                {pendingProperties.length > 0 ? (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Owner</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th>City</th>
                        <th>Listed On</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingProperties.map((prop) => (
                        <tr key={prop.id}>
                          <td>
                            <div className="admin-table__prop-cell">
                              <img
                                src={
                                  prop.images?.[0] ||
                                  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100&q=60'
                                }
                                alt={prop.title}
                                className="admin-table__prop-thumb"
                              />
                              <div className="admin-table__prop-info">
                                <h4>{prop.title}</h4>
                                <span><HiOutlineMapPin style={{ verticalAlign: 'middle' }} /> {prop.location}</span>
                              </div>
                            </div>
                          </td>
                          <td>{prop.ownerName || prop.owner?.name || '—'}</td>
                          <td>
                            <span className={`badge badge-${prop.type === 'RENT' ? 'rent' : 'sale'}`}>
                              {prop.type}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600 }}>{formatPrice(prop.price)}</td>
                          <td>{prop.city}</td>
                          <td>{formatDate(prop.createdAt)}</td>
                          <td>
                            <div className="admin-table__actions">
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleApprove(prop.id)}
                                disabled={actionLoading === prop.id}
                                style={{ background: 'var(--color-success)', boxShadow: 'none' }}
                              >
                                {actionLoading === prop.id ? (
                                  <div className="spinner" style={{ width: 12, height: 12 }} />
                                ) : (
                                  <><HiOutlineCheckCircle /> Approve</>
                                )}
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => setRejectModal(prop.id)}
                                disabled={actionLoading === prop.id}
                              >
                                <HiOutlineXCircle /> Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="admin-empty">
                    <HiOutlineCheckCircle />
                    <h3 className="heading-4">All caught up!</h3>
                    <p className="text-secondary">No properties pending approval right now.</p>
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="admin-table-wrap animate-fade-in" id="admin-users-table">
                {allUsers.length > 0 ? (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Provider</th>
                        <th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <div className="admin-table__user-cell">
                              <div className="admin-table__avatar">
                                {getInitials(user.name)}
                              </div>
                              <span style={{ fontWeight: 600 }}>{user.name}</span>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge ${user.role === 'ADMIN' ? 'badge-sale' : 'badge-rent'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                            {user.authProvider || user.provider || 'LOCAL'}
                          </td>
                          <td>{formatDate(user.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="admin-empty">
                    <HiOutlineUsers />
                    <h3 className="heading-4">No users found</h3>
                    <p className="text-secondary">Users will appear here once they register.</p>
                  </div>
                )}
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="admin-table-wrap animate-fade-in" id="admin-bookings-table">
                {allBookings.length > 0 ? (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Booked By</th>
                        <th>Type</th>
                        <th>Visit Date</th>
                        <th>Status</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td>
                            <span style={{ fontWeight: 600 }}>
                              {booking.propertyTitle || booking.property?.title || `Property #${booking.propertyId || '—'}`}
                            </span>
                          </td>
                          <td>
                            <div className="admin-table__user-cell">
                              <div className="admin-table__avatar">
                                {getInitials(booking.userName || booking.user?.name)}
                              </div>
                              <span>{booking.userName || booking.user?.name || '—'}</span>
                            </div>
                          </td>
                          <td>{booking.type || 'VISIT'}</td>
                          <td>{formatDate(booking.visitDate)}</td>
                          <td>
                            <span className={`badge ${
                              booking.status === 'CONFIRMED' ? 'badge-approved' :
                              booking.status === 'CANCELLED' ? 'badge-rejected' : 'badge-pending'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td>{formatDate(booking.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="admin-empty">
                    <HiOutlineCalendarDays />
                    <h3 className="heading-4">No bookings yet</h3>
                    <p className="text-secondary">Bookings will appear here once users schedule visits.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Reject Modal */}
        {rejectModal && (
          <div className="admin-reject-modal-overlay animate-fade-in" onClick={() => setRejectModal(null)}>
            <div className="admin-reject-modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <h3 className="heading-4">Reject Property</h3>
              <label className="form-label" style={{ marginBottom: 'var(--space-2)', display: 'block' }}>
                Reason for rejection (optional)
              </label>
              <textarea
                placeholder="Enter reason for rejecting this property..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                id="reject-reason-input"
              />
              <div className="admin-reject-modal__actions">
                <button className="btn btn-secondary" onClick={() => setRejectModal(null)}>
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleRejectSubmit}
                  disabled={actionLoading === rejectModal}
                  id="btn-confirm-reject"
                >
                  {actionLoading === rejectModal ? (
                    <div className="spinner" style={{ width: 16, height: 16 }} />
                  ) : (
                    <><HiOutlineXCircle /> Reject Property</>
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
