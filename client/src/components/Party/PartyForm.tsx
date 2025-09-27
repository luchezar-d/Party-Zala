import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Clock, Users, Baby, ChefHat, StickyNote } from 'lucide-react';
import { partySchema, type PartyFormData } from '../../validators/party';
import { api } from '../../lib/api';
import { formatDateForAPI } from '../../lib/date';
import { toast } from 'sonner';
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
}

interface PartyFormProps {
  date: Date;
  editingParty?: Party | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PartyForm({ date, editingParty, onSuccess, onCancel }: PartyFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<PartyFormData>({
    resolver: zodResolver(partySchema),
    defaultValues: editingParty ? {
      partyDate: formatDateForAPI(new Date(editingParty.partyDate)),
      kidName: editingParty.kidName,
      kidAge: editingParty.kidAge,
      locationName: editingParty.locationName,
      startTime: editingParty.startTime || '',
      endTime: editingParty.endTime || '',
      address: editingParty.address || '',
      parentName: editingParty.parentName || '',
      parentEmail: editingParty.parentEmail || '',
      guestsCount: editingParty.guestsCount,
      notes: editingParty.notes || '',
      kidsCount: editingParty.kidsCount,
      parentsCount: editingParty.parentsCount,
      kidsCatering: editingParty.kidsCatering || '',
      parentsCatering: editingParty.parentsCatering || '',
    } : {
      partyDate: formatDateForAPI(date),
      kidName: '',
      kidAge: 1,
      locationName: '',
      startTime: '',
      endTime: '',
      address: '',
      parentName: '',
      parentEmail: '',
      notes: '',
      kidsCatering: '',
      parentsCatering: '',
    }
  });

  const onSubmit = async (data: PartyFormData) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        // Convert empty strings to undefined
        startTime: data.startTime || undefined,
        endTime: data.endTime || undefined,
        address: data.address || undefined,
        parentName: data.parentName || undefined,
        parentEmail: data.parentEmail || undefined,
        notes: data.notes || undefined,
        kidsCatering: data.kidsCatering || undefined,
        parentsCatering: data.parentsCatering || undefined,
      };

      if (editingParty) {
        await api.put(`/parties/${editingParty._id}`, payload);
        toast.success(BG.partyUpdatedSuccess);
      } else {
        await api.post('/parties', payload);
        toast.success(BG.partyCreatedSuccess);
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Failed to save party:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save party';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="bg-primary-100 p-1.5 rounded-lg">
          <Calendar className="h-4 w-4 text-primary-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {editingParty ? BG.updateParty : BG.createParty}
          </h2>
          <p className="text-sm text-gray-600">
            {BG.formatDate(date)}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Baby className="h-4 w-4" />
            <span>Основна информация</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kid Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Име *
              </label>
              <input
                {...register('kidName')}
                type="text"
                className="input-field"
                placeholder="Име на детето"
              />
              {errors.kidName && (
                <p className="mt-1 text-sm text-red-600">{errors.kidName.message}</p>
              )}
            </div>

            {/* Kid Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Години *
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

            {/* Location */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Местоположение *
              </label>
              <input
                {...register('locationName')}
                type="text"
                className="input-field"
                placeholder="HappyKids Center, градски парк"
              />
              {errors.locationName && (
                <p className="mt-1 text-sm text-red-600">{errors.locationName.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Time Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Clock className="h-4 w-4" />
            <span>Час</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Начален час
              </label>
              <input
                {...register('startTime')}
                type="time"
                className="input-field"
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Краен час
              </label>
              <input
                {...register('endTime')}
                type="time"
                className="input-field"
              />
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* People Count Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Users className="h-4 w-4" />
            <span>Брой хора</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Брой деца
              </label>
              <input
                {...register('kidsCount', { valueAsNumber: true })}
                type="number"
                min="0"
                className="input-field"
                placeholder="10"
              />
              {errors.kidsCount && (
                <p className="mt-1 text-sm text-red-600">{errors.kidsCount.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Брой родители
              </label>
              <input
                {...register('parentsCount', { valueAsNumber: true })}
                type="number"
                min="0"
                className="input-field"
                placeholder="8"
              />
              {errors.parentsCount && (
                <p className="mt-1 text-sm text-red-600">{errors.parentsCount.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Catering Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <ChefHat className="h-4 w-4" />
            <span>Кетъринг</span>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Кетъринг деца
              </label>
              <textarea
                {...register('kidsCatering')}
                rows={3}
                className="input-field resize-none"
                placeholder="Хамбургери, картофки, сок, торта..."
              />
              {errors.kidsCatering && (
                <p className="mt-1 text-sm text-red-600">{errors.kidsCatering.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Кетъринг родители
              </label>
              <textarea
                {...register('parentsCatering')}
                rows={3}
                className="input-field resize-none"
                placeholder="Коктейлни хапки, салати, напитки..."
              />
              {errors.parentsCatering && (
                <p className="mt-1 text-sm text-red-600">{errors.parentsCatering.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <StickyNote className="h-4 w-4" />
            <span>Бележки</span>
          </div>
          
          <div>
            <textarea
              {...register('notes')}
              rows={3}
              className="input-field resize-none"
              placeholder="Допълнителни бележки за партито..."
            />
            {errors.notes && (
              <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex space-x-3 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
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
            onClick={onCancel}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors min-h-[44px]"
          >
            {BG.cancel}
          </button>
        </div>
      </form>
    </div>
  );
}
