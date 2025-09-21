import { AGE_BRACKETS } from '../../lib/ageColors';

export default function CalendarLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
      {AGE_BRACKETS.map((bracket) => (
        <span key={bracket.key} className="inline-flex items-center gap-2">
          <span className={`inline-block h-3 w-3 rounded ${bracket.block.replace('text-', 'bg-').split(' ')[0]} ring-1 ring-inset ring-black/10`} />
          {bracket.label}
        </span>
      ))}
    </div>
  );
}
