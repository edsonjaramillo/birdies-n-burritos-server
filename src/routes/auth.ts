import express from 'express';
import { zodValidate } from '@/middleware/zodValidate';
import { loginValidation } from '@/validators/auth';
import { login } from '@/controllers/auth';

const router = express.Router();

router.route('/login').post(zodValidate(loginValidation), login);

export default router;
