import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const createPartySchema = z.object({
  partyDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Party date must be in YYYY-MM-DD format'),
  kidName: z.string().min(2, 'Kid name must be at least 2 characters').max(100, 'Kid name too long'),
  kidAge: z.number().int().min(1, 'Age must be at least 1').max(18, 'Age must be at most 18'),
  locationName: z.string().min(1, 'Location name is required').max(200, 'Location name too long'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:mm format').optional(),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:mm format').optional(),
  address: z.string().max(300, 'Address too long').optional(),
  parentName: z.string().max(100, 'Parent name too long').optional(),
  parentEmail: z.string().email('Invalid email format').optional(),
  guestsCount: z.number().int().min(0, 'Guest count cannot be negative').max(500, 'Guest count too high').optional(),
  notes: z.string().max(1000, 'Notes too long').optional(),
});

export const listPartiesSchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'From date must be in YYYY-MM-DD format'),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'To date must be in YYYY-MM-DD format'),
});

export function validateCreateParty(req: Request, res: Response, next: NextFunction) {
  try {
    createPartySchema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
}

export function validateListParties(req: Request, res: Response, next: NextFunction) {
  try {
    listPartiesSchema.parse(req.query);
    next();
  } catch (error) {
    next(error);
  }
}
