const testCasesValidator = () => {
    return [
        body('testcases')
            .isArray()
            .withMessage('testcases must be an array')
            .bail()
            .custom((arr) => arr.length > 0)
            .withMessage('testcases must not be empty'),
    ];
};

export {
    testCasesValidator,
}