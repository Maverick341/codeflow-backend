import { db } from '../libs/db.js';
import {
    getLanguageName,
    pollBatchResults,
    submitBatch,
} from '../libs/judge0.js';
import { asyncHandler } from '../utils/async-handler.js';
import { Status } from '../generated/prisma/index.js';
import { ApiResponse } from '../utils/api-response.js';
import { ApiError } from '../utils/api-error.js';

const submitCode = asyncHandler(async (req, res) => {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
        req.body;

    const userId = req.user.id;

    // Validate that the problem exists
    const problem = await db.problem.findUnique({
        where: { id: problemId },
    });

    if (!problem) {
        throw new ApiError(404, `Problem with ID ${problemId} not found`, {
            code: ErrorCodes.PROBLEM_NOT_FOUND,
        });
    }

    // 1. Prepare each test cases for judge0 batch submission
    const submissions = stdin.map((input) => ({
        source_code,
        language_id,
        stdin: input,
    }));

    // 2. Send batch of submissions to judge0
    const submitResponse = await submitBatch(submissions);

    const tokens = submitResponse.map((res) => res.token);

    // 3. Poll judge0 for results of all submitted test cases
    const results = await pollBatchResults(tokens);

    console.log('Result-------');
    console.log(results);

    // 4. Analyze test case results
    let allPassed = true;

    const detailedResults = results.map((result, i) => {
        const stdout = result.stdout?.trim();
        const expected_output = expected_outputs[i]?.trim();

        const passed = stdout === expected_output;

        if (!passed) allPassed = false;

        return {
            testCase: i + 1,
            passed,
            stdout,
            expected: expected_output,
            stderr: result.stderr || null,
            compile_output: result.compile_output,
            status: result.status.description,
            memory: result.memory ? `${result.memory} KB` : undefined,
            time: result.time ? `${result.time} s` : undefined,
        };
    });

    // 5. store submission summary
    const submission = await db.submission.create({
        data: {
            userId,
            problemId,
            sourceCode: source_code,
            language: getLanguageName(language_id),
            stdin: stdin.join('\n'),
            stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
            stderr: detailedResults.some((r) => r.stderr)
                ? JSON.stringify(detailedResults.map((r) => r.stderr))
                : null,
            compileOutput: detailedResults.some((r) => r.compile_output)
                ? JSON.stringify(detailedResults.map((r) => r.compile_output))
                : null,
            status: allPassed ? Status.ACCEPTED : Status.WRONG_ANSWER,
            memory: detailedResults.some((r) => r.memory)
                ? JSON.stringify(detailedResults.map((r) => r.memory))
                : null,
            time: detailedResults.some((r) => r.time)
                ? JSON.stringify(detailedResults.map((r) => r.time))
                : null,
        },
    });

    // 6. If All passed = true mark problem as solved for the current user
    if (allPassed) {
        await db.problemSolved.upsert({
            where: {
                userId_problemId: {
                    userId,
                    problemId,
                },
            },
            update: {},
            create: {
                userId,
                problemId,
            },
        });
    }

    // 7. Save individual test case results using detailedResult

    const testCaseResults = detailedResults.map((result) => ({
        submissionId: submission.id,
        testCase: result.testCase,
        passed: result.passed,
        stdout: result.stdout,
        expected: result.expected,
        stderr: result.stderr,
        compileOutput: result.compile_output,
        status: result.status,
        memory: result.memory,
        time: result.time,
    }));

    await db.testCaseResult.createMany({
        data: testCaseResults,
    });

    const submissionWithTestCase = await db.submission.findUnique({
        where: {
            id: submission.id,
        },
        include: {
            testCases: true,
        },
    });

    const response = new ApiResponse(
        200,
        submissionWithTestCase,
        'Code Executed! Successfully!'
    );

    return res.status(response.statusCode).json(response);
});

const runCode = asyncHandler(async (req, res) => {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
        req.body;

    // Validate that the problem exists
    const problem = await db.problem.findUnique({
        where: { id: problemId },
    });

    if (!problem) {
        throw new ApiError(404, `Problem with ID ${problemId} not found`, {
            code: ErrorCodes.PROBLEM_NOT_FOUND,
        });
    }

    // 1. Prepare each test cases for judge0 batch submission
    const submissions = stdin.map((input) => ({
        source_code,
        language_id,
        stdin: input,
    }));

    // 2. Send batch of submissions to judge0
    const submitResponse = await submitBatch(submissions);

    const tokens = submitResponse.map((res) => res.token);

    // 3. Poll judge0 for results of all submitted test cases
    const results = await pollBatchResults(tokens);

    console.log('Run Code Result-------');
    console.log(results);

    // 4. Analyze test case results
    let allPassed = true;

    const detailedResults = results.map((result, i) => {
        const stdout = result.stdout?.trim();
        const expected_output = expected_outputs[i]?.trim();

        const passed = stdout === expected_output;

        if (!passed) allPassed = false;

        return {
            testCase: i + 1,
            passed,
            stdout,
            expected: expected_output,
            stderr: result.stderr || null,
            compile_output: result.compile_output,
            status: result.status.description,
            memory: result.memory ? `${result.memory} KB` : undefined,
            time: result.time ? `${result.time} s` : undefined,
        };
    });

    // Return results directly without any database storage
    const response = new ApiResponse(
        200,
        {
            allPassed,
            testResults: detailedResults,
            totalTestCases: detailedResults.length,
            passedTestCases: detailedResults.filter((r) => r.passed).length,
        },
        'Code executed successfully!'
    );

    return res.status(response.statusCode).json(response);
});

export { submitCode, runCode };
