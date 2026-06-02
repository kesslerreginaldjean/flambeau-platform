/**
 * Joi-based request validation middleware (audit P1-2).
 *
 * Usage:
 *   router.post('/login', validate(schemas.login), handler);
 *
 * The schema is checked against req.body. If invalid, returns 400 with a
 * sanitised error message (we do NOT echo raw Joi details to the caller in prod).
 */

import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { env } from '../lib/env';

export const validate = (schema: Joi.ObjectSchema, where: 'body' | 'query' | 'params' = 'body') =>
  (req: Request, res: Response, next: NextFunction): void => {
    const { value, error } = schema.validate(req[where], { abortEarly: false, stripUnknown: true });
    if (error) {
      res.status(400).json({
        error: 'Requête invalide.',
        details: env.isProd ? undefined : error.details.map(d => d.message),
      });
      return;
    }
    (req as any)[where] = value;
    next();
  };

const email = Joi.string().email().max(254).lowercase();
const password = Joi.string().min(10).max(128);
const name = Joi.string().min(1).max(80).trim();
const uuid = Joi.string().uuid();

export const schemas = {
  login: Joi.object({
    email: email.required(),
    password: Joi.string().required(),     // do not enforce min on login
    // accept and ignore legacy "role" field for backward-compat with old frontend
    role: Joi.any().strip(),
  }),

  register: Joi.object({
    email: email.required(),
    password: password.required(),
    firstName: name.required(),
    lastName: name.required(),
    // any "role" field is dropped (P0-5)
    role: Joi.any().strip(),
  }),

  profile: Joi.object({
    firstName: name,
    lastName: name,
    phone: Joi.string().max(40).allow('', null),
    address: Joi.string().max(255).allow('', null),
    currentPassword: Joi.string().max(128),
    newPassword: password,
  }),

  payment: Joi.object({
    studentId: uuid.required(),
    amount: Joi.number().positive().max(10_000_000).required(),
    paymentType: Joi.string().max(64).required(),
    status: Joi.string().valid('pending', 'completed', 'partial').required(),
    dueDate: Joi.date().required(),
    notes: Joi.string().max(500).allow('', null),
    academicYearId: uuid,
  }),

  grade: Joi.object({
    studentId: uuid.required(),
    subject: Joi.string().min(1).max(80).required(),
    score: Joi.number().min(0).max(100).required(),
    teacherName: Joi.string().max(120).required(),
    term: Joi.number().integer().valid(1, 2, 3),
    academicYearId: uuid,
  }),

  attendance: Joi.object({
    date: Joi.date().required(),
    records: Joi.array().items(Joi.object({
      studentId: uuid.required(),
      status: Joi.string().valid('present', 'absent', 'late').required(),
      note: Joi.string().max(300).allow('', null),
    })).min(1).required(),
  }),

  admission: Joi.object({
    firstName: name.required(),
    lastName: name.required(),
    email: email.required(),
    phone: Joi.string().min(6).max(40).required(),
    level: Joi.string().max(60).required(),
    message: Joi.string().max(1500).allow('', null),
  }),

  message: Joi.object({
    receiverId: uuid.required(),
    content: Joi.string().min(1).max(5000).required(),
  }),
};
