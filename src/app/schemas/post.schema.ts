/** @format */
import Joi from '@hapi/joi';
import { EPostStatus } from '../enum/post.enum';

const CreatePostSchema = Joi.object({
	title: Joi.string().min(5).max(30).required(),
	content: Joi.string().min(10).required(),
});
const UpdatePostSchema = Joi.object({
	title: Joi.string().min(5).max(30),
	content: Joi.string().min(10),
});
const PostStatusRequiredSchema = Joi.string()
	.valid(...Object.values(EPostStatus))
	.required();
export { CreatePostSchema, UpdatePostSchema, PostStatusRequiredSchema };
