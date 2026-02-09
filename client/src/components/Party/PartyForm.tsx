import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Clock, Users, Baby, ChefHat, StickyNote, Phone } from 'lucide-react';
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
  phoneNumber?: string;
  deposit?: number;
  partyType?: string;
}

interface PartyFormProps {
  date: Date;
  editingParty?: Party | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PartyForm({ date, editingParty, onSuccess, onCancel }: PartyFormProps) {
  const [submitting, setSubmitting] = useState(false);

  // Debug: Log the editing party data
  console.log('PartyForm editingParty:', editingParty);
  console.log('PartyForm partyType value:', editingParty?.partyType);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PartyFormData>({
    resolver: zodResolver(partySchema),
    defaultValues: editingParty ? {
      partyDate: formatDateForAPI(new Date(editingParty.partyDate)),
      kidName: editingParty.kidName,
      kidAge: editingParty.kidAge,
      locationName: editingParty.locationName,
      startTime: editingParty.startTime || '',
      endTime: editingParty.endTime || '',
      parentName: editingParty.parentName || '',
      parentEmail: editingParty.parentEmail || '',
      notes: editingParty.notes || '',
      kidsCount: editingParty.kidsCount,
      parentsCount: editingParty.parentsCount,
      kidsCatering: editingParty.kidsCatering || '',
      parentsCatering: editingParty.parentsCatering || '',
      phoneNumber: editingParty.phoneNumber || '',
      deposit: editingParty.deposit,
      partyType: (editingParty.partyType || '') as '' | 'Външно парти' | 'Пейнтбол' | 'Детска зала',
    } : {
      partyDate: formatDateForAPI(date),
      kidName: '',
      kidAge: 1,
      locationName: '',
      startTime: '',
      endTime: '',
      parentName: '',
      parentEmail: '',
      notes: '',
      kidsCatering: '',
      parentsCatering: '',
      phoneNumber: '',
      partyType: '' as '',
    }
  });

  // Reset form when editingParty changes
  useEffect(() => {
    if (editingParty) {
      reset({
        partyDate: formatDateForAPI(new Date(editingParty.partyDate)),
        kidName: editingParty.kidName,
        kidAge: editingParty.kidAge,
        locationName: editingParty.locationName,
        startTime: editingParty.startTime || '',
        endTime: editingParty.endTime || '',
        parentName: editingParty.parentName || '',
        parentEmail: editingParty.parentEmail || '',
        notes: editingParty.notes || '',
        kidsCount: editingParty.kidsCount,
        parentsCount: editingParty.parentsCount,
        kidsCatering: editingParty.kidsCatering || '',
        parentsCatering: editingParty.parentsCatering || '',
        phoneNumber: editingParty.phoneNumber || '',
        deposit: editingParty.deposit,
        partyType: (editingParty.partyType || '') as '' | 'Външно парти' | 'Пейнтбол' | 'Детска зала',
      });
    }
  }, [editingParty, reset]);

  const onSubmit = async (data: PartyFormData) => {
    setSubmitting(true);
    
    // Debug logging
    console.log('Form data before processing:', data);
    console.log('partyType value:', data.partyType);
    console.log('partyType type:', typeof data.partyType);
    
    try {
      const payload = {
        ...data,
        // Convert empty strings to undefined for optional fields
        startTime: data.startTime || undefined,
        endTime: data.endTime || undefined,
        parentName: data.parentName || undefined,
        parentEmail: data.parentEmail || undefined,
        notes: data.notes || undefined,
        kidsCatering: data.kidsCatering || undefined,
        parentsCatering: data.parentsCatering || undefined,
        // phoneNumber is now required, so don't convert to undefined
        // Keep partyType value even if it's an empty string (valid option)
        // deposit is already included via spread
      };

      console.log('Payload being sent:', payload);
      console.log('Payload partyType:', payload.partyType);

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
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-br from-sky-100 to-pink-100 p-2 rounded-xl">
          <Calendar className="h-5 w-5 text-sky-700" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {editingParty ? BG.updateParty : BG.createParty}
          </h2>
          <p className="text-sm font-medium text-gray-600">
            {BG.formatDate(date)}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-gray-800">
            <Baby className="h-4 w-4" />
            <span>Основна информация</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kid Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Име <span className="text-red-600">*</span>
              </label>
              <input
                {...register('kidName')}
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 font-medium"
                placeholder="Име на детето"
              />
              {errors.kidName && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.kidName.message}</p>
              )}
            </div>

            {/* Kid Age */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Години <span className="text-red-600">*</span>
              </label>
              <input
                {...register('kidAge', { valueAsNumber: true })}
                type="number"
                min="1"
                max="18"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 font-medium"
                placeholder="Възраст"
              />
              {errors.kidAge && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.kidAge.message}</p>
              )}
            </div>

