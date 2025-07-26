import { body } from 'express-validator';

const bodyFieldsValidator = () => {
    return [
        body('problemIds')
            .isArray()
            .withMessage('problemIds must be an array')
            .custom((value) => value.length > 0)
            .withMessage('stdin array must not be empty'),
    ];
};

export {
    bodyFieldsValidator
}