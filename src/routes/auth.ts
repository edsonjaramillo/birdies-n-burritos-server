import express from 'express';

import { login } from '@/controllers/auth';
import { zodValidate } from '@/middleware/zodValidate';
import { loginValidation } from '@/validators/auth';

const router = express.Router();

router.route('/login').post(zodValidate(loginValidation), login);

export default router;
