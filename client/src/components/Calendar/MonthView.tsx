import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameMonth, startOfMonth, startOfWeek } from "date-fns";
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
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchParties = async () => {
      setLoading(true);
      try {
        const from = format(gridStart, 'yyyy-MM-dd');
        const to = format(gridEnd, 'yyyy-MM-dd');
        const response = await api.get(`/parties?from=${from}&to=${to}`);
        setParties(response.data);
      } catch (error) {
        console.error('Error fetching parties:', error);
        toast.error('Failed to load parties');
      } finally {
        setLoading(false);
      }
    };

    fetchParties();
  }, [gridStart.toISOString(), gridEnd.toISOString(), refreshKey]);

  const byDay = useMemo(() => groupByDay(parties), [parties]);
  const days = useMemo(
    () => eachDayOfInterval({ start: gridStart, end: gridEnd }),
    [gridStart.toISOString(), gridEnd.toISOString()]
  );

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
