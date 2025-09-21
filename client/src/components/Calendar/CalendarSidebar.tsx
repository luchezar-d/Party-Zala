export default function CalendarSidebar() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-soft">
        <h3 className="text-lg font-bold mb-3">Party Types</h3>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>• Birthday parties</li>
          <li>• Theme parties</li>
          <li>• Outdoor adventures</li>
          <li>• Craft workshops</li>
          <li>• Pool parties</li>
          <li>• Sleepover parties</li>
          <li>• Holiday celebrations</li>
        </ul>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-soft">
        <h3 className="text-lg font-bold mb-4">Legend</h3>
        <div className="space-y-3 text-sm">
          <LegendDot colorClass="bg-rose-200" label="Ages 1–4" />
          <LegendDot colorClass="bg-sky-200" label="Ages 5–8" />
          <LegendDot colorClass="bg-amber-200" label="Ages 9–12" />
          <LegendDot colorClass="bg-emerald-200" label="Teens" />
        </div>
      </div>
    </div>
  );
}

function LegendDot({ colorClass, label }: { colorClass: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-4 w-8 rounded-full ${colorClass}`} />
      <span>{label}</span>
    </div>
  );
}
