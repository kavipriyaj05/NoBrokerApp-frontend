// PropertyListPage — Kavi's file
// Home page — browse approved properties with search + filters

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/api';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import PropertyCard from '../components/PropertyCard';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';
import {
  HiOutlineBuildingOffice2,
  HiOutlineArrowPath,
  HiOutlineMagnifyingGlass,
  HiOutlineCalendarDays,
  HiOutlineKey,
} from 'react-icons/hi2';
import './PropertyListPage.css';

export default function PropertyListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    furnished: searchParams.get('furnished') || '',
  });

  const [searchValues, setSearchValues] = useState({
    city: filters.city,
    type: filters.type,
    keyword: searchParams.get('keyword') || '',
  });

  const fetchProperties = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.city) params.set('city', filters.city);
      if (filters.type) params.set('type', filters.type);
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      if (filters.bedrooms) params.set('bedrooms', filters.bedrooms);
      params.set('page', page);
      params.set('size', DEFAULT_PAGE_SIZE);

      const response = await api.get(`/properties?${params.toString()}`);
      const data = response.data.data;

      if (data && data.content) {
        setProperties(data.content);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        setCurrentPage(data.currentPage || 0);
      } else if (Array.isArray(data)) {
        setProperties(data);
        setTotalPages(1);
        setTotalElements(data.length);
        setCurrentPage(0);
      } else {
        setProperties([]);
      }
    } catch (err) {
      console.error('Failed to fetch properties:', err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProperties(0);
  }, [fetchProperties]);

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const handleSearch = ({ city, type, keyword }) => {
    setSearchValues({ city, type, keyword });
    setFilters((prev) => ({ ...prev, city: city || prev.city, type: type || prev.type }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      city: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      furnished: '',
    });
    setSearchValues({ city: '', type: '', keyword: '' });
  };

  const handlePageChange = (page) => {
    fetchProperties(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero__bg">
          <div className="hero__gradient" />
          <div className="hero__pattern" />
        </div>
        <div className="hero__content container">
          <div className="hero__text animate-fade-in-up">
            <span className="hero__badge">
              <HiOutlineBuildingOffice2 />
              Zero Brokerage
            </span>
            <h1 className="heading-1 hero__title">
              Find Your <span className="hero__title-accent">Dream Home</span>
              <br />Without Any Brokerage
            </h1>
            <p className="hero__subtitle text-body">
              Connect directly with property owners. No middlemen, no hidden charges — just your perfect home.
            </p>
          </div>
          <div className="hero__search animate-fade-in-up delay-2">
            <SearchBar onSearch={handleSearch} initialValues={searchValues} />
          </div>
          <div className="hero__stats animate-fade-in-up delay-3">
            <div className="hero__stat">
              <span className="hero__stat-value">10K+</span>
              <span className="hero__stat-label">Properties</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-value">50K+</span>
              <span className="hero__stat-label">Happy Users</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-value">15+</span>
              <span className="hero__stat-label">Cities</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="how-it-works">
        <div className="how-it-works__inner container">
          <h2 className="heading-2 how-it-works__title animate-fade-in">How It Works</h2>
          <p className="text-secondary how-it-works__subtitle animate-fade-in">
            Find and move into your dream home in just 3 simple steps
          </p>
          <div className="how-it-works__steps">
            <div className="how-step animate-fade-in-up delay-1">
              <div className="how-step__number">1</div>
              <div className="how-step__icon how-step__icon--search">
                <HiOutlineMagnifyingGlass />
              </div>
              <h3 className="how-step__title">Search Properties</h3>
              <p className="how-step__desc">
                Browse thousands of verified listings across 15+ cities. Filter by budget, type, and location.
              </p>
            </div>
            <div className="how-step animate-fade-in-up delay-2">
              <div className="how-step__number">2</div>
              <div className="how-step__icon how-step__icon--book">
                <HiOutlineCalendarDays />
              </div>
              <h3 className="how-step__title">Book a Visit</h3>
              <p className="how-step__desc">
                Schedule a visit directly with the property owner. No brokers, no middlemen — just you and the owner.
              </p>
            </div>
            <div className="how-step animate-fade-in-up delay-3">
              <div className="how-step__number">3</div>
              <div className="how-step__icon how-step__icon--move">
                <HiOutlineKey />
              </div>
              <h3 className="how-step__title">Move In</h3>
              <p className="how-step__desc">
                Once confirmed, finalize the deal directly. Save lakhs in brokerage fees — that&apos;s the NoBroker promise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="properties-section container" id="properties-section">
        <div className="properties-section__header">
          <div>
            <h2 className="heading-2">Available Properties</h2>
            <p className="text-secondary">
              {totalElements > 0
                ? `${totalElements} properties found`
                : 'Browse our curated listings'}
            </p>
          </div>
        </div>

        <div className="properties-layout">
          {/* Desktop filter sidebar */}
          <div className="properties-filter-sidebar">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          </div>

          {/* Grid */}
          <div className="properties-grid-wrapper">
            {loading ? (
              <div className="properties-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="property-skeleton card">
                    <div className="skeleton" style={{ aspectRatio: '16/10' }} />
                    <div className="property-skeleton__body">
                      <div className="skeleton" style={{ height: 24, width: '40%' }} />
                      <div className="skeleton" style={{ height: 18, width: '80%' }} />
                      <div className="skeleton" style={{ height: 14, width: '60%' }} />
                      <div className="skeleton" style={{ height: 14, width: '90%', marginTop: 8 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length > 0 ? (
              <>
                <div className="properties-grid" id="properties-grid">
                  {properties.map((property, index) => (
                    <PropertyCard key={property.id} property={property} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination" id="pagination">
                    <button
                      className="btn btn-secondary btn-sm"
                      disabled={currentPage === 0}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </button>
                    <div className="pagination__pages">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          className={`pagination__page ${currentPage === i ? 'pagination__page--active' : ''}`}
                          onClick={() => handlePageChange(i)}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      className="btn btn-secondary btn-sm"
                      disabled={currentPage >= totalPages - 1}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="properties-empty animate-fade-in" id="properties-empty">
                <div className="properties-empty__icon">
                  <HiOutlineBuildingOffice2 />
                </div>
                <h3 className="heading-3">No properties found</h3>
                <p className="text-secondary">
                  Try changing your filters or search criteria
                </p>
                <button className="btn btn-secondary" onClick={handleClearFilters}>
                  <HiOutlineArrowPath />
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
