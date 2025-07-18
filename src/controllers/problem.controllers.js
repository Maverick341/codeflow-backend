import { db } from '../libs/db.js';
import {
    getJudge0LanguageId,
    pollBatchResults,
    submitBatch,
} from '../libs/judge0.js';
import { asyncHandler } from '../utils/async-handler.js';
import { ErrorCodes } from '../utils/constants.js';
import { ApiResponse } from '../utils/api-response.js';
import { ApiError } from '../utils/api-error.js';

const createProblem = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
    } = req.body;

    if (!req.user || req.user.role !== 'ADMIN') {
        throw new ApiError(403, 'Admin access only', {
            code: ErrorCodes.UNAUTHORIZED_ACCESS,
        });
    }

    if (!Array.isArray(testcases) || testcases.length === 0) {
        throw new ApiError(400, 'Testcases are missing or empty', {
            code: ErrorCodes.PROBLEM_INVALID_TESTCASES,
        });
    }

    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
        const languageId = getJudge0LanguageId(language);

        if (!languageId) {
            throw new ApiError(400, `Language ${language} is not supported`, {
                code: ErrorCodes.PROBLEM_UNSUPPORTED_LANGUAGE,
            });
        }

        const submissions = testcases.map(({ input, output }) => ({
            source_code: solutionCode,
            language_id: languageId,
            stdin: input,
            expected_output: output,
        }));

        if (!submissions.length) {
            throw new ApiError(
                400,
                `No valid testcases found for ${language}`,
                {
                    code: ErrorCodes.PROBLEM_SUBMISSION_ERROR,
                }
            );
        }

        console.log(`Language: ${language}, languageId: ${languageId}`);
        console.log('Submissions:', submissions);

        const submissionResults = await submitBatch(submissions);

        console.log(submissionResults);

        if (!submissionResults || !Array.isArray(submissionResults)) {
            throw new ApiError(
                500,
                `Failed to submit testcases for ${language}`,
                {
                    code: ErrorCodes.JUDGE0_SUBMISSION_FAILED,
                }
            );
        }

        const token = submissionResults.map((res) => res.token);

        const results = await pollBatchResults(token);

        for (let i = 0; i < results.length; i++) {
            const result = results[i];

            if (result.status.id !== 3) {
                throw new ApiError(
                    400,
                    `Testcase ${i + 1} failed for language ${language}`,
                    {
                        code: ErrorCodes.PROBLEM_UNSUPPORTED_LANGUAGE,
                    }
                );
            }
        }
    }

    const newProblem = await db.problem.create({
        data: {
            title,
            description,
            difficulty,
            tags,
            examples,
            constraints,
            testcases,
            codeSnippets,
            referenceSolutions,
            userId: req.user.id,
        },
    });

    const response = new ApiResponse(
        201,
        newProblem,
        'Problem created and validated successfully across all reference solutions'
    );

    return res.status(response.statusCode).json(response);
});

const getAllProblems = asyncHandler(async (req, res) => {
    const problems = await db.problem.findMany();

    if (!problems) {
        throw new ApiError(404, 'Problems not found', {
            code: ErrorCodes.PROBLEM_NOT_FOUND,
        });
    }

    const response = new ApiResponse(
        200,
        problems,
        'Problems fetched successfully'
    );

    return res.status(response.statusCode).json(response);
});

const getProblemById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const problem = await db.problem.findUnique({
        where: { id },
    });

    if (!problem) {
        throw new ApiError(404, 'Problems not found', {
            code: ErrorCodes.PROBLEM_NOT_FOUND,
        });
    }

    const response = new ApiResponse(
        200,
        problem,
        'Problem fetched successfully'
    );

    return res.status(response.statusCode).json(response);
});

const updateProblem = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
    } = req.body;

    if (!req.user || req.user.role !== 'ADMIN') {
        throw new ApiError(403, 'Admin access only', {
            code: ErrorCodes.UNAUTHORIZED_ACCESS,
        });
    }

    if (!Array.isArray(testcases) || testcases.length === 0) {
        throw new ApiError(400, 'Testcases are missing or empty', {
            code: ErrorCodes.PROBLEM_INVALID_TESTCASES,
        });
    }

    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
        const languageId = getJudge0LanguageId(language);

        if (!languageId) {
            throw new ApiError(400, `Language ${language} is not supported`, {
                code: ErrorCodes.PROBLEM_UNSUPPORTED_LANGUAGE,
            });
        }

        const submissions = testcases.map(({ input, output }) => ({
            source_code: solutionCode,
            language_id: languageId,
            stdin: input,
            expected_output: output,
        }));

        if (!submissions.length) {
            throw new ApiError(
                400,
                `No valid testcases found for ${language}`,
                {
                    code: ErrorCodes.PROBLEM_SUBMISSION_ERROR,
                }
            );
        }

        console.log(`Language: ${language}, languageId: ${languageId}`);
        console.log('Submissions:', submissions);

        const submissionResults = await submitBatch(submissions);

        console.log(submissionResults);

        if (!submissionResults || !Array.isArray(submissionResults)) {
            throw new ApiError(
                500,
                `Failed to submit testcases for ${language}`,
                {
                    code: ErrorCodes.JUDGE0_SUBMISSION_FAILED,
                }
            );
        }

        const token = submissionResults.map((res) => res.token);

        const results = await pollBatchResults(token);

        for (let i = 0; i < results.length; i++) {
            const result = results[i];

            if (result.status.id !== 3) {
                throw new ApiError(
                    400,
                    `Testcase ${i + 1} failed for language ${language}`,
                    {
                        code: ErrorCodes.PROBLEM_UNSUPPORTED_LANGUAGE,
                    }
                );
            }
        }
    }

    const updatedProblem = await db.problem.update({
        where: { id },
        data: {
            title,
            description,
            difficulty,
            tags,
            examples,
            constraints,
            testcases,
            codeSnippets,
            referenceSolutions,
        },
    });

    const response = new ApiResponse(
        201,
        updatedProblem,
        'Problem Updated and validated successfully across all reference solutions'
    );

    return res.status(response.statusCode).json(response);
});

const deleteProblem = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const problem = await db.problem.findUnique({ where: { id } });

    if (!problem) {
        throw new ApiError(404, 'Problems not found', {
            code: ErrorCodes.PROBLEM_NOT_FOUND,
        });
    }

    await db.problem.delete({where: {id}});

    const response = new ApiResponse(
        201,
        null,
        'Problem Deleted Successfully'
    );

    res.status(response.statusCode).json(response);
});

const getAllProblemsSolvedByUser = asyncHandler(async (req, res) => {});

export {
    createProblem,
    getAllProblems,
    getProblemById,
    updateProblem,
    deleteProblem,
    getAllProblemsSolvedByUser,
};
