import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { X, Plus, Clock, MapPin, Users, Mail, User, Trash2, Calendar, Baby } from 'lucide-react';
import { api } from '../../lib/api';
import { formatDateForAPI, formatTime } from '../../lib/date';
import { toast } from 'sonner';
import { bracketForAge } from '../../lib/ageColors';

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

interface PartyModalProps {
  date: Date;
  parties: Party[];
  onClose: () => void;
  onPartyCreated: () => void;
  onPartyDeleted: () => void;
}

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

export function PartyModal({ date, parties, onClose, onPartyCreated, onPartyDeleted }: PartyModalProps) {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PartyFormData>({
    resolver: zodResolver(partySchema),
    defaultValues: {
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

      await api.post('/parties', partyData);
      onPartyCreated();
      reset();
      setShowForm(false);
    } catch (error: any) {
      console.error('Failed to create party:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create party';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (partyId: string) => {
    if (!confirm('Are you sure you want to delete this party?')) return;

    setDeleting(partyId);
    try {
      await api.delete(`/parties/${partyId}`);
      onPartyDeleted();
    } catch (error: any) {
      console.error('Failed to delete party:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete party';
      toast.error(errorMessage);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-4 border-b border-gray-100">
          <button
            onClick={onClose}
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
                {format(date, 'MMM d, yyyy')}
              </h2>
            </div>
            <p className="text-sm text-gray-600 ml-7">
              {parties.length} {parties.length === 1 ? 'party' : 'parties'} scheduled
            </p>
          </div>
        </div>

        <div className="p-4">
          {/* Existing Parties */}
          {parties.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Parties</h3>
              <div className="space-y-3">
                {parties.map((party) => {
                  const bracket = bracketForAge(party.kidAge);
                  return (
                  <div key={party._id} className={`rounded-lg p-3 border ${bracket.block}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Baby className="h-4 w-4 text-primary-600" />
                          <span className="font-semibold text-gray-900">{party.kidName}</span>
                          <span className="text-sm text-gray-600">({party.kidAge} years old)</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{party.locationName}</span>
                          </div>
                          
                          {(party.startTime || party.endTime) && (
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>
                                {party.startTime && formatTime(party.startTime)}
                                {party.startTime && party.endTime && ' - '}
                                {party.endTime && formatTime(party.endTime)}
                              </span>
                            </div>
                          )}
                          
                          {party.parentName && (
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span>{party.parentName}</span>
                            </div>
                          )}
                          
                          {party.parentEmail && (
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4" />
                              <span>{party.parentEmail}</span>
                            </div>
                          )}
                          
                          {party.guestsCount && (
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>{party.guestsCount} guests</span>
                            </div>
                          )}
                        </div>
                        
                        {party.address && (
                          <div className="mt-2 text-sm text-gray-600">
                            <strong>Address:</strong> {party.address}
                          </div>
                        )}
                        
                        {party.notes && (
                          <div className="mt-2 text-sm text-gray-600">
                            <strong>Notes:</strong> {party.notes}
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleDelete(party._id)}
                        disabled={deleting === party._id}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deleting === party._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add New Party Button/Form */}
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-primary-300 text-primary-600 hover:border-primary-400 hover:text-primary-700 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span className="font-medium">Add New Party</span>
            </button>
          ) : (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Create New Party</h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  {/* Kid Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kid's Name *
                    </label>
                    <input
                      {...register('kidName')}
                      type="text"
                      className="input-field"
                      placeholder="Enter kid's name"
                    />
                    {errors.kidName && (
                      <p className="mt-1 text-sm text-red-600">{errors.kidName.message}</p>
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
                      className="input-field"
                      placeholder="Age"
                    />
                    {errors.kidAge && (
                      <p className="mt-1 text-sm text-red-600">{errors.kidAge.message}</p>
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
                    className="input-field"
                    placeholder="e.g., HappyKids Center, Community Park"
                  />
                  {errors.locationName && (
                    <p className="mt-1 text-sm text-red-600">{errors.locationName.message}</p>
                  )}
                </div>

                {/* Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      {...register('startTime')}
                      type="time"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
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
                    Address
                  </label>
                  <input
                    {...register('address')}
                    type="text"
                    className="input-field"
                    placeholder="Full address (optional)"
                  />
                </div>

                {/* Parent Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parent Name
                    </label>
                    <input
                      {...register('parentName')}
                      type="text"
                      className="input-field"
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
                      className="input-field"
                      placeholder="parent@example.com"
                    />
                    {errors.parentEmail && (
                      <p className="mt-1 text-sm text-red-600">{errors.parentEmail.message}</p>
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
                    className="input-field"
                    placeholder="Number of expected guests"
                  />
                  {errors.guestsCount && (
                    <p className="mt-1 text-sm text-red-600">{errors.guestsCount.message}</p>
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
                    className="input-field resize-none"
                    placeholder="Any additional notes about the party..."
                  />
                </div>

                {/* Form Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
                    onClick={() => {
                      setShowForm(false);
                      reset();
                    }}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
