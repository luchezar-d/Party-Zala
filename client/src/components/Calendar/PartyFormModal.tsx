import { PartyForm } from '../Party/PartyForm';
import BottomSheet from '../ui/BottomSheet';
import { BG } from '../../lib/i18n';

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
  phoneNumber?: string;
  deposit?: number;
  partyType?: string;
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

  const title = editingParty ? `${BG.edit} ${BG.party}` : BG.addNewParty;

  return (
    <BottomSheet
      open={isOpen}
      onClose={handleCancel}
      title={title}
    >
      <PartyForm
        date={date}
        editingParty={editingParty}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </BottomSheet>
  );
}
