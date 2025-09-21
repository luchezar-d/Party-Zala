import { AGE_BRACKETS } from '../../lib/ageColors';

export default function CalendarLegend() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] scrollbar-hide">
      {AGE_BRACKETS.map((bracket) => (
        <div 
          key={bracket.key} 
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap ${bracket.chip}`}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-current/70 mix-blend-multiply" />
          {bracket.label}
        </div>
      ))}
    </div>
  );
}
