import { clsx } from "clsx";
import { format, isToday, isWeekend } from "date-fns";
import { CalendarClock } from "lucide-react";
import type { Party } from "./MonthView";
import { bracketForAge } from "../../lib/ageColors";

interface DayCellProps {
  date: Date;
  isOtherMonth?: boolean;
  parties: Party[];
  onClick: (date: Date, parties: Party[]) => void;
}

export function DayCell({ date, isOtherMonth, parties, onClick }: DayCellProps) {
  const maxVisible = 3;
  const extra = Math.max(0, parties.length - maxVisible);

  return (
    <>
      <button
        onClick={() => onClick(date, parties)}
        className={clsx(
          "group relative flex flex-col items-stretch rounded-2xl border border-app-border bg-app-card backdrop-blur px-3 py-3 text-left shadow-sm transition min-h-[120px]",
          "hover:shadow-md hover:-translate-y-[1px]",
          isToday(date) && "ring-2 ring-pastel-sky-300",
          isWeekend(date) && "bg-pastel-lavender-50/40",
          isOtherMonth && "opacity-50"
        )}
      >
        {/* Date number */}
        <div className="flex items-center justify-between">
          <span className={clsx("text-sm font-medium", isToday(date) ? "text-pastel-sky-700" : "text-app-text-primary")}>
            {format(date, "d")}
          </span>
          {/* Badge with count */}
          {parties.length > 0 && (
            <span className="inline-flex items-center rounded-full bg-app-border px-2 py-1 text-xs font-medium text-app-text-secondary ring-1 ring-inset ring-app-border">
              {parties.length}
            </span>
          )}
        </div>

        {/* Event chips */}
        <div className="mt-2 space-y-1.5">
          {parties.slice(0, maxVisible).map((p) => {
            const bracket = bracketForAge(p.kidAge);
            return (
              <div
                key={p._id}
                className={clsx(
                  "flex flex-col gap-0.5 truncate rounded-xl px-2 py-1.5 text-xs ring-1",
                  bracket.chip
                )}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <CalendarClock className="size-3 shrink-0" />
                  <span className="truncate font-semibold">
                    {(p.startTime ?? "—")} · {p.kidName} ({p.kidAge}г)
                  </span>
                </div>
                {(p.partyType || p.address) && (
                  <div className="text-[10px] opacity-75 truncate ml-[18px]">
                    {p.partyType && <span>{p.partyType}</span>}
                    {p.partyType && p.address && <span> · </span>}
                    {p.address && <span>{p.address}</span>}
                  </div>
                )}
                <div className="text-[10px] opacity-75 ml-[18px]">
                  Капаро: {p.deposit ?? 0}€
                </div>
              </div>
            );
          })}
          {extra > 0 && (
            <div className="text-[11px] text-app-text-secondary">
              +{extra} more
            </div>
          )}
        </div>

        {/* Hover glow */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 transition group-hover:ring-2 group-hover:ring-pastel-blush-200/60" />
      </button>


    </>
  );
}
