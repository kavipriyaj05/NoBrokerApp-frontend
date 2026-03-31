// PropertyDetailPage — Kavi's file
// Detailed view of a single property

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../api/api';
import toast from 'react-hot-toast';
import {
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineArrowLeft,
  HiOutlineCalendarDays,
  HiOutlineHeart,
  HiOutlineShare,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineHome,
  HiOutlineUser,
} from 'react-icons/hi2';
import {
  MdOutlineBed,
  MdOutlineBathtub,
  MdOutlineSquareFoot,
  MdOutlineChair,
} from 'react-icons/md';
import './PropertyDetailPage.css';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/properties/${id}`);
        setProperty(response.data.data);
      } catch (err) {
        console.error('Failed to fetch property:', err);
        toast.error('Property not found');
        navigate('/', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, navigate]);

  const formatPrice = (p) => {
    if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
    if (p >= 100000) return `₹${(p / 100000).toFixed(2)} Lakh`;
    return `₹${p.toLocaleString('en-IN')}`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const nextImage = () => {
    if (property.images && property.images.length > 0) {
      setActiveImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property.images && property.images.length > 0) {
      setActiveImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="detail-skeleton container animate-fade-in">
          <div className="skeleton" style={{ height: 420, borderRadius: 'var(--radius-xl)' }} />
          <div style={{ display: 'flex', gap: 32, marginTop: 24 }}>
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: 32, width: '60%', marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 20, width: '40%', marginBottom: 24 }} />
              <div className="skeleton" style={{ height: 80 }} />
            </div>
            <div style={{ width: 340 }}>
              <div className="skeleton" style={{ height: 200, borderRadius: 'var(--radius-xl)' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) return null;

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80'];

  return (
    <div className="page-wrapper" id="property-detail-page">
      <div className="detail container animate-fade-in">
        {/* Back navigation */}
        <button className="detail__back btn btn-ghost" onClick={() => navigate(-1)} id="detail-back-btn">
          <HiOutlineArrowLeft />
          Back to listings
        </button>

        {/* Image Gallery */}
        <div className="detail__gallery" id="detail-gallery">
          <div className="detail__main-image-wrap">
            <img
              src={images[activeImageIndex]}
              alt={`${property.title} - Image ${activeImageIndex + 1}`}
              className="detail__main-image"
            />

            {/* Type badge */}
            <div className="detail__gallery-badge">
              <span className={`badge badge-${property.type === 'RENT' ? 'rent' : 'sale'}`}>
                {property.type === 'RENT' ? 'For Rent' : 'For Sale'}
              </span>
            </div>

            {/* Actions */}
            <div className="detail__gallery-actions">
              <button className="detail__gallery-action" onClick={handleShare} aria-label="Share">
                <HiOutlineShare />
              </button>
              <button className="detail__gallery-action" aria-label="Save">
                <HiOutlineHeart />
              </button>
            </div>

            {/* Nav arrows */}
            {images.length > 1 && (
              <>
                <button className="detail__gallery-nav detail__gallery-nav--prev" onClick={prevImage}>
                  <HiOutlineChevronLeft />
                </button>
                <button className="detail__gallery-nav detail__gallery-nav--next" onClick={nextImage}>
                  <HiOutlineChevronRight />
                </button>
                <div className="detail__gallery-counter">
                  {activeImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="detail__thumbnails">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`detail__thumbnail ${i === activeImageIndex ? 'detail__thumbnail--active' : ''}`}
                  onClick={() => setActiveImageIndex(i)}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="detail__content">
          <div className="detail__main">
            {/* Header */}
            <div className="detail__header">
              <div className="detail__price-row">
                <span className="detail__price">{formatPrice(property.price)}</span>
                {property.type === 'RENT' && (
                  <span className="detail__price-suffix">/month</span>
                )}
              </div>
              <h1 className="heading-2 detail__title">{property.title}</h1>
              <div className="detail__location">
                <HiOutlineMapPin />
                <span>{property.location}, {property.city}, {property.state} {property.pincode ? `- ${property.pincode}` : ''}</span>
              </div>
            </div>

            {/* Key features */}
            <div className="detail__features card" id="detail-features">
              {property.bedrooms != null && (
                <div className="detail__feature">
                  <MdOutlineBed className="detail__feature-icon" />
                  <div>
                    <span className="detail__feature-value">{property.bedrooms}</span>
                    <span className="detail__feature-label">Bedrooms</span>
                  </div>
                </div>
              )}
              {property.bathrooms != null && (
                <div className="detail__feature">
                  <MdOutlineBathtub className="detail__feature-icon" />
                  <div>
                    <span className="detail__feature-value">{property.bathrooms}</span>
                    <span className="detail__feature-label">Bathrooms</span>
                  </div>
                </div>
              )}
              {property.areaSqft != null && (
                <div className="detail__feature">
                  <MdOutlineSquareFoot className="detail__feature-icon" />
                  <div>
                    <span className="detail__feature-value">{property.areaSqft}</span>
                    <span className="detail__feature-label">Sq. Ft.</span>
                  </div>
                </div>
              )}
              <div className="detail__feature">
                <MdOutlineChair className="detail__feature-icon" />
                <div>
                  <span className="detail__feature-value">{property.isFurnished ? 'Yes' : 'No'}</span>
                  <span className="detail__feature-label">Furnished</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="detail__section" id="detail-description">
                <h3 className="heading-4">About this property</h3>
                <p className="text-body text-secondary detail__description">
                  {property.description}
                </p>
              </div>
            )}

            {/* Details grid */}
            <div className="detail__section">
              <h3 className="heading-4">Property Details</h3>
              <div className="detail__details-grid">
                <div className="detail__detail-item">
                  <span className="detail__detail-label">Type</span>
                  <span className="detail__detail-value">{property.type === 'RENT' ? 'For Rent' : 'For Sale'}</span>
                </div>
                <div className="detail__detail-item">
                  <span className="detail__detail-label">City</span>
                  <span className="detail__detail-value">{property.city}</span>
                </div>
                <div className="detail__detail-item">
                  <span className="detail__detail-label">State</span>
                  <span className="detail__detail-value">{property.state}</span>
                </div>
                {property.pincode && (
                  <div className="detail__detail-item">
                    <span className="detail__detail-label">Pincode</span>
                    <span className="detail__detail-value">{property.pincode}</span>
                  </div>
                )}
                <div className="detail__detail-item">
                  <span className="detail__detail-label">Furnished</span>
                  <span className="detail__detail-value">{property.isFurnished ? 'Furnished' : 'Unfurnished'}</span>
                </div>
                {property.createdAt && (
                  <div className="detail__detail-item">
                    <span className="detail__detail-label">Listed on</span>
                    <span className="detail__detail-value">
                      {new Date(property.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="detail__sidebar">
            {/* Owner card */}
            {property.owner && (
              <div className="detail__owner-card card" id="detail-owner-card">
                <div className="detail__owner-header">
                  <div className="detail__owner-avatar">
                    <HiOutlineUser />
                  </div>
                  <div>
                    <h4 className="detail__owner-name">{property.owner.name}</h4>
                    <span className="text-xs text-muted">Property Owner</span>
                  </div>
                </div>

                <div className="detail__owner-contacts">
                  {property.owner.phone && (
                    <a href={`tel:${property.owner.phone}`} className="detail__owner-contact">
                      <HiOutlinePhone />
                      <span>{property.owner.phone}</span>
                    </a>
                  )}
                  <a href={`mailto:${property.owner.email}`} className="detail__owner-contact">
                    <HiOutlineEnvelope />
                    <span>{property.owner.email}</span>
                  </a>
                </div>

                {isAuthenticated ? (
                  <Link
                    to={`/properties/${id}`}
                    className="btn btn-primary btn-lg detail__book-btn"
                    id="detail-book-visit-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      // BookingModal is Jeyanth's component — dispatch event for integration
                      window.dispatchEvent(new CustomEvent('open-booking-modal', { detail: { propertyId: id } }));
                    }}
                  >
                    <HiOutlineCalendarDays />
                    Book a Visit
                  </Link>
                ) : (
                  <Link to="/login" className="btn btn-primary btn-lg detail__book-btn" id="detail-login-to-book">
                    <HiOutlineCalendarDays />
                    Login to Book Visit
                  </Link>
                )}
              </div>
            )}

            {/* Quick info */}
            <div className="detail__quick-info card">
              <h4 className="heading-4" style={{ marginBottom: 'var(--space-4)' }}>
                <HiOutlineHome style={{ marginRight: 6 }} />
                Quick Facts
              </h4>
              <ul className="detail__quick-list">
                <li>
                  <span>Price</span>
                  <strong>{formatPrice(property.price)}{property.type === 'RENT' ? '/mo' : ''}</strong>
                </li>
                <li>
                  <span>Type</span>
                  <strong>{property.type}</strong>
                </li>
                {property.bedrooms != null && (
                  <li>
                    <span>Bedrooms</span>
                    <strong>{property.bedrooms} BHK</strong>
                  </li>
                )}
                {property.areaSqft != null && (
                  <li>
                    <span>Area</span>
                    <strong>{property.areaSqft} sqft</strong>
                  </li>
                )}
                <li>
                  <span>Location</span>
                  <strong>{property.city}</strong>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
