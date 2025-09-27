import { useState } from 'react';
import { X, Plus, Clock, MapPin, Users, Mail, User, Trash2, Calendar, Baby, Edit, Eye } from 'lucide-react';
import { api } from '../../lib/api';
import { formatTime } from '../../lib/date';
import { toast } from 'sonner';
import { bracketForAge } from '../../lib/ageColors';
import { BG } from '../../lib/i18n';
import { PartyFormModal } from './PartyFormModal';
import { PartyDetailsModal } from './PartyDetailsModal';

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



export function PartyModal({ date, parties, onClose, onPartyCreated, onPartyDeleted }: PartyModalProps) {
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleEditParty = (party: Party) => {
    setEditingParty(party);
    setShowFormModal(true);
  };

  const handleViewDetails = (party: Party) => {
    setSelectedParty(party);
    setShowDetailsModal(true);
  };

  const handleAddNewParty = () => {
    setEditingParty(null);
    setShowFormModal(true);
  };

  const handleFormSuccess = () => {
    setShowFormModal(false);
    setEditingParty(null);
    onPartyCreated();
  };

  const handleFormClose = () => {
    setShowFormModal(false);
    setEditingParty(null);
  };

  const handleDelete = async (partyId: string) => {
    if (!confirm('Сигурни ли сте, че искате да изтриете това парти?')) return;

    setDeleting(partyId);
    try {
      await api.delete(`/parties/${partyId}`);
      toast.success(BG.partyDeletedSuccess);
      
      // If this was the last party for the day, close the modal
      if (parties.length === 1) {
        onClose();
      }
      
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
                {BG.formatDate(date)}
              </h2>
            </div>
            <p className="text-sm text-gray-600 ml-7">
              {parties.length} {parties.length === 1 ? 'парти планирано' : 'партита планирани'}
            </p>
          </div>
        </div>

        <div className="p-4">
          {/* Existing Parties */}
          {parties.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{BG.scheduledParties}</h3>
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
                          <span className="text-sm text-gray-600">({party.kidAge} {BG.yearsOld})</span>
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
                              <span>{party.guestsCount} {party.guestsCount === 1 ? BG.guest : BG.guests}</span>
                            </div>
                          )}
                        </div>
                        
                        {party.address && (
                          <div className="mt-2 text-sm text-gray-600">
                            <strong>Адрес:</strong> {party.address}
                          </div>
                        )}
                        
                        {party.notes && (
                          <div className="mt-2 text-sm text-gray-600">
                            <strong>Бележки:</strong> {party.notes}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(party)}
                          className="p-2 text-green-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Детайли"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditParty(party)}
                          className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Редактиране"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(party._id)}
                          disabled={deleting === party._id}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Изтриване"
                        >
                          {deleting === party._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add New Party Button */}
          <button
            onClick={handleAddNewParty}
            className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-primary-300 text-primary-600 hover:border-primary-400 hover:text-primary-700 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="font-medium">{BG.addNewParty}</span>
          </button>
        </div>
      </div>

      {/* Party Form Modal */}
      <PartyFormModal
        isOpen={showFormModal}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        date={date}
        editingParty={editingParty}
      />

      {/* Party Details Modal */}
      <PartyDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        party={selectedParty}
        date={date}
      />
    </div>
  );
}
