import { useMediaQuery } from "../../hooks/useMediaQuery";
import { MonthView } from "./MonthView";
import WeekViewMobile from "./WeekViewMobile";
import { useState } from "react";
import { addMonths, subMonths } from "date-fns";
import type { Party } from "./MonthView";
import { PartyModal } from "./PartyModal";

interface CalendarResponsiveProps {
  onPartyCreated?: () => void;
  onPartyDeleted?: () => void;
}

export default function CalendarResponsive({ onPartyCreated, onPartyDeleted }: CalendarResponsiveProps) {
  const isMobile = useMediaQuery("(max-width: 767px)"); // Tailwind <md breakpoint
  
  // State for desktop month view (mobile handles its own state)
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedParties, setSelectedParties] = useState<Party[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (date: Date, parties: Party[]) => {
    setSelectedDate(date);
    setSelectedParties(parties);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedDate(null);
    setSelectedParties([]);
  };

  const handlePartyCreatedInternal = () => {
    onPartyCreated?.();
  };

  const handlePartyDeletedInternal = () => {
    onPartyDeleted?.();
  };

  if (isMobile) {
    return <WeekViewMobile />;
  }

  return (
    <>
      <MonthView 
        currentDate={currentDate}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        onDayClick={handleDayClick}
      />
      
      {/* Desktop Modal */}
      {modalOpen && selectedDate && (
        <PartyModal
          date={selectedDate}
          parties={selectedParties}
          onClose={handleModalClose}
          onPartyCreated={handlePartyCreatedInternal}
          onPartyDeleted={handlePartyDeletedInternal}
        />
      )}
    </>
  );
}
