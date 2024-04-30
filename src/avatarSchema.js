import Joi from "joi";





let schema = Joi.object(
    {

            "id" : Joi.any(),

        "characterName" : Joi.string()
            .required()
            .min(2)
            .max(20),

        "childAge" : Joi.number()
            .required()
            .min(4)
            .max(99),

        "skinColor" : Joi.string()
            .regex(/^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$/)
            .required(),

        "hairStyle" : Joi.string()
            .valid("short", "long")
            .default("short"),

        "headShape" : Joi.string()
            .valid("oval", "square")
            .default("oval"),

        "upperClothing" : Joi.string()
            .valid("shirt", "t-shirt", "dress")
            .default("shirt"),

        "lowerClothing":
            Joi.alternatives()
                .conditional('upperClothing', {
                    is: 'dress',
                    then: Joi.forbidden(),
                    otherwise: Joi
                        .string()
                        .valid('jeans', 'pants')
                        .default('pants')
                }),

            "createdAt" : Joi.any()
    })

export default schema