import { addWeeks, eachDayOfInterval, endOfWeek, format, startOfWeek, isToday } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { dayKey, groupByDay } from "../../lib/date";
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

  const weekStart = startOfWeek(cursor, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(cursor, { weekStartsOn: 1 });

  useEffect(() => {
    const fetchParties = async () => {
      setLoading(true);
      try {
        const from = format(weekStart, 'yyyy-MM-dd');
        const to = format(weekEnd, 'yyyy-MM-dd');
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
      <div className="rounded-2xl bg-white shadow-md ring-1 ring-black/5 p-12 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-sky-600 border-t-transparent mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Зареждане...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Week Navigation - Ultra Compact on Mobile */}
      <div className="sticky top-[48px] sm:top-[56px] z-30 bg-slate-50/90 backdrop-blur py-2 sm:py-3">
        {/* Mobile: Single row with everything */}
        <div className="flex md:hidden items-center justify-between gap-2 px-1">
          {/* Left - Previous */}
          <button 
            onClick={() => setCursor(addWeeks(cursor, -1))}
            className="h-9 w-9 rounded-full bg-white shadow-md ring-1 ring-black/5 grid place-items-center active:scale-95 transition focus-ring hover:bg-gray-50"
            aria-label="Предишна седмица"
          >
            <ChevronLeft className="h-4 w-4 text-gray-700" />
          </button>
          
          {/* Center - Date range (compact) */}
          <div className="flex-1 text-center">
            <div className="font-bold text-gray-900 text-sm leading-tight">
              {weekStart.getDate()} {BG.monthsShort[weekStart.getMonth()]} - {weekEnd.getDate()} {BG.monthsShort[weekEnd.getMonth()]}
            </div>
          </div>
          
          {/* Right - Today + Next */}
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setCursor(new Date())}
              className="h-9 px-3 rounded-full bg-sky-600 shadow-md text-white text-xs font-bold active:scale-95 transition focus-ring hover:bg-sky-700"
            >
              Днес
            </button>
            
            <button 
              onClick={() => setCursor(addWeeks(cursor, 1))}
              className="h-9 w-9 rounded-full bg-white shadow-md ring-1 ring-black/5 grid place-items-center active:scale-95 transition focus-ring hover:bg-gray-50"
              aria-label="Следваща седмица"
            >
              <ChevronRight className="h-4 w-4 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Desktop: More spacious layout */}
        <div className="hidden md:block space-y-2">
          <div className="text-center">
            <div className="font-semibold text-gray-900 text-base">
              {BG.formatDateShort(weekStart)} – {BG.formatDateShort(weekEnd)}
            </div>
          </div>
          
          <div className="flex items-center justify-between px-1">
            <button 
              onClick={() => setCursor(addWeeks(cursor, -1))}
              className="h-11 w-11 rounded-full bg-white shadow-md ring-1 ring-black/5 grid place-items-center active:scale-95 transition focus-ring hover:bg-gray-50"
              aria-label="Предишна седмица"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            
            <button 
              onClick={() => setCursor(new Date())}
              className="h-10 px-5 rounded-full bg-sky-600 shadow-md text-white text-sm font-semibold active:scale-95 transition focus-ring hover:bg-sky-700"
            >
              {BG.today}
            </button>
            
            <button 
              onClick={() => setCursor(addWeeks(cursor, 1))}
              className="h-11 w-11 rounded-full bg-white shadow-md ring-1 ring-black/5 grid place-items-center active:scale-95 transition focus-ring hover:bg-gray-50"
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
              className={`w-full rounded-2xl bg-white shadow-md ring-1 ring-black/5 px-4 py-4 sm:px-5 sm:py-5 text-left active:scale-[0.98] transition-all min-h-[64px] hover:shadow-lg ${
                isCurrentDay ? 'ring-2 ring-sky-500 bg-gradient-to-br from-sky-50 to-white' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <h3 className={`text-lg sm:text-xl font-bold tracking-tight ${isCurrentDay ? 'text-sky-700' : 'text-gray-900'}`}>
                  {BG.formatWeekday(date)}, {BG.formatDateShort(date)}
                </h3>
                <span className={`text-sm font-medium ${isCurrentDay ? 'text-sky-600' : 'text-gray-500'}`}>
                  {items.length} {items.length === 1 ? BG.party : BG.parties}
                </span>
              </div>

              {items.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {items.slice(0, 3).map((party) => {
                    return (
                      <div 
                        key={party._id} 
                        className="inline-flex flex-col gap-1 rounded-xl px-3.5 py-2.5 text-sm bg-purple-100/80 text-purple-900 ring-1 ring-purple-200/50 shadow-sm min-w-[200px]"
                      >
                        <div className="font-bold text-base">
                          {party.kidName} ({party.kidAge}г)
                        </div>
                        <div className="text-xs opacity-80 space-y-0.5">
                          <div>Начален час: {party.startTime ?? "—"}</div>
                          <div>Вид: {party.partyType || "—"}</div>
                          <div>Адрес: {party.address || party.locationName || "—"}</div>
                          <div>Капаро: {party.deposit ?? 0}€</div>
                        </div>
                      </div>
                    );
                  })}
                  {items.length > 3 && (
                    <div className="text-sm text-gray-600 font-medium px-2">
                      +{items.length - 3} {BG.more}
                    </div>
                  )}
                </div>
              )}
              
              {items.length === 0 && (
                <p className="mt-1.5 text-gray-600 text-sm sm:text-base font-medium">
                  {BG.tapToAddParty} 🎉
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {!loading && parties.length === 0 && (
        <div className="text-center py-16 px-4">
          <div className="text-7xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{BG.noPartiesThisWeek}</h3>
          <p className="text-gray-600 font-medium">
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
