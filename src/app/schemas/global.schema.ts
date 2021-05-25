/** @format */

import Joi from '@hapi/joi';

const PageNumberSchema = Joi.number().min(1);
const NumberRequiredSchema = Joi.number().required();
const OptionalNumberSchema = Joi.number();
const OptionalBooleanSchema = Joi.boolean();
const FilterByNameSchema = Joi.string();
const StringRequiredSchema = Joi.string().required();
const FilterByEmailSchema = Joi.string();
const EntityIdSchema = Joi.string().uuid().required();
const EntityIdFilterSchema = Joi.string().uuid();
const StringLikeFilterSchema = Joi.string();
const UrlSchema = Joi.string().uri().required();

export {
	PageNumberSchema,
	FilterByNameSchema,
	OptionalBooleanSchema,
	NumberRequiredSchema,
	EntityIdSchema,
	UrlSchema,
	FilterByEmailSchema,
	StringRequiredSchema,
	EntityIdFilterSchema,
	StringLikeFilterSchema,
	OptionalNumberSchema,
};
