import { addWeeks, eachDayOfInterval, endOfWeek, format, startOfWeek, isToday } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { dayKey, groupByDay } from "../../lib/date";
import { bracketForAge } from "../../lib/ageColors";
import { DaySheet } from "./DaySheet";
import { api } from "../../lib/api";
import { toast } from "sonner";
import type { Party } from "./MonthView";

export default function WeekViewMobile() {
  const [cursor, setCursor] = useState<Date>(new Date());
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(false);
  const [sheet, setSheet] = useState<{
    open: boolean;
    date: Date | null;
    items: Party[];
  }>({ open: false, date: null, items: [] });

  const weekStart = startOfWeek(cursor, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(cursor, { weekStartsOn: 0 });

  useEffect(() => {
    const fetchParties = async () => {
      setLoading(true);
      try {
        const from = format(weekStart, 'yyyy-MM-dd');
        const to = format(weekEnd, 'yyyy-MM-dd');
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
  }, [weekStart.toISOString(), weekEnd.toISOString()]);

  const byDay = useMemo(() => groupByDay(parties), [parties]);

  const days = useMemo(() => (
    eachDayOfInterval({ start: weekStart, end: weekEnd })
  ), [weekStart.toISOString(), weekEnd.toISOString()]);

  const handleDayTap = (date: Date, items: Party[]) => {
    setSheet({ open: true, date, items });
  };

  const handleSheetClose = () => {
    setSheet(s => ({ ...s, open: false }));
  };

  const handlePartyUpdated = () => {
    // Refetch parties when a party is added/updated/deleted
    const fetchParties = async () => {
      try {
        const from = format(weekStart, 'yyyy-MM-dd');
        const to = format(weekEnd, 'yyyy-MM-dd');
        const response = await api.get(`/parties?from=${from}&to=${to}`);
        setParties(response.data);
        
        // Update sheet items if sheet is open for the same date
        if (sheet.date) {
          const updatedItems = groupByDay(response.data)[dayKey(sheet.date)] ?? [];
          setSheet(s => ({ ...s, items: updatedItems }));
        }
      } catch (error) {
        console.error('Error refetching parties:', error);
      }
    };
    
    fetchParties();
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-app-border bg-app-card p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pastel-sky-600 mx-auto"></div>
        <p className="mt-4 text-app-text-secondary">Loading week...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Week Navigation */}
      <div className="relative flex items-center justify-between">
        {/* Left - Previous button */}
        <button 
          onClick={() => setCursor(addWeeks(cursor, -1))}
          className="h-10 w-10 rounded-full bg-app-card border border-app-border shadow-sm grid place-items-center active:scale-95 transition"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        {/* Center - Week range (absolutely centered) */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="font-semibold text-app-text-primary whitespace-nowrap">
            {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d, yyyy")}
          </div>
        </div>
        
        {/* Right - Today and Next buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCursor(new Date())}
            className="px-3 py-1.5 rounded-full bg-app-card border border-app-border text-sm font-medium active:scale-95 transition"
          >
            Today
          </button>
          
          <button 
            onClick={() => setCursor(addWeeks(cursor, 1))}
            className="h-10 w-10 rounded-full bg-app-card border border-app-border shadow-sm grid place-items-center active:scale-95 transition"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Day Cards */}
      <div className="space-y-2">
        {days.map(date => {
          const items = byDay[dayKey(date)] ?? [];
          const isCurrentDay = isToday(date);
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => handleDayTap(date, items)}
              className={`w-full rounded-2xl bg-app-card border border-app-border shadow-sm px-4 py-4 text-left active:scale-[0.99] transition ${
                isCurrentDay ? 'ring-2 ring-pastel-sky-300 bg-pastel-sky-50' : ''
              }`}
            >
              <div className="flex items-baseline justify-between mb-2">
                <div className={`text-lg font-semibold ${isCurrentDay ? 'text-pastel-sky-700' : 'text-app-text-primary'}`}>
                  {format(date, "EEE, MMM d")}
                </div>
                <div className="text-sm text-app-text-secondary">
                  {items.length} {items.length === 1 ? 'party' : 'parties'}
                </div>
              </div>

              {items.length > 0 && (
                <div className="space-y-2">
                  {items.slice(0, 3).map((party) => {
                    const bracket = bracketForAge(party.kidAge);
                    return (
                      <div 
                        key={party._id} 
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm mr-2 mb-1 ${bracket.chip}`}
                      >
                        <span className="text-xs opacity-80 font-medium">
                          {party.startTime ?? "—"}
                        </span>
                        <span className="font-medium">{party.kidName}</span>
                        {typeof party.kidAge === "number" && (
                          <span className="text-xs opacity-70">({party.kidAge})</span>
                        )}
                      </div>
                    );
                  })}
                  {items.length > 3 && (
                    <div className="text-sm text-app-text-secondary">
                      +{items.length - 3} more
                    </div>
                  )}
                </div>
              )}
              
              {items.length === 0 && (
                <div className="text-sm text-app-text-secondary">
                  Tap to add a party 🎉
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {!loading && parties.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-lg font-medium text-app-text-primary mb-2">No parties this week!</h3>
          <p className="text-app-text-secondary mb-4">
            Tap on any day to schedule your first party.
          </p>
        </div>
      )}

      {/* Bottom Sheet */}
      <DaySheet
        open={sheet.open}
        date={sheet.date}
        items={sheet.items}
        onOpenChange={handleSheetClose}
        onPartyUpdated={handlePartyUpdated}
      />
    </div>
  );
}
