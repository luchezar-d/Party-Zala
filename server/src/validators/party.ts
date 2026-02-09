import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const createPartySchema = z.object({
  // Required fields
  partyDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Датата трябва да бъде във формат YYYY-MM-DD'),
  kidName: z.string().min(2, 'Името на детето трябва да е поне 2 символа').max(100, 'Името не може да е повече от 100 символа'),
  kidAge: z.number().int().min(1, 'Възрастта трябва да е поне 1 година').max(18, 'Възрастта не може да е повече от 18 години'),
  locationName: z.string().min(1, 'Местоположението е задължително').max(200, 'Местоположението не може да е повече от 200 символа'),
  
  // Time fields
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Часът трябва да е във формат HH:mm').optional(),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Часът трябва да е във формат HH:mm').optional(),
  
  // Optional existing fields
  address: z.string().max(300, 'Адресът не може да е повече от 300 символа').optional(),
  parentName: z.string().max(100, 'Името на родителя не може да е повече от 100 символа').optional(),
  parentEmail: z.string().email('Моля, въведете валиден имейл').optional().or(z.literal('')),
  guestsCount: z.number().int().min(0, 'Броят гости не може да е отрицателен').max(500, 'Броят гости не може да е повече от 500').optional(),
  notes: z.string().max(1000, 'Бележките не могат да са повече от 1000 символа').optional(),
  
  // New simplified fields
  kidsCount: z.number().int().min(0, 'Броят деца не може да е отрицателен').max(500, 'Броят деца не може да е повече от 500').optional(),
  parentsCount: z.number().int().min(0, 'Броят родители не може да е отрицателен').max(500, 'Броят родители не може да е повече от 500').optional(),
  kidsCatering: z.string().max(1000, 'Кетърингът за децата не може да е повече от 1000 символа').optional(),
  parentsCatering: z.string().max(1000, 'Кетърингът за родителите не може да е повече от 1000 символа').optional(),
  
  // Contact and payment fields
  phoneNumber: z.string().min(1, 'Телефонният номер е задължителен').max(50, 'Телефонният номер не може да е повече от 50 символа'),
  deposit: z.preprocess(
    (val) => {
      // Handle undefined, null, NaN, or empty string -> default to 0
      if (val === undefined || val === null || val === '') return 0;
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    },
    z.number().min(0, 'Капарото не може да е отрицателно')
  ),
  partyType: z.enum(['Външно парти', 'Пейнтбол', 'Детска зала', '']).optional()
});

export const listPartiesSchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'From date must be in YYYY-MM-DD format'),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'To date must be in YYYY-MM-DD format')
});

export const updatePartySchema = createPartySchema.partial().extend({
  kidName: z.string().min(2, 'Името на детето трябва да е поне 2 символа').max(100, 'Името не може да е повече от 100 символа').optional(),
  kidAge: z.number().int().min(1, 'Възрастта трябва да е поне 1 година').max(18, 'Възрастта не може да е повече от 18 години').optional(),
  locationName: z.string().min(1, 'Местоположението е задължително').max(200, 'Местоположението не може да е повече от 200 символа').optional()
});

export function validateCreateParty(req: Request, res: Response, next: NextFunction) {
  try {
    req.body = createPartySchema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
}

export function validateUpdateParty(req: Request, res: Response, next: NextFunction) {
  try {
    req.body = updatePartySchema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
}

export function validateListParties(req: Request, res: Response, next: NextFunction) {
  try {
    req.query = listPartiesSchema.parse(req.query);
    next();
  } catch (error) {
    next(error);
  }
}
