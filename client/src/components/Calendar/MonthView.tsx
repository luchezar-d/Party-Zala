import { useState, useEffect } from 'react';
import { DayCell } from './DayCell';
import { PartyModal } from './PartyModal';
import { generateCalendarDays, getMonthDateRange, formatDateForAPI } from '../../lib/date';
import type { CalendarDay } from '../../lib/date';
import { api } from '../../lib/api';
import { toast } from 'sonner';

interface Party {
  _id: string;
  partyDate: string;
  kidName: string;
  kidAge: number;
  locationName: string;
  startTime?: string;
  endTime?: string;
  address?: string;
  parentName?: string;
  parentEmail?: string;
  guestsCount?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface MonthViewProps {
  currentDate: Date;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function MonthView({ currentDate }: MonthViewProps) {
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch parties for the current month
  useEffect(() => {
    fetchParties();
  }, [currentDate]);

  const fetchParties = async () => {
    setLoading(true);
    try {
      const { from, to } = getMonthDateRange(currentDate);
      const response = await api.get(`/parties?from=${from}&to=${to}`);
      setParties(response.data);
    } catch (error) {
      console.error('Failed to fetch parties:', error);
      toast.error('Failed to load parties');
    } finally {
      setLoading(false);
    }
  };

  const handleDayClick = (day: CalendarDay) => {
    if (!day.isCurrentMonth) return;
    
    setSelectedDate(day.date);
    setModalOpen(true);
  };

  const handlePartyCreated = () => {
    fetchParties(); // Refresh parties after creating one
    toast.success('Party created successfully! 🎉');
  };

  const handlePartyDeleted = () => {
    fetchParties(); // Refresh parties after deleting one
    toast.success('Party deleted successfully');
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedDate(null);
  };

  // Get party dates for the calendar
  const partyDates = parties.map(party => party.partyDate);

  // Generate calendar days
  const calendarDays = generateCalendarDays(currentDate, selectedDate || undefined, partyDates);

  // Get parties for selected date
  const selectedDateParties = selectedDate
    ? parties.filter(party => party.partyDate === formatDateForAPI(selectedDate))
    : [];

  return (
    <div className="card p-6">
      {loading && (
        <div className="absolute top-4 right-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-semibold text-gray-500 uppercase tracking-wide"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <DayCell
            key={index}
            day={day}
            onClick={() => handleDayClick(day)}
          />
        ))}
      </div>

      {/* Empty State */}
      {!loading && parties.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No parties yet!</h3>
          <p className="text-gray-600 mb-4">
            Click on any day to schedule your first kids' party.
          </p>
        </div>
      )}

      {/* Party Modal */}
      {modalOpen && selectedDate && (
        <PartyModal
          date={selectedDate}
          parties={selectedDateParties}
          onClose={handleModalClose}
          onPartyCreated={handlePartyCreated}
          onPartyDeleted={handlePartyDeleted}
        />
      )}
    </div>
  );
}
