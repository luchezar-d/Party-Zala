import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Calendar, MapPin, Baby, Edit, Trash2, AlertTriangle, ArrowLeft, X, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { BG } from '../lib/i18n';
import { PartyFormModal } from '../components/Calendar/PartyFormModal';
import type { Party } from '../components/Calendar/MonthView';

export function AllPartiesPage() {
  const navigate = useNavigate();
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'age'>('date');
  const [showFilters, setShowFilters] = useState(false);
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{type: 'all' | 'lastMonth' | 'single', partyId?: string} | null>(null);

  useEffect(() => {
    fetchAllParties();
  }, []);

  const fetchAllParties = async () => {
    setLoading(true);
    try {
      // Use the new /all endpoint to fetch ALL parties
      const response = await api.get('/parties/all');
      setParties(response.data);
    } catch (error: any) {
      console.error('Error fetching parties:', error);
      // Only show error if it's NOT a 401 (auth errors are handled globally)
      if (error.response?.status !== 401) {
        const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
        toast.error(`Грешка при зареждане: ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteParty = async (partyId: string) => {
    try {
      await api.delete(`/parties/${partyId}`);
      toast.success('Партито е изтрито успешно');
      fetchAllParties();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting party:', error);
      toast.error('Грешка при изтриване на партито');
    }
  };

  const handleDeleteAll = async () => {
    try {
      const response = await api.delete('/parties/all');
      toast.success(`Изтрити са ${response.data.deletedCount} партита`);
      fetchAllParties();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting all parties:', error);
      toast.error('Грешка при изтриване на партитата');
    }
  };

  const handleDeleteLastMonth = async () => {
    try {
      const today = new Date();
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      
      const from = lastMonthEnd.toISOString().split('T')[0];
      const to = lastMonthStart.toISOString().split('T')[0];
      
      const response = await api.delete(`/parties/range?from=${to}&to=${from}`);
      toast.success(`Изтрити са ${response.data.deletedCount} партита от миналия месец`);
      fetchAllParties();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting last month parties:', error);
      toast.error('Грешка при изтриване на партитата');
    }
  };

  const handleDeleteOld = async () => {
    try {
      const today = new Date();
      const oldDate = new Date('2000-01-01');
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const from = oldDate.toISOString().split('T')[0];
      const to = yesterday.toISOString().split('T')[0];
      
      const response = await api.delete(`/parties/range?from=${from}&to=${to}`);
      toast.success(`Изтрити са ${response.data.deletedCount} минали партита`);
      fetchAllParties();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting old parties:', error);
      toast.error('Грешка при изтриване на партитата');
    }
  };

  const filteredAndSortedParties = useMemo(() => {
    let filtered = parties;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(party =>
        party.kidName.toLowerCase().includes(term) ||
        party.locationName.toLowerCase().includes(term) ||
        party.parentName?.toLowerCase().includes(term)
      );
    }

    // Age filter
    if (ageFilter !== 'all') {
      const [min, max] = ageFilter.split('-').map(Number);
      filtered = filtered.filter(party => {
        const age = party.kidAge;
        return age >= min && age <= max;
      });
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.partyDate).getTime() - new Date(b.partyDate).getTime();
      } else if (sortBy === 'name') {
        return a.kidName.localeCompare(b.kidName);
      } else {
        return a.kidAge - b.kidAge;
      }
    });

    return sorted;
  }, [parties, searchTerm, ageFilter, sortBy]);

  const handleEditParty = (party: Party) => {
    setEditingParty(party);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setEditingParty(null);
    fetchAllParties();
  };

  const exportToCSV = () => {
    if (filteredAndSortedParties.length === 0) {
      toast.error('Няма партита за експортиране');
      return;
    }

    // Create CSV header with all available fields
    const headers = [
      '№',
      'Дата', 
      'Начало', 
      'Край',
      'Вид',
      'Име на детето', 
      'Години', 
      'Адрес',
      'Тел. Номер',
      'Капаро (€)',
      'Брой деца',
      'Брой родители',
      'Кетъринг деца',
      'Кетъринг родители',
      'Бележки',
      'Създадено на'
    ];
    
    // Create CSV rows with all fields
    const rows = filteredAndSortedParties.map((party, index) => {
      const partyDate = new Date(party.partyDate);
      const formattedDate = BG.formatDate(partyDate);
      
      // Format created date
      const createdDate = party.createdAt ? new Date(party.createdAt) : null;
      const formattedCreatedDate = createdDate 
        ? `${createdDate.getDate().toString().padStart(2, '0')}.${(createdDate.getMonth() + 1).toString().padStart(2, '0')}.${createdDate.getFullYear()} ${createdDate.getHours().toString().padStart(2, '0')}:${createdDate.getMinutes().toString().padStart(2, '0')}`
        : '';
      
      return [
        (index + 1).toString(), // Row number
        formattedDate,
        party.startTime || '',
        party.endTime || '',
        party.partyType || '',
        party.kidName,
        party.kidAge.toString(),
        party.locationName, // This is now the "Address" field
        party.phoneNumber || '',
        (party.deposit || '').toString(),
        (party.kidsCount || '').toString(),
        (party.parentsCount || '').toString(),
        party.kidsCatering || '',
        party.parentsCatering || '',
        party.notes || '',
        formattedCreatedDate
      ];
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => {
        // Escape commas, quotes, and newlines in cell content
        const escaped = cell.replace(/"/g, '""').replace(/\n/g, ' ');
        return cell.includes(',') || cell.includes('"') || cell.includes('\n') ? `"${escaped}"` : escaped;
      }).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `partita-${timestamp}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Експортирани ${filteredAndSortedParties.length} партита`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-sky-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Зареждане...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/calendar')}
          className="flex items-center gap-2 h-10 px-4 rounded-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-semibold text-sm shadow-md active:scale-95 transition-all focus-ring"
          aria-label="Назад към календара"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Назад към календара</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900 flex-1">Всички партита</h1>
        <button
          onClick={exportToCSV}
          disabled={filteredAndSortedParties.length === 0}
          className="flex items-center gap-2 h-10 px-4 rounded-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold text-sm shadow-md active:scale-95 transition-all focus-ring disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          aria-label="Експортирай в CSV"
        >
          <Download className="h-5 w-5" />
          <span className="hidden sm:inline">CSV</span>
        </button>
        <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
          {filteredAndSortedParties.length} {filteredAndSortedParties.length === 1 ? 'парти' : 'партита'}
        </span>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        {/* Bulk Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowDeleteConfirm({ type: 'lastMonth' })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-orange-100 text-orange-700 hover:bg-orange-200 transition-all border-2 border-orange-200"
          >
            <Trash2 className="h-4 w-4" />
            Изтрий миналия месец
          </button>
          
          <button
            onClick={() => setShowDeleteConfirm({ type: 'all', partyId: 'old' })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-amber-100 text-amber-700 hover:bg-amber-200 transition-all border-2 border-amber-200"
          >
            <Trash2 className="h-4 w-4" />
            Изтрий минали партита
          </button>
          
          <button
            onClick={() => setShowDeleteConfirm({ type: 'all' })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-red-100 text-red-700 hover:bg-red-200 transition-all border-2 border-red-200"
          >
            <AlertTriangle className="h-4 w-4" />
            Изтрий ВСИЧКИ
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Търси по име, локация..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            showFilters || ageFilter !== 'all'
              ? 'bg-sky-600 text-white shadow-md'
              : 'bg-white text-gray-700 border-2 border-gray-200'
          }`}
        >
          <Filter className="h-4 w-4" />
          Филтри {ageFilter !== 'all' && '(1)'}
        </button>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-4 space-y-4">
            {/* Age Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Възраст</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'Всички' },
                  { value: '1-4', label: '1-4 год.' },
                  { value: '5-8', label: '5-8 год.' },
                  { value: '9-12', label: '9-12 год.' },
                  { value: '13-18', label: '13-18 год.' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAgeFilter(option.value)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      ageFilter === option.value
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Подреди по</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'date', label: 'Дата' },
                  { value: 'name', label: 'Име' },
                  { value: 'age', label: 'Възраст' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value as any)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      sortBy === option.value
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Parties List */}
      {filteredAndSortedParties.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {searchTerm || ageFilter !== 'all' ? 'Няма резултати' : BG.noPartiesYet}
          </h3>
          <p className="text-gray-600 font-medium">
            {searchTerm || ageFilter !== 'all' ? 'Опитайте с различни филтри' : 'Добавете първото си парти!'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAndSortedParties.map((party) => {
            const partyDate = new Date(party.partyDate);
            
            return (
              <div
                key={party._id}
                className="rounded-2xl bg-purple-100/80 text-purple-900 ring-1 ring-purple-200/50 border-opacity-20 shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2">
                      <Calendar className="h-4 w-4" />
                      {BG.formatDate(partyDate)}
                      {party.startTime && (
                        <span className="opacity-75">• {party.startTime}</span>
                      )}
                    </div>

                    {/* Kid Name & Age */}
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {party.kidName}
                      <span className="text-sm font-semibold opacity-75 ml-2">
                        ({party.kidAge} {BG.yearsOld})
                      </span>
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <MapPin className="h-4 w-4" />
                      {party.locationName}
                    </div>

                    {/* Parent */}
                    {party.parentName && (
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mt-1">
                        <Baby className="h-4 w-4" />
                        {party.parentName}
                      </div>
                    )}

                    {/* Kids and Parents Count */}
                    {((party.kidsCount !== undefined && party.kidsCount > 0) || (party.parentsCount !== undefined && party.parentsCount > 0)) && (
                      <div className="text-sm font-medium text-gray-600 mt-1">
                        {party.kidsCount ? `� ${party.kidsCount} деца` : ''}
                        {party.kidsCount && party.parentsCount ? ' • ' : ''}
                        {party.parentsCount ? `👨 ${party.parentsCount} родители` : ''}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleEditParty(party)}
                      className="h-10 w-10 rounded-full hover:bg-white/60 active:scale-95 transition-all flex items-center justify-center focus-ring"
                      aria-label="Редактирай"
                    >
                      <Edit className="h-5 w-5 text-blue-600" />
                    </button>
                    
                    <button
                      onClick={() => setShowDeleteConfirm({ type: 'single', partyId: party._id })}
                      className="h-10 w-10 rounded-full hover:bg-red-100 active:scale-95 transition-all flex items-center justify-center focus-ring"
                      aria-label="Изтрий"
                    >
                      <Trash2 className="h-5 w-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Потвърдете изтриването</h3>
                <p className="text-sm text-gray-600">
                  {showDeleteConfirm.type === 'all' && showDeleteConfirm.partyId === 'old' && 'Ще бъдат изтрити всички минали партита'}
                  {showDeleteConfirm.type === 'all' && !showDeleteConfirm.partyId && 'Ще бъдат изтрити ВСИЧКИ партита'}
                  {showDeleteConfirm.type === 'lastMonth' && 'Ще бъдат изтрити партитата от миналия месец'}
                  {showDeleteConfirm.type === 'single' && 'Ще бъде изтрито това парти'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
              >
                Отказ
              </button>
              <button
                onClick={() => {
                  if (showDeleteConfirm.type === 'single' && showDeleteConfirm.partyId) {
                    handleDeleteParty(showDeleteConfirm.partyId);
                  } else if (showDeleteConfirm.type === 'lastMonth') {
                    handleDeleteLastMonth();
                  } else if (showDeleteConfirm.type === 'all' && showDeleteConfirm.partyId === 'old') {
                    handleDeleteOld();
                  } else if (showDeleteConfirm.type === 'all') {
                    handleDeleteAll();
                  }
                }}
                className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-all shadow-md"
              >
                Изтрий
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingParty && (
        <PartyFormModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingParty(null);
          }}
          onSuccess={handleEditSuccess}
          date={new Date(editingParty.partyDate)}
          editingParty={editingParty}
        />
      )}
    </div>
  );
}
