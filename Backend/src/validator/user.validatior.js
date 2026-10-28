import {body,validationResult} from "express-validator";

const RegisterValidationRules = () => {
    return [
    body('email')
        .exists().withMessage("Email is required").bail()
        .trim()
        .isEmail().withMessage("Enter valid email address"),

    body("username")
        .exists().withMessage("Username is required").bail()
        .isString().withMessage("Username must be a String")
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage("Username length must be between 2 to 50 characters"),

    body("password")
        .exists().withMessage("Password is Required").bail()
        .isString().withMessage("Password must be a String")
        .trim()
        .isLength({ min: 6 }).withMessage("Password must be minimum 6 character long"),
    (req, res, next) => {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Invalid Request",
                errors: errors.array()
            })
        }

        next()

    }
];
}

const LoginValidationRules = () => {
    return [
        body('email')
            .exists().withMessage("Email is required").bail()
            .trim()
            .isEmail().withMessage("Enter valid email address"),
        body("password")
            .exists().withMessage("Password is Required").bail()
            .isString().withMessage("Password must be a String")
            .trim()
            .isLength({ min: 6 }).withMessage("Password must be minimum 6 character long"),
        (req, res, next) => {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: "Invalid Request",
                    errors: errors.array()
                })
            }
            next();   
        }
    ];
}

export { RegisterValidationRules, LoginValidationRules };