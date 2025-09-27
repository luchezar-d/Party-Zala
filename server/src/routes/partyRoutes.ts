import { Router } from 'express';
import { listPartiesInRange, createParty, updateParty, deleteParty } from '../controllers/partyController.js';
import { authenticate } from '../middleware/auth.js';
import { validateCreateParty, validateUpdateParty, validateListParties } from '../validators/party.js';

const router = Router();

// All party routes require authentication
router.use(authenticate);

router.get('/', validateListParties, listPartiesInRange);
router.post('/', validateCreateParty, createParty);
router.put('/:id', validateUpdateParty, updateParty);
router.delete('/:id', deleteParty);

export default router;
