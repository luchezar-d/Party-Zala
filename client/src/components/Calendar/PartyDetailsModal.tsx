import { X, Calendar, Clock, Users, Baby, ChefHat, User } from 'lucide-react';
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

interface PartyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  party: Party | null;
  date: Date;
}

export function PartyDetailsModal({ isOpen, onClose, party, date }: PartyDetailsModalProps) {
  if (!isOpen || !party) return null;

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md max-h-[85vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="p-4">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-100 p-1.5 rounded-lg">
                <Calendar className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Детайли за партито
                </h2>
                <p className="text-sm text-gray-600">
                  {BG.formatDate(date)}
                </p>
              </div>
            </div>

            {/* Party Card */}
            <div className="rounded-lg p-3 border bg-purple-100/80 text-purple-900 ring-1 ring-purple-200/50">
              <div className="flex items-center space-x-2 mb-2">
                <Baby className="h-4 w-4 text-primary-600" />
                <span className="font-bold text-gray-900">{party.kidName}</span>
                <span className="text-sm text-gray-600">({party.kidAge} {BG.yearsOld})</span>
              </div>
            </div>

            {/* Basic Info Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Baby className="h-4 w-4" />
                <span>Основна информация</span>
              </div>
              
              <div className="grid grid-cols-1 gap-2 pl-6">
                {party.partyType && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Вид
                    </label>
                    <p className="text-sm text-gray-900">{party.partyType}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Адрес
                  </label>
                  <p className="text-sm text-gray-900">{party.address || party.locationName || '—'}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Капаро
                  </label>
                  <p className="text-sm text-gray-900">{party.deposit ?? 0}€</p>
                </div>
              </div>
            </div>

            {/* Time Section */}
            {(party.startTime || party.endTime) && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Clock className="h-4 w-4" />
                  <span>Час</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-6">
                  {party.startTime && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Начален час
                      </label>
                      <p className="text-sm text-gray-900">{formatTime(party.startTime)}</p>
                    </div>
                  )}

                  {party.endTime && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Краен час
                      </label>
                      <p className="text-sm text-gray-900">{formatTime(party.endTime)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* People Count Section */}
            {(party.kidsCount || party.parentsCount || party.guestsCount) && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Users className="h-4 w-4" />
                  <span>Брой хора</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-6">
                  {party.kidsCount && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Брой деца
                      </label>
                      <p className="text-sm text-gray-900">{party.kidsCount}</p>
                    </div>
                  )}

                  {party.parentsCount && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Брой родители
                      </label>
                      <p className="text-sm text-gray-900">{party.parentsCount}</p>
                    </div>
                  )}

                  {party.guestsCount && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Общо гости
                      </label>
                      <p className="text-sm text-gray-900">{party.guestsCount}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact Info Section */}
            {(party.parentName || party.parentEmail || party.phoneNumber) && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <User className="h-4 w-4" />
                  <span>Контакт</span>
                </div>
                
                <div className="grid grid-cols-1 gap-2 pl-6">
                  {party.parentName && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Име на родителя
                      </label>
                      <p className="text-sm text-gray-900">{party.parentName}</p>
                    </div>
                  )}

                  {party.phoneNumber && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Телефонен номер
                      </label>
                      <p className="text-sm text-gray-900">{party.phoneNumber}</p>
                    </div>
                  )}

                  {party.parentEmail && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Имейл
                      </label>
                      <p className="text-sm text-gray-900 break-all">{party.parentEmail}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Catering Section */}
            {(party.kidsCatering || party.parentsCatering) && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <ChefHat className="h-4 w-4" />
                  <span>Кетъринг</span>
                </div>
                
                <div className="grid grid-cols-1 gap-2 pl-6">
                  {party.kidsCatering && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Кетъринг деца
                      </label>
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{party.kidsCatering}</p>
                    </div>
                  )}

                  {party.parentsCatering && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Кетъринг родители
                      </label>
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{party.parentsCatering}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Spacer to match form height - extra padding to ensure consistent height */}
            <div className="py-8"></div>

            {/* Close Button */}
            <div className="flex space-x-3 pt-4 border-t border-gray-100">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors min-h-[44px]"
              >
                Затвори
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
