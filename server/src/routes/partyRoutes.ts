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
import { authenticate } from '../middleware/auth.js';
import { validateCreateParty, validateUpdateParty, validateListParties } from '../validators/party.js';

const router = Router();

// All party routes require authentication
router.use(authenticate);

// GET routes
router.get('/', validateListParties, listPartiesInRange); // With date range
router.get('/all', listAllParties); // All parties, no date restriction

// POST routes
router.post('/', validateCreateParty, createParty);

// PUT routes
router.put('/:id', validateUpdateParty, updateParty);

// DELETE routes
router.delete('/all', deleteAllParties); // Delete all parties
router.delete('/range', deletePartiesInRange); // Delete parties in date range
router.delete('/:id', deleteParty); // Delete single party

export default router;
