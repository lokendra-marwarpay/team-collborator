import Joi from 'joi';
import { objectId } from './common.js';

export const createTeamSchema = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().allow('', null),
  adminId: objectId.required(),
  memberIds: Joi.array().items(objectId).optional(),
});

export const updateTeamSchema = Joi.object({
  name: Joi.string().min(2),
  description: Joi.string().allow('', null),
  adminId: objectId.optional(),
  memberIds: Joi.array().items(objectId).optional(),
});
