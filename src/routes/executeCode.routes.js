import { Router } from 'express';
import { isLoggedIn } from '../middlewares/auth.middlewares.js';
import { submitCode } from '../controllers/executeCode.controllers.js';
import { testCasesValidator } from '../validators/executeCodeValidators.js';

const router = Router();


router.route('/submit').post(isLoggedIn, testCasesValidator(), submitCode);


export default router;