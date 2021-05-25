/** @format */

import Joi from '@hapi/joi';
import EClientStatus from '../enum/client.enum';

const CreateClientSchema = Joi.object({
	name: Joi.string().min(5).max(30).required(),

	email: Joi.string().email({ minDomainSegments: 2 }).required(),
});
const ContactRaiseFundEmailSchema = Joi.object({
	firstName: Joi.string().min(3).max(30).required(),
	lastName: Joi.string().min(3).max(30),
	phone: Joi.string().min(3).max(30).required(),
	description: Joi.string().min(10).max(500).required(),
	email: Joi.string().email({ minDomainSegments: 2 }).required(),
});

const UpdateClientSchema = Joi.object({
	name: Joi.string().min(5).max(30),

	email: Joi.string().email({ minDomainSegments: 2 }),
});

const ClientFilterByStatusSchema = Joi.string().valid(...Object.values(EClientStatus));

export { CreateClientSchema, ClientFilterByStatusSchema, UpdateClientSchema, ContactRaiseFundEmailSchema };
