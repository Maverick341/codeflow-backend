import { db } from '../libs/db.js';
import { getJudge0LanguageId, submitBatch } from '../libs/judge0.js';
import { asyncHandler } from '../utils/async-handler.js';
import { ErrorCodes } from '../utils/constants.js';
import { ApiResponse } from '../utils/api-response.js';

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

        const submissionResults = await submitBatch(submissions);

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

const getAllProblems = asyncHandler(async (req, res) => {});

const getProblemById = asyncHandler(async (req, res) => {});

const updateProblem = asyncHandler(async (req, res) => {});

const deleteProblem = asyncHandler(async (req, res) => {});

const getAllProblemsSolvedByUser = asyncHandler(async (req, res) => {});

export {
    createProblem,
    getAllProblems,
    getProblemById,
    updateProblem,
    deleteProblem,
    getAllProblemsSolvedByUser,
};
