import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { PartyFormData } from '../../../validators/party';
import { formatDateForAPI } from '../../../lib/date';

interface ReservationSectionProps {
  register: UseFormRegister<PartyFormData>;
  errors: FieldErrors<PartyFormData>;
  date: Date;
}

export function ReservationSection({ register, errors, date }: ReservationSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {/* Kid Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Име на детето *
        </label>
        <input
          {...register('kidName')}
          type="text"
          className="input-field"
          placeholder="Въведете име на детето"
        />
        {errors.kidName && (
          <p className="mt-1 text-sm text-red-600">{errors.kidName.message}</p>
        )}
      </div>

      {/* Kid Age */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Възраст *
        </label>
        <input
          {...register('kidAge', { valueAsNumber: true })}
          type="number"
          min="1"
          max="18"
          className="input-field"
          placeholder="Възраст"
        />
        {errors.kidAge && (
          <p className="mt-1 text-sm text-red-600">{errors.kidAge.message}</p>
        )}
      </div>

      {/* Location Name */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Местоположение *
        </label>
        <input
          {...register('locationName')}
          type="text"
          className="input-field"
          placeholder="напр. HappyKids Center, градски парк"
        />
        {errors.locationName && (
          <p className="mt-1 text-sm text-red-600">{errors.locationName.message}</p>
        )}
      </div>

      {/* Address */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Адрес
        </label>
        <input
          {...register('address')}
          type="text"
          className="input-field"
          placeholder="Пълен адрес на мястото"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      {/* Date (read-only) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Дата
        </label>
        <input
          type="text"
          value={formatDateForAPI(date)}
          disabled
          className="input-field bg-gray-50 text-gray-500 cursor-not-allowed"
        />
      </div>

      {/* Start Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Начален час
        </label>
        <input
          {...register('startTime')}
          type="time"
          className="input-field"
        />
        {errors.startTime && (
          <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
        )}
      </div>

      {/* End Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Краен час
        </label>
        <input
          {...register('endTime')}
          type="time"
          className="input-field"
        />
        {errors.endTime && (
          <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>
        )}
      </div>

      <div></div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Телефон
        </label>
        <input
          {...register('phone')}
          type="tel"
          inputMode="tel"
          pattern="^[0-9+\s()-]{6,}$"
          className="input-field"
          placeholder="+359 888 123 456"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      {/* Deposit Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Капаро (сума)
        </label>
        <input
          {...register('depositAmount', { valueAsNumber: true })}
          type="number"
          min="0"
          step="0.01"
          className="input-field"
          placeholder="300"
        />
        {errors.depositAmount && (
          <p className="mt-1 text-sm text-red-600">{errors.depositAmount.message}</p>
        )}
      </div>

      {/* Deposit Currency */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Валута
        </label>
        <input
          {...register('depositCurrency')}
          type="text"
          className="input-field"
          placeholder="лв."
          defaultValue="лв."
        />
        {errors.depositCurrency && (
          <p className="mt-1 text-sm text-red-600">{errors.depositCurrency.message}</p>
        )}
      </div>

      {/* Deposit Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Капаро №
        </label>
        <input
          {...register('depositNumber')}
          type="text"
          className="input-field"
          placeholder="93"
        />
        <p className="mt-1 text-sm text-gray-500">Номер на капарото за проследяване</p>
        {errors.depositNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.depositNumber.message}</p>
        )}
      </div>

      {/* Deposit Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Дата на капарото
        </label>
        <input
          {...register('depositDate')}
          type="date"
          className="input-field"
        />
        {errors.depositDate && (
          <p className="mt-1 text-sm text-red-600">{errors.depositDate.message}</p>
        )}
      </div>

      {/* Deposit Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Статус на капарото
        </label>
        <select
          {...register('depositStatus')}
          className="input-field"
        >
          <option value="">Избери статус</option>
          <option value="Оставено">Оставено</option>
          <option value="Няма">Няма</option>
          <option value="Върнато">Върнато</option>
        </select>
        {errors.depositStatus && (
          <p className="mt-1 text-sm text-red-600">{errors.depositStatus.message}</p>
        )}
      </div>

      <div></div>

      {/* Comment */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Коментар
        </label>
        <textarea
          {...register('comment')}
          rows={2}
          className="input-field resize-none"
          placeholder="Коментар за резервацията..."
        />
        {errors.comment && (
          <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
        )}
      </div>
    </div>
  );
}
