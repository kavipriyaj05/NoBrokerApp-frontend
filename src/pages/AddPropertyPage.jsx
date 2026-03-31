// AddPropertyPage — Jeyanth's file
// Form to list a new property for rent or sale

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createProperty, clearPropertyError, clearPropertySuccess } from '../store/propertySlice';
import { PROPERTY_TYPES, CITIES, BEDROOM_OPTIONS } from '../utils/constants';
import {
  HiOutlineBuildingOffice,
  HiOutlineMapPin,
  HiOutlineCurrencyRupee,
  HiOutlinePhoto,
  HiOutlineXMark,
  HiOutlineCloudArrowUp,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';
import { MdOutlineBed, MdOutlineBathtub, MdOutlineSquareFoot } from 'react-icons/md';
import toast from 'react-hot-toast';
import './AddPropertyPage.css';

const initialForm = {
  title: '',
  description: '',
  type: 'RENT',
  price: '',
  city: '',
  location: '',
  bedrooms: '',
  bathrooms: '',
  areaSqft: '',
  isFurnished: false,
};

export default function AddPropertyPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { creating, error } = useSelector((state) => state.property);

  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearPropertyError());

    // Basic validation
    if (!form.title || !form.city || !form.location || !form.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    // Append property fields
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    // Append images
    images.forEach((img) => {
      formData.append('images', img);
    });

    try {
      await dispatch(createProperty(formData)).unwrap();
      toast.success('Property listed successfully! It will be visible after admin approval.');
      dispatch(clearPropertySuccess());
      navigate('/my-properties');
    } catch (err) {
      toast.error(err || 'Failed to create property');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="add-property container animate-fade-in-up">
        {/* Header */}
        <div className="add-property__header">
          <div className="add-property__header-icon">
            <HiOutlineBuildingOffice />
          </div>
          <h1 className="heading-2">List Your Property</h1>
          <p>Fill in the details below to list your property. Once submitted, it will be reviewed by our team.</p>
        </div>

        {/* Form Card */}
        <div className="add-property__card">
          <form className="add-property__form" onSubmit={handleSubmit} id="add-property-form">
            {/* Error Alert */}
            {error && (
              <div className="add-property__alert add-property__alert--error">
                <HiOutlineXMark /> {error}
              </div>
            )}

            {/* Basic Info */}
            <div className="add-property__section">
              <h3 className="add-property__section-title">
                <HiOutlineBuildingOffice /> Basic Information
              </h3>

              <div className="add-property__row--full form-group" style={{ marginBottom: 'var(--space-5)' }}>
                <label className="form-label">Property Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-input"
                  placeholder="e.g., Spacious 3BHK Apartment in Koramangala"
                  value={form.title}
                  onChange={handleChange}
                  required
                  id="input-title"
                />
              </div>

              <div className="add-property__row--full form-group" style={{ marginBottom: 'var(--space-5)' }}>
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="add-property__textarea"
                  placeholder="Describe your property — amenities, nearby landmarks, condition..."
                  value={form.description}
                  onChange={handleChange}
                  id="input-description"
                />
              </div>

              <div className="add-property__row">
                <div className="form-group">
                  <label className="form-label">Listing Type *</label>
                  <select
                    name="type"
                    className="add-property__select"
                    value={form.type}
                    onChange={handleChange}
                    id="input-type"
                  >
                    <option value={PROPERTY_TYPES.RENT}>For Rent</option>
                    <option value={PROPERTY_TYPES.SALE}>For Sale</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <HiOutlineCurrencyRupee style={{ verticalAlign: 'middle' }} /> Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    className="form-input"
                    placeholder={form.type === 'RENT' ? 'Monthly rent' : 'Total price'}
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    required
                    id="input-price"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="add-property__section">
              <h3 className="add-property__section-title">
                <HiOutlineMapPin /> Location
              </h3>
              <div className="add-property__row">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <select
                    name="city"
                    className="add-property__select"
                    value={form.city}
                    onChange={handleChange}
                    required
                    id="input-city"
                  >
                    <option value="">Select a city</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Locality / Area *</label>
                  <input
                    type="text"
                    name="location"
                    className="form-input"
                    placeholder="e.g., Koramangala, HSR Layout"
                    value={form.location}
                    onChange={handleChange}
                    required
                    id="input-location"
                  />
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="add-property__section">
              <h3 className="add-property__section-title">
                <MdOutlineBed /> Property Details
              </h3>
              <div className="add-property__row--3">
                <div className="form-group">
                  <label className="form-label"><MdOutlineBed style={{ verticalAlign: 'middle' }} /> Bedrooms</label>
                  <select
                    name="bedrooms"
                    className="add-property__select"
                    value={form.bedrooms}
                    onChange={handleChange}
                    id="input-bedrooms"
                  >
                    <option value="">Select</option>
                    {BEDROOM_OPTIONS.map((n) => (
                      <option key={n} value={n}>{n} BHK</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label"><MdOutlineBathtub style={{ verticalAlign: 'middle' }} /> Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    className="form-input"
                    placeholder="No. of bathrooms"
                    value={form.bathrooms}
                    onChange={handleChange}
                    min="0"
                    max="10"
                    id="input-bathrooms"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label"><MdOutlineSquareFoot style={{ verticalAlign: 'middle' }} /> Area (sqft)</label>
                  <input
                    type="number"
                    name="areaSqft"
                    className="form-input"
                    placeholder="Area in sqft"
                    value={form.areaSqft}
                    onChange={handleChange}
                    min="0"
                    id="input-area"
                  />
                </div>
              </div>

              <label className="add-property__checkbox-wrap" style={{ marginTop: 'var(--space-5)' }}>
                <input
                  type="checkbox"
                  name="isFurnished"
                  checked={form.isFurnished}
                  onChange={handleChange}
                  id="input-furnished"
                />
                <span className="form-label" style={{ margin: 0 }}>This property is furnished</span>
              </label>
            </div>

            {/* Images */}
            <div className="add-property__section">
              <h3 className="add-property__section-title">
                <HiOutlinePhoto /> Property Images
              </h3>

              <div
                className="add-property__upload"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="add-property__upload-icon">
                  <HiOutlineCloudArrowUp />
                </div>
                <p><strong>Click to upload</strong> or drag and drop</p>
                <p className="text-xs text-muted" style={{ marginTop: 4 }}>PNG, JPG up to 5MB each · Max 10 images</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  id="input-images"
                />
              </div>

              {previews.length > 0 && (
                <div className="add-property__previews">
                  {previews.map((src, i) => (
                    <div key={i} className="add-property__preview animate-scale-in">
                      <img src={src} alt={`Preview ${i + 1}`} />
                      <button
                        type="button"
                        className="add-property__preview-remove"
                        onClick={() => removeImage(i)}
                        aria-label="Remove image"
                      >
                        <HiOutlineXMark />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>

          {/* Actions */}
          <div className="add-property__actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
              id="btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-property-form"
              className="btn btn-primary btn-lg"
              disabled={creating}
              id="btn-submit-property"
            >
              {creating ? (
                <><div className="spinner" /> Submitting...</>
              ) : (
                <><HiOutlineCheckCircle /> List Property</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
