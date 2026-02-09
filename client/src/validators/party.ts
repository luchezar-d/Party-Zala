import { z } from 'zod';
import { BG } from '../lib/i18n';

export const partySchema = z.object({
  // Required fields
  partyDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, BG.invalidDateFormat),
  kidName: z.string().min(2, BG.kidNameMinLength).max(100, 'Името не може да е повече от 100 символа'),
  kidAge: z.number().min(1, BG.ageMinMax).max(18, BG.ageMinMax),
  locationName: z.string().min(1, BG.locationRequired).max(200, 'Местоположението не може да е повече от 200 символа'),
  
  // Time fields
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Часът трябва да е във формат HH:mm').optional().or(z.literal('')),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Часът трябва да е във формат HH:mm').optional().or(z.literal('')),
  
  // Optional existing fields
  address: z.string().max(300, 'Адресът не може да е повече от 300 символа').optional(),
  parentName: z.string().max(100, 'Името на родителя не може да е повече от 100 символа').optional(),
  parentEmail: z.string().email(BG.validEmail).optional().or(z.literal('')),
  guestsCount: z.number().min(0, BG.guestCountNegative).max(500, 'Броят гости не може да е повече от 500').optional(),
  notes: z.string().max(1000, 'Бележките не могат да са повече от 1000 символа').optional(),
  
  // New simplified fields
  kidsCount: z.number().int().min(0, 'Броят деца не може да е отрицателен').max(500, 'Броят деца не може да е повече от 500').optional(),
  parentsCount: z.number().int().min(0, 'Броят родители не може да е отрицателен').max(500, 'Броят родители не може да е повече от 500').optional(),
  kidsCatering: z.string().max(1000, 'Кетърингът за децата не може да е повече от 1000 символа').optional(),
  parentsCatering: z.string().max(1000, 'Кетърингът за родителите не може да с повече от 1000 символа').optional(),
  
  // New contact and payment fields
  phoneNumber: z.string().min(1, 'Телефонният номер е задължителен').max(20, 'Телефонният номер не може да е повече от 20 символа'),
  deposit: z.preprocess(
    (val) => {
      // Convert empty string, null, undefined, or NaN to 0
      if (val === '' || val === null || val === undefined) return 0;
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    },
    z.number().min(0, 'Капарото не може да е отрицателно').max(100000, 'Капарото не може да е повече от 100000')
  ).optional(),
  partyType: z.enum(['Външно парти', 'Пейнтбол', 'Детска зала', '']).optional()
});

export type PartyFormData = z.infer<typeof partySchema>;
