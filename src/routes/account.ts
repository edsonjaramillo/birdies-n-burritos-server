import express from 'express';
import accountsController from '@/controllers/account';
import { getAccountValidator, createAccountValidator } from '@/validators/account';
import { zodValidate } from '@/middleware/zodValidate';
import jwtVerify from '@/middleware/jwtVerify';

const router = express.Router();

router.route('/get-account').post(jwtVerify(), zodValidate(getAccountValidator), accountsController.getAccount);
router.route('/create-account').post(zodValidate(createAccountValidator), accountsController.createAccount);

export default router;
