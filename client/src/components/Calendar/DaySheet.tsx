import { Plus, Edit } from "lucide-react";
import { useState } from "react";
import { bracketForAge } from "../../lib/ageColors"; 
import type { Party } from "./MonthView";
import { PartyFormModal } from "./PartyFormModal";
import { BG } from "../../lib/i18n";
import BottomSheet from "../ui/BottomSheet";

interface DaySheetProps {
  open: boolean;
  date: Date | null;
  items: Party[];
  onOpenChange: (open: boolean) => void;
  onPartyUpdated: () => void;
}

export function DaySheet({ open, onOpenChange, date, items = [], onPartyUpdated }: DaySheetProps) {
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingParty, setEditingParty] = useState<Party | null>(null);

  if (!date) return null;

  const handleAddNewParty = () => {
    setEditingParty(null);
    setShowFormModal(true);
  };

  const handleEditParty = (party: Party) => {
    setEditingParty(party);
    setShowFormModal(true);
  };

  const handleFormSuccess = () => {
    setShowFormModal(false);
    setEditingParty(null);
    onPartyUpdated();
  };

  const handleFormClose = () => {
    setShowFormModal(false);
    setEditingParty(null);
  };

  const title = date ? `${BG.formatWeekday(date)}, ${BG.formatDateShort(date)}` : BG.addNewParty;

  return (
    <>
      <BottomSheet
        open={open}
        onClose={() => onOpenChange(false)}
        title={title}
      >
        {/* Existing Parties */}
        {items.length > 0 && (
          <div className="mb-6">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
              {BG.scheduledParties} ({items.length})
            </h4>
            <ul className="space-y-3">
              {items.map((party) => {
                const bracket = bracketForAge(party.kidAge);
                return (
                  <li 
                    key={party._id} 
                    className={`flex items-center justify-between rounded-xl px-4 py-3 ${bracket.block} border border-opacity-20 shadow-sm min-h-[56px]`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-sm font-medium opacity-80 min-w-[3rem]">
                        {party.startTime || "—"}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{party.kidName}</div>
                        {typeof party.kidAge === "number" && (
                          <div className="text-sm opacity-70">{party.kidAge} {BG.yearsOld}</div>
                        )}
                        {party.locationName && (
                          <div className="text-sm opacity-70 mt-1">{party.locationName}</div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleEditParty(party)}
                      className="h-11 w-11 -mr-2 rounded-full hover:bg-white/50 active:scale-95 transition flex items-center justify-center focus-ring"
                      aria-label={`${BG.edit} ${party.kidName}`}
                    >
                      <Edit className="h-5 w-5 text-blue-600" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {items.length === 0 && (
          <div className="text-center py-8">
            <div className="text-5xl mb-3">🎉</div>
            <p className="text-gray-600 mb-4">
              {BG.noPartiesScheduled}
            </p>
          </div>
        )}

        {/* Divider */}
        {items.length > 0 && <div className="my-6 h-px bg-gray-200" />}

        {/* Add Party Button */}
        <button
          onClick={handleAddNewParty}
          className="w-full flex items-center justify-center gap-2 h-12 sm:h-14 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50/50 active:scale-[0.99] transition font-medium focus-ring"
        >
          <Plus className="h-5 w-5" />
          <span>{BG.addNewParty}</span>
        </button>
      </BottomSheet>

      {/* Party Form Modal */}
      <PartyFormModal
        isOpen={showFormModal}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        date={date}
        editingParty={editingParty}
      />
    </>
  );
}
