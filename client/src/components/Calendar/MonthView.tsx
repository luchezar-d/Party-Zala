import { eachDayOfInterval, endOfMonth, format, isSameMonth, startOfMonth } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { groupByDay, dayKey } from "../../lib/date";
import { DayCell } from "./DayCell.tsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { BG } from '../../lib/i18n';

export interface Party {
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
  kidsCount?: number;
  parentsCount?: number;
  kidsCatering?: string;
  parentsCatering?: string;
  phoneNumber?: string;
  deposit?: number;
  partyType?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface MonthViewProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onDayClick: (date: Date, parties: Party[]) => void;
  refreshKey?: number; // Used to trigger refetch when parties change
}

export function MonthView({ currentDate, onPreviousMonth, onNextMonth, onToday, onDayClick, refreshKey }: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Only fetch and display parties for the current month
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchParties = async () => {
      setLoading(true);
      try {
        const from = format(monthStart, 'yyyy-MM-dd');
        const to = format(monthEnd, 'yyyy-MM-dd');
        const response = await api.get(`/parties?from=${from}&to=${to}`);
        setParties(response.data);
      } catch (error: any) {
        console.error('Error fetching parties:', error);
        // Only show error if it's NOT a 401 (auth errors are handled globally)
        if (error.response?.status !== 401) {
          const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
          toast.error(`Failed to load parties: ${errorMsg}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchParties();
  }, [monthStart.toISOString(), monthEnd.toISOString(), refreshKey]);

  const byDay = useMemo(() => groupByDay(parties), [parties]);
  
  // Only show days that belong to the current month
  const days = useMemo(
    () => eachDayOfInterval({ start: monthStart, end: monthEnd }),
    [monthStart.toISOString(), monthEnd.toISOString()]
  );

  // Calculate which day of week the month starts on (0 = Sunday, 1 = Monday, etc.)
  // We use weekStartsOn: 1 (Monday), so we need to adjust
  const firstDayOfWeek = (monthStart.getDay() + 6) % 7; // Convert to Monday-first (0 = Monday, 6 = Sunday)

  if (loading) {
    return (
      <div className="rounded-3xl border border-app-border bg-app-card backdrop-blur shadow-sm p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pastel-sky-600 mx-auto"></div>
        <p className="mt-4 text-app-text-secondary">Loading calendar...</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="relative flex items-center justify-between">
        {/* Left side - Previous button */}
        <button 
          onClick={onPreviousMonth}
          className="p-2 rounded-lg border border-app-border bg-app-card backdrop-blur shadow-sm hover:shadow-md hover:-translate-y-[1px] transition"
        >
          <ChevronLeft className="size-4" />
        </button>
        
        {/* Center - Month title (absolutely centered) */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-app-text-primary whitespace-nowrap">
            {BG.months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
        </div>
        
        {/* Right side - Next button and Today button */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onNextMonth}
            className="p-2 rounded-lg border border-app-border bg-app-card backdrop-blur shadow-sm hover:shadow-md hover:-translate-y-[1px] transition"
          >
            <ChevronRight className="size-4" />
          </button>
          <button 
            onClick={onToday}
            className="px-4 py-2 rounded-lg border border-app-border bg-app-card backdrop-blur shadow-sm hover:shadow-md hover:-translate-y-[1px] transition text-sm font-medium"
          >
            {BG.today}
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-app-border bg-app-card backdrop-blur shadow-sm overflow-hidden">
        {/* Weekday headings */}
        <div className="grid grid-cols-7 gap-px bg-gradient-to-r from-transparent via-app-border to-transparent">
          {BG.weekdays.map(d => (
            <div key={d} className="py-3 text-center text-xs font-medium tracking-wide text-app-text-secondary">{d}</div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-4 p-8">
          {/* Empty cells for days before the first day of the month */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          
          {/* Actual days of the month */}
          {days.map((date) => (
            <DayCell
              key={date.toISOString()}
              date={date}
              isOtherMonth={!isSameMonth(date, currentDate)}
              parties={byDay[dayKey(date)] ?? []}
              onClick={onDayClick}
            />
          ))}
        </div>
      </div>

      {/* Empty State */}
      {!loading && parties.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-lg font-medium text-app-text-primary mb-2">{BG.noPartiesYet}</h3>
          <p className="text-app-text-secondary mb-4">
            {BG.clickToSchedule}
          </p>
        </div>
      )}
    </section>
  );
}
