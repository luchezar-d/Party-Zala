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

// All party routes require authentication
router.use(authenticate);

// GET routes — all authenticated users can read
router.get('/', validateListParties, listPartiesInRange);
router.get('/all', listAllParties);

// Write routes — admin only
router.post('/', requireAdmin, validateCreateParty, createParty);
router.put('/:id', requireAdmin, validateUpdateParty, updateParty);
router.delete('/all', requireAdmin, deleteAllParties);
router.delete('/range', requireAdmin, deletePartiesInRange);
router.delete('/:id', requireAdmin, deleteParty);

export default router;
