import { db } from '../libs/db.js';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiResponse } from '../utils/api-response.js';
import { ApiError } from '../utils/api-error.js';
import { ErrorCodes } from '../utils/constants.js';

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    const userId = req.user.id;

    const playlist = await db.playlist.create({
        data: {
            name,
            description,
            userId,
        },
    });

    const response = new ApiResponse(
        201,
        playlist,
        'Playlist created successfully!'
    );

    return res.status(response.statusCode).json(response);
});

const getAllListDetails = asyncHandler(async (req, res) => {
    const playlists = await db.playlist.findMany({
        where: {
            userId: req.user.id,
        },
        include: {
            problems: {
                include: {
                    problem: true,
                },
            },
        },
    });

    const response = new ApiResponse(
        200,
        playlists,
        'Playlists fetched successfully!'
    );

    return res.status(response.statusCode).json(response);
});

const getPlayListDetails = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    const playlist = await db.playlist.findUnique({
        where: {
            id: playlistId,
            userId: req.user.id,
        },
        include: {
            problems: {
                include: {
                    problem: true,
                },
            },
        },
    });

    if (!playlist) {
        throw new ApiError(404, "Playlist not found", {
            code: ErrorCodes.PLAYLIST_NOT_FOUND,
        });
    }

    const response = new ApiResponse(
        200,
        playlist,
        'Playlist details fetched successfully!'
    );

    return res.status(response.statusCode).json(response);
});

const addProblemToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    const { problemIds } = req.body;

    const problemsInPlaylist = await db.problemsInPlaylist.createMany({
        data: problemIds.map((problemId) => ({
            playlistId,
            problemId
        }))
    })

    const response = new ApiResponse(
        201,
        problemsInPlaylist,
        'Problems added to playlist successfully!'
    );

    return res.status(response.statusCode).json(response);
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    const deletedPlaylist = await db.playlist.delete({
        where: {id: playlistId}
    });

    const response = new ApiResponse(
        200,
        deletedPlaylist,
        'Playlist deleted successfully!'
    );

    return res.status(response.statusCode).json(response);
});

const removeProblemFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    const { problemIds } = req.body;

    const deletedProblems = await db.problemsInPlaylist.deleteMany({
        where: {
            playlistId,
            problemId: {
                in: problemIds
            }
        }
    })

    const response = new ApiResponse(
        200,
        deletedProblems,
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
    removeProblemFromPlaylist,
};
