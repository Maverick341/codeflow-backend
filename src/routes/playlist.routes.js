import { Router } from 'express';
import { isLoggedIn } from '../middlewares/auth.middlewares.js';
import {
    getAllListDetails,
    getPlayListDetails,
    createPlaylist,
    addProblemToPlaylist,
    deletePlaylist,
    removeProblemFromPlaylist
} from '../controllers/playlist.controllers.js';

const router = Router();

router.route('/').get(isLoggedIn, getAllListDetails);
router.route('/:playlistId').get(isLoggedIn, getPlayListDetails);
router.route('/createPlaylist').post(isLoggedIn, createPlaylist);
router.route('/:playlistId/addProblem').post(isLoggedIn, addProblemToPlaylist);
router.route('/:playlistId').delete(isLoggedIn, deletePlaylist);
router.route('/:playlistId/removeProblem').delete(isLoggedIn, removeProblemFromPlaylist);

export default router;