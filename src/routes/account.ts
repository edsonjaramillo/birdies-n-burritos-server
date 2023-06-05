import express from 'express';
import accountsController from '@/controllers/account';
import { getAccountValidator, createAccountValidator } from '@/validators/account';
import { validate } from '@/middleware';

const router = express.Router();

router.route('/get-account').post(validate(getAccountValidator), accountsController.getAccount);
router.route('/create-account').post(validate(createAccountValidator), accountsController.createAccount);

export default router;
