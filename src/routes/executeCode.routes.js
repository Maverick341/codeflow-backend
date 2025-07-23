import { Router } from 'express';
import { isLoggedIn } from '../middlewares/auth.middlewares.js';
import { executeCode } from '../controllers/executeCode.controllers.js';
import { testCasesValidator } from '../validators/executeCodeValidators.js';

const router = Router();


router.route('/').post(isLoggedIn, testCasesValidator(), executeCode);


export default router;