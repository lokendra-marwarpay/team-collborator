import Joi from 'joi';
import { objectId } from './common.js';

export const createProjectSchema = Joi.object({
    name: Joi.string().min(2).required(),
    description: Joi.string().allow('', null),
    teamId: objectId.required()
});

export const updateProjectSchema = Joi.object({
    name: Joi.string().min(2),
    description: Joi.string().allow('', null),
    teamId: objectId
});
