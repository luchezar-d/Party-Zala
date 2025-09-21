import { Router } from 'express';
import { listPartiesInRange, createParty, deleteParty } from '../controllers/partyController.js';
import { authenticate } from '../middleware/auth.js';
import { validateCreateParty, validateListParties } from '../validators/parties.js';

const router = Router();

// All party routes require authentication
router.use(authenticate);

router.get('/', validateListParties, listPartiesInRange);
router.post('/', validateCreateParty, createParty);
router.delete('/:id', deleteParty);

export default router;
