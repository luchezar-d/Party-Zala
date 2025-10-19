import { AGE_BRACKETS } from '../../lib/ageColors';

export default function CalendarLegend() {
  return (
    <section className="flex gap-2 overflow-x-auto no-scrollbar">
      {AGE_BRACKETS.map((bracket) => (
        <div 
          key={bracket.key} 
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap ${bracket.chip} shadow-sm ring-1 ring-black/10`}
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
    </section>
  );
}

