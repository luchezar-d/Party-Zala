import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { PartyFormData } from '../../../validators/party';

interface CakeSectionProps {
  register: UseFormRegister<PartyFormData>;
  errors: FieldErrors<PartyFormData>;
}

export function CakeSection({ register, errors }: CakeSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {/* Cake Bakery */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Сладкарница
        </label>
        <input
          {...register('cakeBakery')}
          type="text"
          className="input-field"
          placeholder="Име на сладкарницата"
        />
        {errors.cakeBakery && (
          <p className="mt-1 text-sm text-red-600">{errors.cakeBakery.message}</p>
        )}
      </div>

      {/* Cake Pieces */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Брой парчета
        </label>
        <input
          {...register('cakePieces', { valueAsNumber: true })}
          type="number"
          min="0"
          className="input-field"
          placeholder="12"
        />
        {errors.cakePieces && (
          <p className="mt-1 text-sm text-red-600">{errors.cakePieces.message}</p>
        )}
      </div>

      {/* Cake Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Код на тортата
        </label>
        <input
          {...register('cakeCode')}
          type="text"
          className="input-field"
          placeholder="TRT001"
        />
        <p className="mt-1 text-sm text-gray-500">Код от каталога на сладкарницата</p>
        {errors.cakeCode && (
          <p className="mt-1 text-sm text-red-600">{errors.cakeCode.message}</p>
        )}
      </div>

      {/* Cake Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Вид на тортата
        </label>
        <input
          {...register('cakeType')}
          type="text"
          className="input-field"
          placeholder="Шоколадова, ванилова, плодова"
        />
        {errors.cakeType && (
          <p className="mt-1 text-sm text-red-600">{errors.cakeType.message}</p>
        )}
      </div>

      {/* Cake Filling */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Пълнеж
        </label>
        <input
          {...register('cakeFilling')}
          type="text"
          className="input-field"
          placeholder="Крем, ягоди, шоколад"
        />
        {errors.cakeFilling && (
          <p className="mt-1 text-sm text-red-600">{errors.cakeFilling.message}</p>
        )}
      </div>

      {/* Cake Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Цена
        </label>
        <input
          {...register('cakePrice', { valueAsNumber: true })}
          type="number"
          min="0"
          step="0.01"
          className="input-field"
          placeholder="50.00"
        />
        {errors.cakePrice && (
          <p className="mt-1 text-sm text-red-600">{errors.cakePrice.message}</p>
        )}
      </div>

      {/* Cake Inscription */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ЧРД надпис
        </label>
        <input
          {...register('cakeInscription')}
          type="text"
          className="input-field"
          placeholder="Честит рожден ден, Георги!"
        />
        <p className="mt-1 text-sm text-gray-500">Надпис за тортата</p>
        {errors.cakeInscription && (
          <p className="mt-1 text-sm text-red-600">{errors.cakeInscription.message}</p>
        )}
      </div>

      {/* Cake Ordered */}
      <div className="md:col-span-2">
        <div className="flex items-center space-x-3">
          <input
            {...register('cakeOrdered')}
            type="checkbox"
            id="cakeOrdered"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="cakeOrdered" className="text-sm font-medium text-gray-700">
            Поръчана торта
          </label>
        </div>
        <p className="mt-1 text-sm text-gray-500">Отметете ако тортата е вече поръчана</p>
        {errors.cakeOrdered && (
          <p className="mt-1 text-sm text-red-600">{errors.cakeOrdered.message}</p>
        )}
      </div>
    </div>
  );
}
