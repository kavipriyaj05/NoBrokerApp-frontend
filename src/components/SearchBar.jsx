// SearchBar — Kavi's file
// Hero search bar for PropertyListPage

import { useState } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineMapPin } from 'react-icons/hi2';
import { CITIES, PROPERTY_TYPES } from '../utils/constants';
import './SearchBar.css';

export default function SearchBar({ onSearch, initialValues = {} }) {
  const [city, setCity] = useState(initialValues.city || '');
  const [type, setType] = useState(initialValues.type || '');
  const [keyword, setKeyword] = useState(initialValues.keyword || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ city, type, keyword });
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit} id="property-search-bar">
      <div className="search-bar__inner">
        {/* City select */}
        <div className="search-bar__field">
          <HiOutlineMapPin className="search-bar__icon" />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="search-bar__select"
            id="search-city-select"
          >
            <option value="">All Cities</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="search-bar__divider" />

        {/* Type select */}
        <div className="search-bar__field">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="search-bar__select"
            id="search-type-select"
          >
            <option value="">Rent & Sale</option>
            <option value={PROPERTY_TYPES.RENT}>For Rent</option>
            <option value={PROPERTY_TYPES.SALE}>For Sale</option>
          </select>
        </div>

        <div className="search-bar__divider" />

        {/* Keyword input */}
        <div className="search-bar__field search-bar__field--grow">
          <HiOutlineMagnifyingGlass className="search-bar__icon" />
          <input
            type="text"
            placeholder="Search by location, title..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="search-bar__input"
            id="search-keyword-input"
          />
        </div>

        {/* Submit */}
        <button type="submit" className="search-bar__btn" id="search-submit-btn">
          <HiOutlineMagnifyingGlass />
          <span>Search</span>
        </button>
      </div>
    </form>
  );
}
