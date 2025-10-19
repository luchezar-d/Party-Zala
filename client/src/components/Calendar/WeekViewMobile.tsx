import { addWeeks, eachDayOfInterval, endOfWeek, format, startOfWeek, isToday } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { dayKey, groupByDay } from "../../lib/date";
import { bracketForAge } from "../../lib/ageColors";
import { DaySheet } from "./DaySheet";
import { api } from "../../lib/api";
import { toast } from "sonner";
import type { Party } from "./MonthView";
import { BG } from "../../lib/i18n";

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
      <div className="rounded-2xl bg-white shadow-md ring-1 ring-black/5 p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading week...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Week Navigation */}
      <div className="sticky top-[52px] sm:top-[60px] z-30 bg-slate-50/80 backdrop-blur py-2">
        <div className="relative flex items-center justify-between px-1">
          {/* Left - Previous button */}
          <button 
            onClick={() => setCursor(addWeeks(cursor, -1))}
            className="h-11 w-11 rounded-full bg-white shadow ring-1 ring-black/5 grid place-items-center active:scale-95 transition focus-ring"
            aria-label="Предишна седмица"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          
          {/* Center - Week range */}
          <div className="absolute left-1/2 transform -translate-x-1/2 font-semibold text-gray-900 text-sm sm:text-base whitespace-nowrap">
            {BG.formatDateShort(weekStart)} – {BG.formatDateShort(weekEnd)}
          </div>
          
          {/* Right - Today and Next buttons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCursor(new Date())}
              className="h-9 px-3 rounded-full bg-white shadow ring-1 ring-black/5 text-sm font-medium active:scale-95 transition focus-ring"
            >
              {BG.today}
            </button>
            
            <button 
              onClick={() => setCursor(addWeeks(cursor, 1))}
              className="h-11 w-11 rounded-full bg-white shadow ring-1 ring-black/5 grid place-items-center active:scale-95 transition focus-ring"
              aria-label="Следваща седмица"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Day Cards */}
      <div className="space-y-3">
        {days.map(date => {
          const items = byDay[dayKey(date)] ?? [];
          const isCurrentDay = isToday(date);
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => handleDayTap(date, items)}
              className={`w-full rounded-2xl bg-white shadow-md ring-1 ring-black/5 px-4 py-3 sm:px-5 sm:py-4 text-left active:scale-[0.99] transition min-h-[56px] ${
                isCurrentDay ? 'ring-2 ring-sky-400 bg-sky-50' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-1">
                <h3 className={`text-lg sm:text-xl font-semibold ${isCurrentDay ? 'text-sky-700' : 'text-gray-900'}`}>
                  {BG.formatWeekday(date)}, {BG.formatDateShort(date)}
                </h3>
                <span className="text-sm text-gray-500">
                  {items.length} {items.length === 1 ? BG.party : BG.parties}
                </span>
              </div>

              {items.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {items.slice(0, 3).map((party) => {
                    const bracket = bracketForAge(party.kidAge);
                    return (
                      <div 
                        key={party._id} 
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${bracket.chip} shadow-sm`}
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
                    <div className="text-sm text-gray-500 px-2">
                      +{items.length - 3} {BG.more}
                    </div>
                  )}
                </div>
              )}
              
              {items.length === 0 && (
                <p className="mt-1 text-gray-600 text-sm sm:text-base">
                  {BG.tapToAddParty} 🎉
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {!loading && parties.length === 0 && (
        <div className="text-center py-12 px-4">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{BG.noPartiesThisWeek}</h3>
          <p className="text-gray-600 mb-4">
            {BG.tapToAddParty}
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
