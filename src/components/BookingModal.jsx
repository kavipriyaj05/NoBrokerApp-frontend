// BookingModal — Listens for 'open-booking-modal' custom event
// Shows a modal to book a visit/interest for a property

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking, clearBookingError, clearBookingSuccess } from '../store/bookingSlice';
import { BOOKING_TYPES } from '../utils/constants';
import { HiOutlineCalendarDays, HiOutlineXMark } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import './BookingModal.css';

export default function BookingModal() {
  const dispatch = useDispatch();
  const { creating } = useSelector((state) => state.booking);

  const [isOpen, setIsOpen] = useState(false);
  const [propertyId, setPropertyId] = useState(null);
  const [form, setForm] = useState({
    bookingType: 'VISIT',
    preferredDate: '',
    message: '',
  });

  // Listen for the custom event from PropertyDetailPage
  useEffect(() => {
    const handleOpen = (e) => {
      const id = e.detail?.propertyId;
      if (id) {
        setPropertyId(Number(id));
        setIsOpen(true);
        setForm({ bookingType: 'VISIT', preferredDate: '', message: '' });
      }
    };

    window.addEventListener('open-booking-modal', handleOpen);
    return () => window.removeEventListener('open-booking-modal', handleOpen);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setPropertyId(null);
    dispatch(clearBookingError());
    dispatch(clearBookingSuccess());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.preferredDate) {
      toast.error('Please select a preferred date');
      return;
    }

    try {
      await dispatch(
        createBooking({
          propertyId,
          bookingType: form.bookingType,
          preferredDate: form.preferredDate + 'T10:00:00',
          message: form.message || null,
        })
      ).unwrap();

      toast.success('Booking request sent successfully!');
      handleClose();
    } catch (err) {
      toast.error(err || 'Failed to create booking');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="booking-overlay" onClick={handleClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="booking-modal__header">
          <h2>
            <HiOutlineCalendarDays style={{ verticalAlign: 'middle', marginRight: 8 }} />
            Book a Visit
          </h2>
          <button className="booking-modal__close" onClick={handleClose}>
            <HiOutlineXMark />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="booking-modal__group">
            <label>Booking Type</label>
            <select name="bookingType" value={form.bookingType} onChange={handleChange}>
              <option value={BOOKING_TYPES.VISIT}>Schedule a Visit</option>
              <option value={BOOKING_TYPES.INTEREST}>Express Interest</option>
            </select>
          </div>

          <div className="booking-modal__group">
            <label>Preferred Date *</label>
            <input
              type="date"
              name="preferredDate"
              value={form.preferredDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="booking-modal__group">
            <label>Message (optional)</label>
            <textarea
              name="message"
              placeholder="Any specific requirements or questions..."
              value={form.message}
              onChange={handleChange}
            />
          </div>

          <div className="booking-modal__actions">
            <button type="button" className="btn booking-modal__cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn booking-modal__submit" disabled={creating}>
              {creating ? (
                <>Booking...</>
              ) : (
                <>
                  <HiOutlineCalendarDays /> Confirm Booking
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
