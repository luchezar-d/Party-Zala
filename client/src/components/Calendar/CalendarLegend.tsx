import { AGE_BRACKETS } from '../../lib/ageColors';

export default function CalendarLegend() {
  return (
    <section className="flex gap-2 overflow-x-auto no-scrollbar">
      {AGE_BRACKETS.map((bracket) => (
        <div 
          key={bracket.key} 
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap ${bracket.chip} shadow-sm ring-1 ring-black/10`}
        >
          <span className={`h-2 w-2 rounded-full shrink-0 ${
            bracket.key === '1-4' ? 'bg-rose-500' :
            bracket.key === '5-8' ? 'bg-sky-500' :
            bracket.key === '9-12' ? 'bg-amber-500' :
            bracket.key === '13-18' ? 'bg-emerald-500' :
            'bg-gray-500'
          }`} />
          {bracket.label}
        </div>
      ))}
    </section>
  );
}

