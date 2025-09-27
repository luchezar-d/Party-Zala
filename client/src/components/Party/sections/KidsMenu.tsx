import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { PartyFormData } from '../../../validators/party';

interface KidsMenuSectionProps {
  register: UseFormRegister<PartyFormData>;
  errors: FieldErrors<PartyFormData>;
}

export function KidsMenuSection({ register, errors }: KidsMenuSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {/* Kids Count */}
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

      {/* Parent Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Име на родителя
        </label>
        <input
          {...register('parentName')}
          type="text"
          className="input-field"
          placeholder="Иван Иванов"
        />
        {errors.parentName && (
          <p className="mt-1 text-sm text-red-600">{errors.parentName.message}</p>
        )}
      </div>

      {/* Parent Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Имейл на родителя
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

      {/* Expected Guests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Очаквани гости
        </label>
        <input
          {...register('guestsCount', { valueAsNumber: true })}
          type="number"
          min="0"
          className="input-field"
          placeholder="15"
        />
        <p className="mt-1 text-sm text-gray-500">Общ брой гости (възрастни + деца)</p>
        {errors.guestsCount && (
          <p className="mt-1 text-sm text-red-600">{errors.guestsCount.message}</p>
        )}
      </div>

      {/* Kids Menu */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Детско меню
        </label>
        <textarea
          {...register('kidsMenu')}
          rows={3}
          className="input-field resize-none"
          placeholder="Хамбургери, картофки, сок, торта..."
        />
        <p className="mt-1 text-sm text-gray-500">Опишете какво ще се сервира на децата</p>
        {errors.kidsMenu && (
          <p className="mt-1 text-sm text-red-600">{errors.kidsMenu.message}</p>
        )}
      </div>
    </div>
  );
}
