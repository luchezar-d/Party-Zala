import { X } from 'lucide-react';
import { PartyForm } from '../Party/PartyForm';

interface Party {
  _id: string;
  partyDate: string;
  kidName: string;
  kidAge: number;
  locationName: string;
  startTime?: string;
  endTime?: string;
  address?: string;
  parentName?: string;
  parentEmail?: string;
  guestsCount?: number;
  notes?: string;
  kidsCount?: number;
  parentsCount?: number;
  kidsCatering?: string;
  parentsCatering?: string;
}

interface PartyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  date: Date;
  editingParty?: Party | null;
}

export function PartyFormModal({ isOpen, onClose, onSuccess, date, editingParty }: PartyFormModalProps) {
  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md max-h-[85vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={handleCancel}
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Form Content */}
        <div className="p-4">
          <PartyForm
            date={date}
            editingParty={editingParty}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
