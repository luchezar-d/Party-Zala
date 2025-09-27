import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Calendar } from 'lucide-react';
import { api } from '../../lib/api';
import { formatDateForAPI } from '../../lib/date';
import { toast } from 'sonner';
import { BG } from '../../lib/i18n';

const partySchema = z.object({
  kidName: z.string().min(2, BG.kidNameMinLength),
  kidAge: z.number().min(1, BG.ageMinMax).max(18, BG.ageMinMax),
  locationName: z.string().min(1, BG.locationRequired),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  address: z.string().optional(),
  parentName: z.string().optional(),
  parentEmail: z.string().email(BG.validEmail).optional().or(z.literal('')),
  guestsCount: z.number().min(0, BG.guestCountNegative).optional(),
  notes: z.string().optional(),
});

type PartyFormData = z.infer<typeof partySchema>;

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
}

interface PartyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  date: Date;
  editingParty?: Party | null;
}

export function PartyFormModal({ isOpen, onClose, onSuccess, date, editingParty }: PartyFormModalProps) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PartyFormData>({
    resolver: zodResolver(partySchema),
    defaultValues: editingParty ? {
      kidName: editingParty.kidName,
      kidAge: editingParty.kidAge,
      locationName: editingParty.locationName,
      startTime: editingParty.startTime || '',
      endTime: editingParty.endTime || '',
      address: editingParty.address || '',
      parentName: editingParty.parentName || '',
      parentEmail: editingParty.parentEmail || '',
      guestsCount: editingParty.guestsCount || undefined,
      notes: editingParty.notes || '',
    } : {
      kidAge: 6,
      guestsCount: 10,
    },
  });

  const onSubmit = async (data: PartyFormData) => {
    setSubmitting(true);
    try {
      const partyData = {
        ...data,
        partyDate: formatDateForAPI(date),
        kidAge: Number(data.kidAge),
        guestsCount: data.guestsCount ? Number(data.guestsCount) : undefined,
        parentEmail: data.parentEmail || undefined,
      };

      if (editingParty) {
        // Update existing party
        await api.put(`/parties/${editingParty._id}`, partyData);
        toast.success(BG.partyUpdatedSuccess);
      } else {
        // Create new party
        await api.post('/parties', partyData);
        toast.success(BG.partyCreatedSuccess);
      }
      
      reset();
      onClose();
      onSuccess();
    } catch (error: any) {
      console.error('Failed to save party:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save party';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-4 border-b border-gray-100">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="pr-10">
            <div className="flex items-center space-x-2 mb-1">
              <div className="bg-primary-100 p-1.5 rounded-lg">
                <Calendar className="h-4 w-4 text-primary-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                {editingParty ? BG.updateParty : BG.createParty}
              </h2>
            </div>
            <p className="text-sm text-gray-600 ml-7">
              {BG.formatDate(date)}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Kid Name & Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {BG.kidName} *
                </label>
                <input
                  {...register('kidName')}
                  type="text"
                  className="input-field"
                  placeholder="Въведете име на детето"
                />
                {errors.kidName && (
                  <p className="mt-1 text-sm text-red-600">{errors.kidName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {BG.kidAge} *
                </label>
                <input
                  {...register('kidAge', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  max="18"
                  className="input-field"
                  placeholder="Възраст"
                />
                {errors.kidAge && (
                  <p className="mt-1 text-sm text-red-600">{errors.kidAge.message}</p>
                )}
              </div>
            </div>

            {/* Location Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {BG.locationName} *
              </label>
              <input
                {...register('locationName')}
                type="text"
                className="input-field"
                placeholder="напр. HappyKids Center, градски парк"
              />
              {errors.locationName && (
                <p className="mt-1 text-sm text-red-600">{errors.locationName.message}</p>
              )}
            </div>

            {/* Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {BG.startTime}
                </label>
                <input
                  {...register('startTime')}
                  type="time"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {BG.endTime}
                </label>
                <input
                  {...register('endTime')}
                  type="time"
                  className="input-field"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {BG.address}
              </label>
              <input
                {...register('address')}
                type="text"
                className="input-field"
                placeholder="Пълен адрес (по избор)"
              />
            </div>

            {/* Parent Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {BG.parentName}
                </label>
                <input
                  {...register('parentName')}
                  type="text"
                  className="input-field"
                  placeholder="Име на родител/настойник"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {BG.parentEmail}
                </label>
                <input
                  {...register('parentEmail')}
                  type="email"
                  className="input-field"
                  placeholder="родител@example.com"
                />
                {errors.parentEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.parentEmail.message}</p>
                )}
              </div>
            </div>

            {/* Guest Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {BG.expectedGuests}
              </label>
              <input
                {...register('guestsCount', { valueAsNumber: true })}
                type="number"
                min="0"
                className="input-field"
                placeholder="Брой очаквани гости"
              />
              {errors.guestsCount && (
                <p className="mt-1 text-sm text-red-600">{errors.guestsCount.message}</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {BG.notes}
              </label>
              <textarea
                {...register('notes')}
                rows={2}
                className="input-field resize-none"
                placeholder="Допълнителни бележки за партито..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex space-x-3 pt-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editingParty ? 'Обновява...' : 'Създава...'}
                  </div>
                ) : (
                  editingParty ? BG.updateParty : BG.createParty
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
              >
                {BG.cancel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
