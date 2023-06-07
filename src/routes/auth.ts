import express from 'express';

import authController from '@/controllers/auth';
import { zodValidate } from '@/middleware/zodValidate';
import { loginValidation } from '@/validators/auth';

const router = express.Router();

router.route('/login').post(zodValidate(loginValidation), authController.login);
router.route('/logout').get(authController.logout);

export default router;
