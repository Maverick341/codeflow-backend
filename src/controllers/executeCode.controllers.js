import { pollBatchResults, submitBatch } from "../libs/judge0.js";
import { asyncHandler } from "../utils/async-handler.js";


const executeCode = asyncHandler(async (req, res) => {
    const { source_code, language_id, stdin, expected_outputs, problemId } = req.body;

    const userId = req.user.id;

    // 1. Prepare each test cases for judge0 batch submission
    const submissions = stdin.map((input) => ({
        source_code,
        language_id,
        stdin: input,
    }));

    // 2. Send batch of submissions to judge0
    const submitResponse = await submitBatch(submissions);

    const tokens = submitResponse.map(res => res.token);

    // 3. Poll judge0 for results of all submitted test cases
    const results = await pollBatchResults(tokens);

    console.log("Result-------");
    console.log(results);
    
    res.status(200).json({
      message: "Code Executed! Successfully!",
    });
});

export { executeCode }