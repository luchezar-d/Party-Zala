import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Calendar, MapPin, Baby, Edit, Trash2, AlertTriangle, ArrowLeft, X, Download, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { BG } from '../lib/i18n';
import { PartyFormModal } from '../components/Calendar/PartyFormModal';
import { useAuthStore } from '../store/auth';
import type { Party } from '../components/Calendar/MonthView';

const PAGE_SIZE = 20;

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function AllPartiesPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const [parties, setParties] = useState<Party[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'age'>('date');
  const [showFilters, setShowFilters] = useState(false);
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{type: 'all' | 'month' | 'single', partyId?: string, month?: string} | null>(null);
  const [showDeleteDropdown, setShowDeleteDropdown] = useState(false);
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchAllParties(currentPage);
  }, [currentPage]);

  const fetchAllParties = async (page: number) => {
    setLoading(true);
    try {
      const response = await api.get(`/parties/all?page=${page}`);
      setParties(response.data.parties);
      setPagination(response.data.pagination);
    } catch (error: any) {
      console.error('Error fetching parties:', error);
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
      fetchAllParties(currentPage);
      setShowDeleteConfirm(null);
      setConfirmText('');
    } catch (error) {
      console.error('Error deleting party:', error);
      toast.error('Грешка при изтриване на партито');
    }
  };

  const handleDeleteByMonth = async (yearMonth: string) => {
    try {
      const [year, month] = yearMonth.split('-').map(Number);
      const monthStart = new Date(year, month - 1, 1);
      const monthEnd = new Date(year, month, 0, 23, 59, 59, 999); // Last moment of last day
      
      const from = monthStart.toISOString().split('T')[0];
      const to = monthEnd.toISOString().split('T')[0];
      
      console.log('Deleting parties for month:', { yearMonth, from, to, month, year });
      
      const response = await api.delete(`/parties/range?from=${from}&to=${to}`);
      
      if (response.data.deletedCount === 0) {
        toast.warning(`Няма партита за изтриване от ${BG.months[month - 1]} ${year}`);
      } else {
        toast.success(`Изтрити са ${response.data.deletedCount} партита от ${BG.months[month - 1]} ${year}`);
      }
      
      fetchAllParties(currentPage);
      setShowDeleteConfirm(null);
      setShowMonthSelector(false);
      setConfirmText('');
    } catch (error) {
      console.error('Error deleting month parties:', error);
      toast.error('Грешка при изтриване на партитата');
    }
  };

  const filteredAndSortedParties = useMemo(() => {
    let filtered = parties;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(party =>
        party.kidName.toLowerCase().includes(term) ||
        party.locationName.toLowerCase().includes(term) ||
        party.parentName?.toLowerCase().includes(term)
      );
    }

    if (ageFilter !== 'all') {
      const [min, max] = ageFilter.split('-').map(Number);
      filtered = filtered.filter(party => party.kidAge >= min && party.kidAge <= max);
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'date') return new Date(b.partyDate).getTime() - new Date(a.partyDate).getTime();
      if (sortBy === 'name') return a.kidName.localeCompare(b.kidName);
      return a.kidAge - b.kidAge;
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
    fetchAllParties(currentPage);
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
          {pagination.total} {pagination.total === 1 ? 'парти' : 'партита'}
        </span>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        {/* Bulk Delete Dropdown — admin only */}
        {isAdmin() && (
          <div className="relative">
            <button
              onClick={() => setShowDeleteDropdown(!showDeleteDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-red-50 text-red-700 hover:bg-red-100 transition-all border-2 border-red-200"
            >
              <Trash2 className="h-4 w-4" />
              Изтрий партита
              <ChevronDown className={`h-4 w-4 transition-transform ${showDeleteDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDeleteDropdown && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-lg border-2 border-gray-200 z-10 overflow-hidden">
                <button
                  onClick={() => { setShowMonthSelector(true); setShowDeleteDropdown(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-all text-left border-b border-gray-100"
                >
                  <Calendar className="h-4 w-4 text-orange-600" />
                  <div>
                    <div className="font-semibold text-sm text-gray-900">Изтрий по месец</div>
                    <div className="text-xs text-gray-500">Избери месец за изтриване на партита</div>
                  </div>
                </button>
                <button disabled className="w-full flex items-center gap-3 px-4 py-3 text-left opacity-50 cursor-not-allowed">
                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-semibold text-sm text-gray-400">ВСИЧКИ партита</div>
                    <div className="text-xs text-gray-400">Изтрий абсолютно всички партита (деактивирано)</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}

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
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full hover:bg-gray-100 flex items-center justify-center">
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${showFilters || ageFilter !== 'all' ? 'bg-sky-600 text-white shadow-md' : 'bg-white text-gray-700 border-2 border-gray-200'}`}
        >
          <Filter className="h-4 w-4" />
          Филтри {ageFilter !== 'all' && '(1)'}
        </button>

        {showFilters && (
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-4 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Възраст</label>
              <div className="flex flex-wrap gap-2">
                {[{ value: 'all', label: 'Всички' }, { value: '1-4', label: '1-4 год.' }, { value: '5-8', label: '5-8 год.' }, { value: '9-12', label: '9-12 год.' }, { value: '13-18', label: '13-18 год.' }].map((option) => (
                  <button key={option.value} onClick={() => setAgeFilter(option.value)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${ageFilter === option.value ? 'bg-sky-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Подреди по</label>
              <div className="flex flex-wrap gap-2">
                {[{ value: 'date', label: 'Дата' }, { value: 'name', label: 'Име' }, { value: 'age', label: 'Възраст' }].map((option) => (
                  <button key={option.value} onClick={() => setSortBy(option.value as any)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${sortBy === option.value ? 'bg-sky-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
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
              <div key={party._id} className="rounded-2xl bg-purple-100/80 text-purple-900 ring-1 ring-purple-200/50 shadow-md p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {BG.formatDate(partyDate)}
                      <span className="opacity-75">• {party.startTime || '--:--'}</span>
                      <span className="opacity-75">- {party.endTime || '--:--'}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {party.kidName}
                      <span className="text-sm font-semibold opacity-75 ml-2">({party.kidAge} {BG.yearsOld})</span>
                    </h3>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <MapPin className="h-4 w-4" />
                      Адрес: {party.locationName}
                    </div>
                    <div className="text-sm font-medium text-gray-600">🎊 Вид: {party.partyType || '-'}</div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                      <Baby className="h-4 w-4" />
                      Родител: {party.parentName || '-'}
                    </div>
                    <div className="text-sm font-medium text-gray-600">📞 Телефон: {party.phoneNumber || '-'}</div>
                    <div className="text-sm font-medium text-gray-600">
                      👶 Деца: {party.kidsCount || 0} • 👨 Родители: {party.parentsCount || 0}
                    </div>
                    <div className="text-sm font-medium text-gray-600">🍕 Кетъринг деца: {party.kidsCatering || '-'}</div>
                    <div className="text-sm font-medium text-gray-600">🍽️ Кетъринг родители: {party.parentsCatering || '-'}</div>
                    <div className={`text-sm font-semibold ${party.deposit && party.deposit > 0 ? 'text-green-700' : 'text-gray-600'}`}>
                      💰 Капаро: {party.deposit || 0}€
                    </div>
                    <div className={`text-sm font-medium ${party.notes ? 'text-gray-700 bg-white/50 p-2 rounded-lg' : 'text-gray-500'}`}>
                      📝 Бележки: {party.notes || '-'}
                    </div>
                  </div>

                  {/* Action Buttons — admin only */}
                  {isAdmin() && (
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
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-10 w-10 rounded-full flex items-center justify-center bg-white border-2 border-gray-200 hover:bg-sky-50 hover:border-sky-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - currentPage) <= 1)
            .reduce<(number | '...')[]>((acc, p, idx, arr) => {
              if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
              acc.push(p);
              return acc;
            }, [])
            .map((p, idx) =>
              p === '...' ? (
                <span key={`ellipsis-${idx}`} className="px-1 text-gray-400 font-semibold">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p as number)}
                  className={`h-10 w-10 rounded-full text-sm font-bold transition-all ${currentPage === p ? 'bg-sky-600 text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-sky-50 hover:border-sky-400'}`}
                >
                  {p}
                </button>
              )
            )}

          <button
            onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={currentPage === pagination.totalPages}
            className="h-10 w-10 rounded-full flex items-center justify-center bg-white border-2 border-gray-200 hover:bg-sky-50 hover:border-sky-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <span className="text-sm text-gray-500 font-medium ml-2">
            Страница {currentPage} от {pagination.totalPages}
          </span>
        </div>
      )}

      {/* Month Selector Modal */}
      {showMonthSelector && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowMonthSelector(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Избери месец</h3>
                <p className="text-sm text-gray-600">Изтрий всички партита от избрания месец</p>
              </div>
            </div>
            <input
              type="month"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium mb-4"
              onChange={(e) => { if (e.target.value) { setShowDeleteConfirm({ type: 'month', month: e.target.value }); setShowMonthSelector(false); } }}
            />
            <button onClick={() => setShowMonthSelector(false)} className="w-full px-4 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all">
              Отказ
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50" onClick={() => { setShowDeleteConfirm(null); setConfirmText(''); }}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">⚠️ ВНИМАНИЕ!</h3>
                <p className="text-sm font-semibold text-red-600">
                  {showDeleteConfirm.type === 'single' ? 'Ще бъде изтрито това парти' : 'Това действие НЕ може да бъде отменено!'}
                </p>
              </div>
            </div>
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-700">
                {showDeleteConfirm.type === 'month' && showDeleteConfirm.month && (<>Ще бъдат изтрити всички партита от <strong>{showDeleteConfirm.month}</strong>.<br />Моля, потвърдете.</>)}
                {showDeleteConfirm.type === 'single' && 'Това парти ще бъде изтрито от системата.'}
              </p>
            </div>
            {showDeleteConfirm.type === 'month' && (
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Напишете "<span className="text-red-600">ИЗТРИЙ</span>" за потвърждение:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all font-medium"
                  placeholder="ИЗТРИЙ"
                  autoFocus
                />
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => { setShowDeleteConfirm(null); setConfirmText(''); }} className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all">
                Отказ
              </button>
              <button
                onClick={() => {
                  if (showDeleteConfirm.type === 'single' && showDeleteConfirm.partyId) {
                    handleDeleteParty(showDeleteConfirm.partyId);
                  } else if (showDeleteConfirm.type === 'month' && showDeleteConfirm.month && confirmText === 'ИЗТРИЙ') {
                    handleDeleteByMonth(showDeleteConfirm.month);
                  } else if (showDeleteConfirm.type === 'month') {
                    toast.error('Моля напишете "ИЗТРИЙ" за потвърждение');
                  }
                }}
                disabled={showDeleteConfirm.type === 'month' && confirmText !== 'ИЗТРИЙ'}
                className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {showDeleteConfirm.type === 'single' ? 'Изтрий' : 'Изтрий завинаги'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingParty && (
        <PartyFormModal
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); setEditingParty(null); }}
          onSuccess={handleEditSuccess}
          date={new Date(editingParty.partyDate)}
          editingParty={editingParty}
        />
      )}
    </div>
  );
}
