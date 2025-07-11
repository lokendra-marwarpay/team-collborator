import Joi from 'joi';
import { objectId } from './common.js';

export const createTaskSchema = Joi.object({
    title: Joi.string().min(2).required(),
    description: Joi.string().allow('', null),
    status: Joi.string().valid('todo', 'in-progress', 'done').optional(),
    projectId: objectId.required(),
    assignedTo: objectId.optional()
});

export const updateTaskSchema = Joi.object({
    title: Joi.string().min(2).optional(),
    description: Joi.string().allow('', null),
    status: Joi.string().valid('todo', 'in-progress', 'done'),
    assignedTo: objectId.optional()
});
