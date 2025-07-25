import { Router } from 'express';
import { isLoggedIn } from '../middlewares/auth.middlewares.js';
import { getAllSubmissions, getAllSubmissionsForProblem, getSubmissionsForProblem } from '../controllers/submission.controllers.js';

const router = Router();

router.route('/getAllSubmissions').get(isLoggedIn, getAllSubmissions);
router.route('/getSubmission/:problemId').get(isLoggedIn, getSubmissionsForProblem);
router.route('/getSubmissionsCount/:problemId').get(isLoggedIn, getAllSubmissionsForProblem);


router.route('/').post();

export default router;