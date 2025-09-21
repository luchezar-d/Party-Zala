import type { CalendarDay } from '../../lib/date';
import { clsx } from 'clsx';

interface DayCellProps {
  day: CalendarDay;
  onClick: () => void;
}

export function DayCell({ day, onClick }: DayCellProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'calendar-day min-h-[80px] relative',
        {
          'calendar-day-selected': day.isSelected,
          'calendar-day-other-month': !day.isCurrentMonth,
          'bg-accent-50 border-2 border-accent-200': day.isToday && day.isCurrentMonth,
          'cursor-default': !day.isCurrentMonth,
        }
      )}
      disabled={!day.isCurrentMonth}
    >
      {/* Day Number */}
      <span
        className={clsx(
          'text-sm font-medium',
          {
            'text-accent-900': day.isToday && day.isCurrentMonth,
            'text-primary-900': day.isSelected,
            'text-gray-900': day.isCurrentMonth && !day.isToday,
            'text-gray-400': !day.isCurrentMonth,
          }
        )}
      >
        {day.dayNumber}
      </span>

      {/* Party Count Badge */}
      {day.partyCount > 0 && (
        <div className="absolute bottom-1 right-1">
          <span
            className={clsx(
              'party-badge text-xs',
              {
                'bg-primary-100 text-primary-800': day.isCurrentMonth,
                'bg-gray-100 text-gray-600': !day.isCurrentMonth,
              }
            )}
          >
            {day.partyCount} {day.partyCount === 1 ? 'party' : 'parties'}
          </span>
        </div>
      )}

      {/* Today Indicator */}
      {day.isToday && day.isCurrentMonth && (
        <div className="absolute top-1 left-1">
          <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
        </div>
      )}
    </button>
  );
}
