import { format } from "date-fns";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import { bracketForAge } from "../../lib/ageColors"; 
import type { Party } from "./MonthView";
import { PartyForm } from "./PartyForm";

interface DaySheetProps {
  open: boolean;
  date: Date | null;
  items: Party[];
  onOpenChange: (open: boolean) => void;
  onPartyUpdated: () => void;
}

export function DaySheet({ open, onOpenChange, date, items = [], onPartyUpdated }: DaySheetProps) {
  const [showForm, setShowForm] = useState(false);

  if (!date || !open) return null;

  const handlePartyCreated = () => {
    setShowForm(false);
    onPartyUpdated();
  };

  const handlePartyDeleted = () => {
    onPartyUpdated();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 md:hidden"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 rounded-t-3xl bg-app-card border-t border-app-border shadow-2xl max-h-[85vh] overflow-hidden z-50 md:hidden">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1.5 w-12 rounded-full bg-app-border" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-4">
          <h3 className="text-xl font-bold text-app-text-primary">
            {format(date, "EEEE, MMM d")}
          </h3>
          <button 
            onClick={() => onOpenChange(false)}
            className="rounded-full bg-app-border p-2 active:scale-95 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-4 pb-6" style={{ maxHeight: 'calc(85vh - 120px)' }}>
          {/* Existing Parties */}
          {items.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-app-text-primary mb-3">
                Scheduled Parties ({items.length})
              </h4>
              <ul className="space-y-3">
                {items.map((party) => {
                  const bracket = bracketForAge(party.kidAge);
                  return (
                    <li 
                      key={party._id} 
                      className={`flex items-center justify-between rounded-xl px-4 py-3 ${bracket.block} border border-opacity-20`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium opacity-80">
                          {party.startTime || "—"}
                        </div>
                        <div>
                          <div className="font-semibold">{party.kidName}</div>
                          {typeof party.kidAge === "number" && (
                            <div className="text-sm opacity-70">Age {party.kidAge}</div>
                          )}
                        </div>
                      </div>
                      {party.locationName && (
                        <div className="text-sm opacity-70 text-right">
                          {party.locationName}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {items.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🎉</div>
              <p className="text-app-text-secondary mb-4">
                No parties scheduled for this day
              </p>
            </div>
          )}

          {/* Divider */}
          {items.length > 0 && <div className="my-6 h-px bg-app-border" />}

          {/* Add Party Section */}
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-app-border rounded-xl text-app-text-secondary hover:border-pastel-sky-300 hover:text-pastel-sky-600 active:scale-[0.99] transition"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Add New Party</span>
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-app-text-primary">Add New Party</h4>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-app-text-secondary hover:text-app-text-primary"
                >
                  Cancel
                </button>
              </div>
              <PartyForm
                defaultDate={date}
                onSuccess={handlePartyCreated}
                onCancel={() => setShowForm(false)}
                onPartyDeleted={handlePartyDeleted}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
