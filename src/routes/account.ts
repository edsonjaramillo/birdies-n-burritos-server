import express from 'express';

import accountsController from '@/controllers/account';
import jwtVerify from '@/middleware/jwtVerify';
import { zodValidate } from '@/middleware/zodValidate';
import { getAccountValidator, createAccountValidator } from '@/validators/account';

const router = express.Router();

router.route('/get-account').post(jwtVerify, zodValidate(getAccountValidator), accountsController.getAccount);
router.route('/create-account').post(zodValidate(createAccountValidator), accountsController.createAccount);

export default router;
