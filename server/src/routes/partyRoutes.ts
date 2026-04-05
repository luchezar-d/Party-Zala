import { Router } from 'express';
import { 
  listPartiesInRange, 
  listAllParties,
  createParty, 
  updateParty, 
  deleteParty,
  deleteAllParties,
  deletePartiesInRange
} from '../controllers/partyController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validateCreateParty, validateUpdateParty, validateListParties } from '../validators/party.js';

const router = Router();

// GET routes — public (app is already protected by login page)
router.get('/', validateListParties, listPartiesInRange);
router.get('/all', listAllParties);

// Write routes — require login + admin role
router.post('/', authenticate, requireAdmin, validateCreateParty, createParty);
router.put('/:id', authenticate, requireAdmin, validateUpdateParty, updateParty);
router.delete('/all', authenticate, requireAdmin, deleteAllParties);
router.delete('/range', authenticate, requireAdmin, deletePartiesInRange);
router.delete('/:id', authenticate, requireAdmin, deleteParty);

export default router;
