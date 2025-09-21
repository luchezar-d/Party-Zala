import { Router } from 'express';
import { login, logout, me } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateLogin } from '../validators/auth.js';

const router = Router();

router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.get('/me', authenticate, me);

export default router;
