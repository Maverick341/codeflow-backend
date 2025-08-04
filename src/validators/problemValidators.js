import { body } from 'express-validator';

const problemValidator = () => [
    body('title')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Title must be at least 3 characters'),
    
    body('description')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Description must be at least 10 characters'),
    
    body('difficulty')
        .isIn(['EASY', 'MEDIUM', 'HARD'])
        .withMessage('Difficulty must be EASY, MEDIUM, or HARD'),
    
    body('tags')
        .isArray({ min: 1 })
        .withMessage('At least one tag is required')
        .custom((tags) => {
            if (!tags.every(tag => typeof tag === 'string' && tag.trim().length > 0)) {
                throw new Error('All tags must be non-empty strings');
            }
            return true;
        }),
    
    body('constraints')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Constraints are required'),
    
    body('hints')
        .optional()
        .trim(),
    
    body('editorial')
        .optional()
        .trim(),
    
    body('testcases')
        .isArray({ min: 1 })
        .withMessage('At least one test case is required')
        .custom((testcases) => {
            if (!testcases.every(tc => 
                tc.input && typeof tc.input === 'string' && tc.input.trim().length > 0 &&
                tc.output && typeof tc.output === 'string' && tc.output.trim().length > 0
            )) {
                throw new Error('Each test case must have non-empty input and output');
            }
            return true;
        }),
    
    // Examples validation (all languages optional)
    body('examples')
        .optional()
        .isObject()
        .withMessage('Examples must be an object'),
    
    body('examples.JAVASCRIPT.input')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage('JavaScript example input cannot be empty'),
    
    body('examples.JAVASCRIPT.output')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage('JavaScript example output cannot be empty'),
    
    body('examples.JAVASCRIPT.explanation')
        .optional()
        .trim(),
    
    body('examples.PYTHON.input')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage('Python example input cannot be empty'),
    
    body('examples.PYTHON.output')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage('Python example output cannot be empty'),
    
    body('examples.PYTHON.explanation')
        .optional()
        .trim(),
    
    body('examples.JAVA.input')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage('Java example input cannot be empty'),
    
    body('examples.JAVA.output')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage('Java example output cannot be empty'),
    
    body('examples.JAVA.explanation')
        .optional()
        .trim(),
    
    // Code snippets validation
    body('codeSnippets.JAVASCRIPT')
        .trim()
        .isLength({ min: 1 })
        .withMessage('JavaScript code snippet is required'),
    
    body('codeSnippets.PYTHON')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Python code snippet is required'),
    
    body('codeSnippets.JAVA')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Java code snippet is required'),
    
    // Reference solutions validation
    body('referenceSolutions.JAVASCRIPT')
        .trim()
        .isLength({ min: 1 })
        .withMessage('JavaScript solution is required'),
    
    body('referenceSolutions.PYTHON')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Python solution is required'),
    
    body('referenceSolutions.JAVA')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Java solution is required'),
];

export {
    problemValidator,
}