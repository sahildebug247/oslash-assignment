/** @format */

import { ELogAction, ELogType } from '../enum/log.enum';
import Joi from '@hapi/joi';

const LogTypeFilterSchema = Joi.string().valid(...Object.values(ELogType));

const LogActionFilterSchema = Joi.string().valid(...Object.values(ELogAction));

export { LogActionFilterSchema, LogTypeFilterSchema };
