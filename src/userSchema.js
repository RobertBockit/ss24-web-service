import Joi from "joi";

export default Joi.object({
    name: Joi.string()
        .max(20)
        .required(),
    username: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .required()
        .alphanum()
})