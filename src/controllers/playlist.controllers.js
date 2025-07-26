import { db } from '../libs/db.js';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiResponse } from '../utils/api-response.js';
import { ApiError } from '../utils/api-error.js';

const getAllListDetails = asyncHandler(async (req, res) => {
    // TODO: Implement get all playlists logic
    
    const response = new ApiResponse(
        200,
        null,
        'Get all playlists successfully!'
    );

    return res.status(response.statusCode).json(response);
});

const getPlayListDetails = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    // TODO: Implement get playlist details logic
    
    const response = new ApiResponse(
        200,
        null,
        'Get playlist details successfully!'
    );

    return res.status(response.statusCode).json(response);
});

const createPlaylist = asyncHandler(async (req, res) => {
    // TODO: Implement create playlist logic
    
    const response = new ApiResponse(
        201,
        null,
        'Playlist created successfully!'
    );

    return res.status(response.statusCode).json(response);
});

const addProblemToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    // TODO: Implement add problem to playlist logic
    
    const response = new ApiResponse(
        200,
        null,
        'Problem added to playlist successfully!'
    );

    return res.status(response.statusCode).json(response);
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    // TODO: Implement delete playlist logic
    
    const response = new ApiResponse(
        200,
        null,
        'Playlist deleted successfully!'
    );

    return res.status(response.statusCode).json(response);
});

const removeProblemFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    // TODO: Implement remove problem from playlist logic
    
    const response = new ApiResponse(
        200,
        null,
        'Problem removed from playlist successfully!'
    );

    return res.status(response.statusCode).json(response);
});

export {
    getAllListDetails,
    getPlayListDetails,
    createPlaylist,
    addProblemToPlaylist,
    deletePlaylist,
    removeProblemFromPlaylist
};
