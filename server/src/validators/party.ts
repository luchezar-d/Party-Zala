import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const createPartySchema = z.object({
  partyDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Party date must be in YYYY-MM-DD format'),
  kidName: z.string().min(2, 'Kid name must be at least 2 characters').max(100),
  kidAge: z.number().int().min(1, 'Kid age must be at least 1').max(18, 'Kid age must be at most 18'),
  locationName: z.string().min(1, 'Location name is required').max(200),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:mm format').optional(),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:mm format').optional(),
  address: z.string().max(300).optional(),
  parentName: z.string().max(100).optional(),
  parentEmail: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  guestsCount: z.number().int().min(0, 'Guests count cannot be negative').max(500).optional(),
  notes: z.string().max(1000).optional()
});

export const listPartiesSchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'From date must be in YYYY-MM-DD format'),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'To date must be in YYYY-MM-DD format')
});

export function validateCreateParty(req: Request, res: Response, next: NextFunction) {
  try {
    req.body = createPartySchema.parse(req.body);
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
