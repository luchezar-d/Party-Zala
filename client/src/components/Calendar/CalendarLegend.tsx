import { AGE_BRACKETS } from '../../lib/ageColors';

export default function CalendarLegend() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] scrollbar-hide">
      {AGE_BRACKETS.map((bracket) => (
        <div 
          key={bracket.key} 
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium whitespace-nowrap ${bracket.chip}`}
        >
          <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${
            bracket.key === '1-4' ? 'bg-rose-400' :
            bracket.key === '5-8' ? 'bg-sky-400' :
            bracket.key === '9-12' ? 'bg-amber-400' :
            bracket.key === '13-18' ? 'bg-emerald-400' :
            'bg-gray-400'
          }`} />
          {bracket.label}
        </div>
      ))}
    </div>
  );
}
