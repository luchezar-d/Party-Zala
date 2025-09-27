import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { PartyFormData } from '../../../validators/party';

interface CateringSectionProps {
  register: UseFormRegister<PartyFormData>;
  errors: FieldErrors<PartyFormData>;
}

export function CateringSection({ register, errors }: CateringSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      {/* Kids Catering */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Кетъринг за децата
        </label>
        <textarea
          {...register('kidsCatering')}
          rows={4}
          className="input-field resize-none"
          placeholder="• Хамбургери с пилешко
• Картофки фри
• Плодов сок
• Мини пици
• Сладки"
        />
        <p className="mt-1 text-sm text-gray-500">Детайлно описание на храната за децата</p>
        {errors.kidsCatering && (
          <p className="mt-1 text-sm text-red-600">{errors.kidsCatering.message}</p>
        )}
      </div>

      {/* Parents Catering */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Кетъринг за родителите
        </label>
        <textarea
          {...register('parentsCatering')}
          rows={4}
          className="input-field resize-none"
          placeholder="• Коктейлни хапки
• Салати
• Основни ястия
• Напитки
• Десерт"
        />
        <p className="mt-1 text-sm text-gray-500">Детайлно описание на храната за възрастните</p>
        {errors.parentsCatering && (
          <p className="mt-1 text-sm text-red-600">{errors.parentsCatering.message}</p>
        )}
      </div>
    </div>
  );
}
