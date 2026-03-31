// MyPropertiesPage — Jeyanth's file
// Lists properties owned by the logged-in user with edit/delete actions

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyProperties, deleteProperty, clearPropertyError } from '../store/propertySlice';
import {
  HiOutlineMapPin,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineBuildingOffice,
  HiOutlineExclamationTriangle,
} from 'react-icons/hi2';
import { MdOutlineBed, MdOutlineBathtub, MdOutlineSquareFoot } from 'react-icons/md';
import toast from 'react-hot-toast';
import './MyPropertiesPage.css';

export default function MyPropertiesPage() {
  const dispatch = useDispatch();
  const { myProperties, loading, deleting, error } = useSelector((state) => state.property);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    dispatch(fetchMyProperties());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearPropertyError());
    }
  }, [error, dispatch]);

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await dispatch(deleteProperty(deleteModal)).unwrap();
      toast.success('Property deleted successfully');
      setDeleteModal(null);
    } catch (err) {
      toast.error(err || 'Failed to delete property');
    }
  };

  const formatPrice = (p) => {
    if (p >= 10000000) return `₹${(p / 10000000).toFixed(1)} Cr`;
    if (p >= 100000) return `₹${(p / 100000).toFixed(1)} L`;
    if (p >= 1000) return `₹${(p / 1000).toFixed(0)}K`;
    return `₹${p}`;
  };

  return (
    <div className="page-wrapper">
      <div className="my-properties container animate-fade-in">
        {/* Header */}
        <div className="my-properties__header">
          <div className="my-properties__header-left">
            <h1 className="heading-2">
              My Properties
              {myProperties.length > 0 && (
                <span className="my-properties__count">{myProperties.length}</span>
              )}
            </h1>
            <p className="text-secondary">Manage your listed properties</p>
          </div>
          <Link to="/add-property" className="btn btn-primary" id="btn-add-new">
            <HiOutlinePlus /> Add New Property
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="my-properties__grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="my-prop-card">
                <div className="skeleton" style={{ aspectRatio: '16/9' }} />
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div className="skeleton" style={{ height: 22, width: '50%' }} />
                  <div className="skeleton" style={{ height: 16, width: '80%' }} />
                  <div className="skeleton" style={{ height: 14, width: '60%' }} />
                  <div className="skeleton" style={{ height: 36, width: '100%', marginTop: 8 }} />
                </div>
              </div>
            ))}
          </div>
        ) : myProperties.length > 0 ? (
          <div className="my-properties__grid" id="my-properties-grid">
            {myProperties.map((property, index) => (
              <div
                key={property.id}
                className={`my-prop-card animate-fade-in-up delay-${(index % 6) + 1}`}
                id={`my-prop-${property.id}`}
              >
                {/* Image */}
                <div className="my-prop-card__image-wrap">
                  <img
                    src={
                      property.images && property.images.length > 0
                        ? property.images[0]
                        : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80'
                    }
                    alt={property.title}
                    className="my-prop-card__image"
                    loading="lazy"
                  />
                  <div className="my-prop-card__badges">
                    <span className={`badge badge-${property.type === 'RENT' ? 'rent' : 'sale'}`}>
                      {property.type === 'RENT' ? 'Rent' : 'Sale'}
                    </span>
                    <span className={`badge badge-${(property.status || 'pending').toLowerCase()}`}>
                      {property.status || 'PENDING'}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="my-prop-card__body">
                  <div className="my-prop-card__price">
                    {formatPrice(property.price)}
                    {property.type === 'RENT' && (
                      <span className="my-prop-card__price-suffix">/month</span>
                    )}
                  </div>
                  <h3 className="my-prop-card__title">{property.title}</h3>
                  <div className="my-prop-card__location">
                    <HiOutlineMapPin />
                    <span>{property.location}, {property.city}</span>
                  </div>

                  <div className="my-prop-card__meta">
                    {property.bedrooms != null && (
                      <div className="my-prop-card__meta-item">
                        <MdOutlineBed /> {property.bedrooms} Bed
                      </div>
                    )}
                    {property.bathrooms != null && (
                      <div className="my-prop-card__meta-item">
                        <MdOutlineBathtub /> {property.bathrooms} Bath
                      </div>
                    )}
                    {property.areaSqft != null && (
                      <div className="my-prop-card__meta-item">
                        <MdOutlineSquareFoot /> {property.areaSqft} sqft
                      </div>
                    )}
                  </div>

                  <div className="my-prop-card__actions">
                    <Link
                      to={`/properties/${property.id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      <HiOutlinePencilSquare /> View
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteModal(property.id)}
                      disabled={deleting === property.id}
                    >
                      {deleting === property.id ? (
                        <div className="spinner" style={{ width: 14, height: 14 }} />
                      ) : (
                        <><HiOutlineTrash /> Delete</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="my-properties__empty animate-fade-in" id="my-properties-empty">
            <div className="my-properties__empty-icon">
              <HiOutlineBuildingOffice />
            </div>
            <h3 className="heading-3">No properties listed yet</h3>
            <p>Start by listing your first property. It&apos;s quick and easy — no brokerage!</p>
            <Link to="/add-property" className="btn btn-primary">
              <HiOutlinePlus /> List Your First Property
            </Link>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal && (
          <div className="my-prop-modal-overlay animate-fade-in" onClick={() => setDeleteModal(null)}>
            <div className="my-prop-modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <div className="my-prop-modal__icon">
                <HiOutlineExclamationTriangle />
              </div>
              <h3 className="heading-4">Delete Property?</h3>
              <p>This action cannot be undone. The property listing and all associated data will be permanently removed.</p>
              <div className="my-prop-modal__actions">
                <button className="btn btn-secondary" onClick={() => setDeleteModal(null)}>
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? <div className="spinner" style={{ width: 16, height: 16 }} /> : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
