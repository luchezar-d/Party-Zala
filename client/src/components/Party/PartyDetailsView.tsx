import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import { Calendar, Clock, Users2, ChefHat, Info } from 'lucide-react';

type PartyDetailsViewProps = {
  party: {
    kidName: string;
    kidAge?: number;
    partyDate: string | Date;
    locationName?: string;
    address?: string;
    startTime?: string;
    endTime?: string;
    kidsCount?: number;
    parentsCount?: number;
    kidsCatering?: string;
    parentsCatering?: string;
    notes?: string;
    phoneNumber?: string;
    deposit?: number;
    partyType?: string;
  };
  onEdit?: () => void;
  onClose: () => void;
  variant?: "dialog" | "sheet";
};

export function parseList(v?: string): string[] {
  return (v ?? "").split(/\r?\n|,/).map(s => s.trim()).filter(Boolean);
}

function Section({ icon: Icon, title, children }: { 
  icon: any; 
  title: string; 
  children: React.ReactNode; 
}) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="size-4 text-slate-600" />
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function KV({ label, value, twoCol = false }: { 
  label: string; 
  value?: React.ReactNode; 
  twoCol?: boolean; 
}) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className={twoCol ? "grid grid-cols-2 gap-6" : ""}>
      <div>
        <div className="text-xs text-slate-500 mb-1">{label}</div>
        <div className="text-[15px] md:text-base">{value}</div>
      </div>
    </div>
  );
}

export function PartyDetailsView({ party, onEdit, onClose, variant = "dialog" }: PartyDetailsViewProps) {
  const partyDate = typeof party.partyDate === 'string' ? new Date(party.partyDate) : party.partyDate;
  const formattedDate = format(partyDate, "d MMMM yyyy", { locale: bg });

  const kidsList = parseList(party.kidsCatering);
  const parentsList = parseList(party.parentsCatering);

  const maxHeight = variant === "sheet" ? "max-h-[82vh]" : "max-h-[88vh]";

  return (
    <div className={`${maxHeight} grid grid-rows-[auto,1fr,auto]`}>
      {/* Row 1: Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b px-6 pt-5 pb-4">
        {/* Title */}
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="size-4 text-slate-600" />
          <h2 className="font-bold text-lg">Детайли за партито</h2>
        </div>
        <p className="text-sm text-slate-600 mb-3">{formattedDate}</p>

        {/* Summary pill with edit button */}
        <div className="flex items-center justify-between">
          <div className="rounded-xl px-4 py-2 text-sm bg-purple-100/80 text-purple-900 ring-1 ring-purple-200/50 flex-1 mr-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold">{party.kidName}</span>
                {party.kidAge && (
                  <span className="ml-1">({party.kidAge} години)</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs">
                {(party.startTime || party.endTime) && (
                  <span className="bg-white/20 px-2 py-1 rounded-full">
                    {party.startTime && party.endTime 
                      ? `${party.startTime}–${party.endTime}`
                      : party.startTime || party.endTime
                    }
                  </span>
                )}
                {party.locationName && (
                  <span className="bg-white/20 px-2 py-1 rounded-full">
                    {party.locationName}
                  </span>
                )}
              </div>
            </div>
          </div>
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              Редактирай
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Scrollable Content */}
      <div className="overflow-y-auto px-6 pb-6 pt-4 space-y-8">
        {/* Basic Info Section */}
        <Section icon={Info} title="Основна информация">
          {party.partyType && <KV label="Вид" value={party.partyType} />}
          <KV label="Адрес" value={party.address || party.locationName || '—'} />
          <KV label="Капаро" value={`${party.deposit ?? 0}€`} />
        </Section>

        {/* Time Section */}
        {(party.startTime || party.endTime) && (
          <Section icon={Clock} title="Час">
            <div className="grid grid-cols-2 gap-6">
              <KV label="Начален час" value={party.startTime} />
              <KV label="Краен час" value={party.endTime} />
            </div>
          </Section>
        )}

        {/* People Count Section */}
        {(party.kidsCount || party.parentsCount) && (
          <Section icon={Users2} title="Брой хора">
            <div className="grid grid-cols-2 gap-6">
              <KV label="Брой деца" value={party.kidsCount} />
              <KV label="Брой родители" value={party.parentsCount} />
            </div>
          </Section>
        )}

        {/* Catering Section */}
        {(kidsList.length > 0 || parentsList.length > 0) && (
          <Section icon={ChefHat} title="Кетъринг">
            {kidsList.length > 0 && (
              <div>
                <div className="text-xs text-slate-500 mb-1">Кетъринг деца</div>
                <ul className="list-disc pl-5 space-y-1 text-[15px] md:text-base">
                  {kidsList.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {parentsList.length > 0 && (
              <div>
                <div className="text-xs text-slate-500 mb-1">Кетъринг родители</div>
                <ul className="list-disc pl-5 space-y-1 text-[15px] md:text-base">
                  {parentsList.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </Section>
        )}
      </div>

      {/* Row 3: Footer */}
      <div className="border-t px-6 py-4 flex items-center justify-end gap-2">
        {onEdit && (
          <button
            onClick={onEdit}
            className="md:w-auto w-full px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors min-h-[44px]"
          >
            Редактирай
          </button>
        )}
        <button
          onClick={onClose}
          className="md:w-auto w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full transition-colors shadow-sm hover:shadow-md min-h-[44px]"
        >
          Затвори
        </button>
      </div>
    </div>
  );
}
