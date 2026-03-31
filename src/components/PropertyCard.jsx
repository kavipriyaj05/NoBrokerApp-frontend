// PropertyCard — Kavi's file
// Reusable card for property listings

import { Link } from 'react-router-dom';
import { HiOutlineMapPin, HiOutlineHome } from 'react-icons/hi2';
import { MdOutlineBed, MdOutlineBathtub, MdOutlineSquareFoot } from 'react-icons/md';
import './PropertyCard.css';

export default function PropertyCard({ property, index = 0 }) {
  const {
    id,
    title,
    type,
    price,
    city,
    location,
    bedrooms,
    bathrooms,
    areaSqft,
    isFurnished,
    images,
    status,
  } = property;

  const primaryImage = images && images.length > 0
    ? images[0]
    : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80';

  const formatPrice = (p) => {
    if (p >= 10000000) return `₹${(p / 10000000).toFixed(1)} Cr`;
    if (p >= 100000) return `₹${(p / 100000).toFixed(1)} L`;
    if (p >= 1000) return `₹${(p / 1000).toFixed(0)}K`;
    return `₹${p}`;
  };

  return (
    <Link
      to={`/properties/${id}`}
      className={`property-card card animate-fade-in-up delay-${(index % 6) + 1}`}
      id={`property-card-${id}`}
    >
      {/* Image */}
      <div className="property-card__image-wrap">
        <img
          src={primaryImage}
          alt={title}
          className="property-card__image"
          loading="lazy"
        />
        <div className="property-card__overlay">
          <span className={`badge badge-${type === 'RENT' ? 'rent' : 'sale'}`}>
            {type === 'RENT' ? 'For Rent' : 'For Sale'}
          </span>
          {status && status !== 'APPROVED' && (
            <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>
          )}
        </div>
        {isFurnished && (
          <span className="property-card__furnished-badge">
            <HiOutlineHome /> Furnished
          </span>
        )}
      </div>

      {/* Content */}
      <div className="property-card__content">
        <div className="property-card__price">
          {formatPrice(price)}
          {type === 'RENT' && <span className="property-card__price-suffix">/month</span>}
        </div>

        <h3 className="property-card__title">{title}</h3>

        <div className="property-card__location">
          <HiOutlineMapPin />
          <span>{location}, {city}</span>
        </div>

        {/* Features */}
        <div className="property-card__features">
          {bedrooms != null && (
            <div className="property-card__feature">
              <MdOutlineBed />
              <span>{bedrooms} {bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
          )}
          {bathrooms != null && (
            <div className="property-card__feature">
              <MdOutlineBathtub />
              <span>{bathrooms} {bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
          )}
          {areaSqft != null && (
            <div className="property-card__feature">
              <MdOutlineSquareFoot />
              <span>{areaSqft} sqft</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
