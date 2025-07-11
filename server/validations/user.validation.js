import Joi from 'joi';
import { objectId } from './common.js';

export const createUserSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('ADMIN', 'MANAGER', 'MEMBER').default('MEMBER'),
    // teamId: objectId.allow(null, '')
});

export const updateUserSchema = Joi.object({
    name: Joi.string().min(2),
    email: Joi.string().email(),
    role: Joi.string().valid('ADMIN', 'MANAGER', 'MEMBER'),
    teamId: objectId.allow(null, '')
});