            {/* Party Type */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Вид
              </label>
              <select
                {...register('partyType')}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 font-medium bg-white cursor-pointer hover:border-gray-300"
              >
                <option value="">Изберете вид парти</option>
                <option value="Външно парти">Външно парти</option>
                <option value="Пейнтбол">Пейнтбол</option>
                <option value="Детска зала">Детска зала</option>
              </select>
              {errors.partyType && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.partyType.message}</p>
              )}
            </div>

            {/* Location (renamed from Местоположение to Адрес) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Адрес <span className="text-red-600">*</span>
              </label>
              <input
                {...register('locationName')}
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 font-medium"
                placeholder="HappyKids Center, градски парк, ул. Примерна 123"
              />
              {errors.locationName && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.locationName.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact & Payment Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-gray-800">
            <Phone className="h-4 w-4" />
            <span>Контакт и плащане</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Тел. Номер <span className="text-red-600">*</span>
              </label>
              <input
                {...register('phoneNumber')}
                type="tel"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 font-medium"
                placeholder="+359 888 123 456"
              />
              {errors.phoneNumber && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.phoneNumber.message}</p>
              )}
            </div>

            {/* Deposit */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Капаро (€)
              </label>
              <input
                {...register('deposit', { valueAsNumber: true })}
                type="number"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 font-medium"
                placeholder="100"
              />
              {errors.deposit && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.deposit.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Time Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-gray-800">
            <Clock className="h-4 w-4" />
            <span>Час</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Начален час
              </label>
              <input
                {...register('startTime')}
                type="time"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 font-medium [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 [&::-webkit-calendar-picker-indicator]:transition-opacity"
              />
              {errors.startTime && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.startTime.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Краен час
              </label>
              <input
                {...register('endTime')}
                type="time"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 font-medium [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 [&::-webkit-calendar-picker-indicator]:transition-opacity"
              />
              {errors.endTime && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.endTime.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* People Count Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-gray-800">
            <Users className="h-4 w-4" />
            <span>Брой хора</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Брой деца
              </label>
              <input
                {...register('kidsCount', { valueAsNumber: true })}
                type="number"
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 font-medium"
                placeholder="10"
              />
              {errors.kidsCount && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.kidsCount.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Брой родители
              </label>
              <input
                {...register('parentsCount', { valueAsNumber: true })}
                type="number"
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 font-medium"
                placeholder="8"
              />
              {errors.parentsCount && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.parentsCount.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Catering Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-gray-800">
            <ChefHat className="h-4 w-4" />
            <span>Кетъринг</span>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Кетъринг деца
              </label>
              <textarea
                {...register('kidsCatering')}
                rows={3}
                className="input-field resize-none"
                placeholder="Хамбургери, картофки, сок, торта..."
              />
              {errors.kidsCatering && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.kidsCatering.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Кетъринг родители
              </label>
              <textarea
                {...register('parentsCatering')}
                rows={3}
                className="input-field resize-none"
                placeholder="Коктейлни хапки, салати, напитки..."
              />
              {errors.parentsCatering && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.parentsCatering.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-gray-800">
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
              <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.notes.message}</p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t-2 border-gray-100">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed min-h-[52px] active:scale-[0.98]"
          >
            {submitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-3 border-white border-t-transparent mr-2"></div>
                {editingParty ? 'Обновява...' : 'Създава...'}
              </div>
            ) : (
              editingParty ? BG.updateParty : BG.createParty
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3.5 text-gray-700 font-semibold hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all min-h-[52px] border-2 border-gray-200 active:scale-[0.98]"
          >
            {BG.cancel}
          </button>
        </div>
      </form>
    </div>
  );
}
