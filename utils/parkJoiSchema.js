 const Joi = require('joi');
 
 //Joi schema, not database schema.
 const parkJoiSchema = Joi.object({
    park: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string()
    }).required(),
    deleteImages: Joi.array(),
    price: Joi.number().min(0)
}) 

module.exports = parkJoiSchema;