import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../../lib/api';
import { formatDateForAPI } from '../../lib/date';
import { toast } from 'sonner';

const partySchema = z.object({
  kidName: z.string().min(2, 'Kid name must be at least 2 characters'),
  kidAge: z.number().min(1, 'Age must be at least 1').max(18, 'Age must be at most 18'),
  locationName: z.string().min(1, 'Location name is required'),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  address: z.string().optional(),
  parentName: z.string().optional(),
  parentEmail: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  guestsCount: z.number().min(0, 'Guest count cannot be negative').optional(),
  notes: z.string().optional(),
});

type PartyFormData = z.infer<typeof partySchema>;

interface PartyFormProps {
  defaultDate: Date;
  onSuccess: () => void;
  onCancel: () => void;
  onPartyDeleted?: () => void;
  compact?: boolean; // For mobile compact layout
}

export function PartyForm({ defaultDate, onSuccess, onCancel, compact = false }: PartyFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PartyFormData>({
    resolver: zodResolver(partySchema),
  });

  const onSubmit = async (data: PartyFormData) => {
    setSubmitting(true);
    try {
      const partyData = {
        ...data,
        partyDate: formatDateForAPI(defaultDate),
        guestsCount: data.guestsCount || undefined,
        parentEmail: data.parentEmail || undefined,
      };

      await api.post('/parties', partyData);
      toast.success('Party created successfully! 🎉');
      reset();
      onSuccess();
    } catch (error: any) {
      console.error('Error creating party:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to create party. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 ${compact ? 'space-y-3' : 'space-y-4'}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className={`grid ${compact ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-2 gap-3'}`}>
          {/* Kid Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kid's Name *
            </label>
            <input
              {...register('kidName')}
              type="text"
              className="input-field text-sm"
              placeholder="Enter kid's name"
            />
            {errors.kidName && (
              <p className="mt-1 text-xs text-red-600">{errors.kidName.message}</p>
            )}
          </div>

          {/* Kid Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age *
            </label>
            <input
              {...register('kidAge', { valueAsNumber: true })}
              type="number"
              min="1"
              max="18"
              className="input-field text-sm"
              placeholder="Age"
            />
            {errors.kidAge && (
              <p className="mt-1 text-xs text-red-600">{errors.kidAge.message}</p>
            )}
          </div>
        </div>

        {/* Location Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location Name *
          </label>
          <input
            {...register('locationName')}
            type="text"
            className="input-field text-sm"
            placeholder="e.g., HappyKids Center, Community Park"
          />
          {errors.locationName && (
            <p className="mt-1 text-xs text-red-600">{errors.locationName.message}</p>
          )}
        </div>

        {/* Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              {...register('startTime')}
              type="time"
              className="input-field text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              {...register('endTime')}
              type="time"
              className="input-field text-sm"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            {...register('address')}
            type="text"
            className="input-field text-sm"
            placeholder="Full address (optional)"
          />
        </div>

        {/* Parent Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Name
            </label>
            <input
              {...register('parentName')}
              type="text"
              className="input-field text-sm"
              placeholder="Parent/Guardian name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Email
            </label>
            <input
              {...register('parentEmail')}
              type="email"
              className="input-field text-sm"
              placeholder="parent@example.com"
            />
            {errors.parentEmail && (
              <p className="mt-1 text-xs text-red-600">{errors.parentEmail.message}</p>
            )}
          </div>
        </div>

        {/* Guest Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expected Guests
          </label>
          <input
            {...register('guestsCount', { valueAsNumber: true })}
            type="number"
            min="0"
            className="input-field text-sm"
            placeholder="Number of expected guests"
          />
          {errors.guestsCount && (
            <p className="mt-1 text-xs text-red-600">{errors.guestsCount.message}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="input-field resize-none text-sm"
            placeholder="Any additional notes about the party..."
          />
        </div>

        {/* Form Actions */}
        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm py-2.5"
          >
            {submitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </div>
            ) : (
              'Create Party'
            )}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
