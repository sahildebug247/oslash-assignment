/** @format */

import Joi from '@hapi/joi';
import MomentTZ from 'moment-timezone';
import { EUserRole } from '../enum/user.enum';

const validTimezones = MomentTZ.tz.names();
const UserRegisterSchema = Joi.object({
	name: Joi.string()
		.min(4)
		.max(20)
		.regex(/^[a-zA-Z ]*$/)
		.required(),

	password: Joi.string()
		.regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/)
		.required(),

	username: Joi.string().min(5).max(20).required(),

	timezone: Joi.string()
		.valid(...Object.values(validTimezones))
		.required(),

	role: Joi.string()
		.valid(...Object.values(EUserRole))
		.required(),
});

const SelfUpdateSchema = Joi.object({
	name: Joi.string()
		.min(4)
		.max(20)
		.regex(/^[a-zA-Z ]*$/),

	timezone: Joi.string().valid(...Object.values(validTimezones)),
});

const UpdatePasswordSchema = Joi.object({
	currentPassword: Joi.string().required(),
	newPassword: Joi.string()
		.regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/)
		.required(),
});

const UserLoginSchema = Joi.object({
	username: Joi.string().required(),
	password: Joi.string().required(),
});

export { UserLoginSchema, UserRegisterSchema, SelfUpdateSchema, UpdatePasswordSchema };
