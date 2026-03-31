// FilterPanel — Kavi's file
// Sidebar filter panel for PropertyListPage

import { useState } from 'react';
import { BEDROOM_OPTIONS, PROPERTY_TYPES } from '../utils/constants';
import { HiOutlineAdjustmentsHorizontal, HiOutlineXMark } from 'react-icons/hi2';
import './FilterPanel.css';

export default function FilterPanel({ filters, onFilterChange, onClear }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const activeCount = Object.values(filters).filter((v) => v !== '' && v != null).length;

  return (
    <>
      {/* Mobile filter toggle */}
      <button
        className="filter-toggle btn btn-secondary"
        onClick={() => setIsOpen(true)}
        id="filter-toggle-btn"
      >
        <HiOutlineAdjustmentsHorizontal />
        <span>Filters</span>
        {activeCount > 0 && <span className="filter-toggle__count">{activeCount}</span>}
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className="filter-overlay" onClick={() => setIsOpen(false)} />}

      {/* Panel */}
      <aside className={`filter-panel ${isOpen ? 'filter-panel--open' : ''}`} id="filter-panel">
        <div className="filter-panel__header">
          <h3 className="heading-4">Filters</h3>
          <div className="filter-panel__header-actions">
            {activeCount > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={onClear} id="filter-clear-btn">
                Clear all
              </button>
            )}
            <button
              className="filter-panel__close"
              onClick={() => setIsOpen(false)}
              aria-label="Close filters"
            >
              <HiOutlineXMark />
            </button>
          </div>
        </div>

        <div className="filter-panel__body">
          {/* Property Type */}
          <div className="filter-section">
            <label className="filter-section__label">Property Type</label>
            <div className="filter-chips">
              <button
                className={`filter-chip ${!filters.type ? 'filter-chip--active' : ''}`}
                onClick={() => handleChange('type', '')}
              >
                All
              </button>
              <button
                className={`filter-chip ${filters.type === PROPERTY_TYPES.RENT ? 'filter-chip--active' : ''}`}
                onClick={() => handleChange('type', PROPERTY_TYPES.RENT)}
              >
                Rent
              </button>
              <button
                className={`filter-chip ${filters.type === PROPERTY_TYPES.SALE ? 'filter-chip--active' : ''}`}
                onClick={() => handleChange('type', PROPERTY_TYPES.SALE)}
              >
                Sale
              </button>
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-section">
            <label className="filter-section__label">Price Range</label>
            <div className="filter-price-inputs">
              <input
                type="number"
                placeholder="Min ₹"
                value={filters.minPrice || ''}
                onChange={(e) => handleChange('minPrice', e.target.value)}
                className="form-input filter-price-input"
                id="filter-min-price"
              />
              <span className="filter-price-separator">to</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={filters.maxPrice || ''}
                onChange={(e) => handleChange('maxPrice', e.target.value)}
                className="form-input filter-price-input"
                id="filter-max-price"
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div className="filter-section">
            <label className="filter-section__label">Bedrooms</label>
            <div className="filter-chips">
              <button
                className={`filter-chip ${!filters.bedrooms ? 'filter-chip--active' : ''}`}
                onClick={() => handleChange('bedrooms', '')}
              >
                Any
              </button>
              {BEDROOM_OPTIONS.map((n) => (
                <button
                  key={n}
                  className={`filter-chip ${filters.bedrooms == n ? 'filter-chip--active' : ''}`}
                  onClick={() => handleChange('bedrooms', n)}
                >
                  {n} {n === 5 ? '+' : ''} BHK
                </button>
              ))}
            </div>
          </div>

          {/* Furnished */}
          <div className="filter-section">
            <label className="filter-section__label">Furnished</label>
            <div className="filter-chips">
              <button
                className={`filter-chip ${filters.furnished === '' || filters.furnished == null ? 'filter-chip--active' : ''}`}
                onClick={() => handleChange('furnished', '')}
              >
                Any
              </button>
              <button
                className={`filter-chip ${filters.furnished === 'true' ? 'filter-chip--active' : ''}`}
                onClick={() => handleChange('furnished', 'true')}
              >
                Furnished
              </button>
              <button
                className={`filter-chip ${filters.furnished === 'false' ? 'filter-chip--active' : ''}`}
                onClick={() => handleChange('furnished', 'false')}
              >
                Unfurnished
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
