const Joi = require('joi');
const { number } = require('joi');

const reviewJoiSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})


module.exports = reviewJoiSchema;