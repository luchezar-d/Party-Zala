import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  parseISO,
  formatISO
} from 'date-fns';

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  partyCount: number;
}

export function generateCalendarDays(
  currentDate: Date,
  selectedDate?: Date,
  partyDates: string[] = []
): CalendarDay[] {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  return days.map((date) => {
    const dayKey = formatISO(date, { representation: 'date' });
    const partyCount = partyDates.filter(partyDate => partyDate === dayKey).length;

    return {
      date,
      dayNumber: date.getDate(),
      isCurrentMonth: isSameMonth(date, currentDate),
      isToday: isToday(date),
      isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
      partyCount,
    };
  });
}

export function formatMonthYear(date: Date): string {
  return format(date, 'MMMM yyyy');
}

export function formatDateForAPI(date: Date): string {
  return formatISO(date, { representation: 'date' });
}

export function parseAPIDate(dateString: string): Date {
  return parseISO(dateString);
}

export function getNextMonth(date: Date): Date {
  return addMonths(date, 1);
}

export function getPreviousMonth(date: Date): Date {
  return subMonths(date, 1);
}

export function getMonthDateRange(date: Date) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  
  return {
    from: formatDateForAPI(start),
    to: formatDateForAPI(end),
  };
}

export function formatTime(time: string): string {
  // Convert HH:mm to 12-hour format
  const [hours, minutes] = time.split(':');
  const hour24 = parseInt(hours, 10);
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  
  return `${hour12}:${minutes} ${ampm}`;
}
