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
            <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
              {BG.scheduledParties} ({items.length})
            </h4>
            <ul className="space-y-3">
              {items.map((party) => {
                const bracket = bracketForAge(party.kidAge);
                return (
                  <li 
                    key={party._id} 
                    className={`flex items-center justify-between rounded-2xl px-4 py-4 ${bracket.block} border border-opacity-20 shadow-md min-h-[64px] hover:shadow-lg transition-shadow`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">{party.kidName}</div>
                        {typeof party.kidAge === "number" && (
                          <div className="text-sm font-medium opacity-75">{party.kidAge} {BG.yearsOld}</div>
                        )}
                        
                        {/* Always show these fields */}
                        <div className="space-y-0.5 mt-1.5">
                          <div className="text-sm font-medium opacity-75">
                            Начален час: {party.startTime || "—"}
                          </div>
                          <div className="text-sm font-medium opacity-75">
                            Вид: {party.partyType || "—"}
                          </div>
                          <div className="text-sm font-medium opacity-75">
                            Адрес: {party.address || party.locationName || "—"}
                          </div>
                          <div className="text-sm font-medium opacity-75">
                            Капаро: {party.deposit ?? 0}€
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEditParty(party)}
                      className="h-11 w-11 -mr-2 rounded-full hover:bg-white/60 active:scale-95 transition-all flex items-center justify-center focus-ring"
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
          <div className="text-center py-10">
            <div className="text-6xl mb-3">🎉</div>
            <p className="text-gray-600 font-medium text-base">
              {BG.noPartiesScheduled}
            </p>
          </div>
        )}

        {/* Divider */}
        {items.length > 0 && <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />}

        {/* Add Party Button */}
        <button
          onClick={handleAddNewParty}
          className="w-full flex items-center justify-center gap-2.5 h-14 sm:h-14 border-2 border-dashed border-gray-300 rounded-2xl text-gray-700 hover:border-sky-500 hover:text-sky-700 hover:bg-sky-50/80 active:scale-[0.98] transition-all font-semibold focus-ring shadow-sm"
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
