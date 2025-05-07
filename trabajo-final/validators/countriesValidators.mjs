import { body } from 'express-validator';

export const validateCountry = [
  body('name')
  .notEmpty()
  .withMessage('El nombre es obligatorio.')
  .isLength({ min: 3, max: 90 })
  .withMessage('El nombre debe tener entre 3 y 90 caracteres.'),
  body('capital')
  .notEmpty()
  .withMessage('La capital es obligatoria.')
  .customSanitizer ((value) => {
    return typeof value === 'string' ? value.split(',').map((c) => c.trim()) : value;})
  .isArray({ min: 1 })
  .withMessage('La capital debe ser un arreglo con al menos un elemento.')
  .bail()
  .custom((capitals) => {
    return capitals.every((capital) => capital.length >=3 && capital.length <= 90);})
  .withMessage('La capital debe tener entre 3 y 90 caracteres.'),
  body('borders')
  .optional()
  .customSanitizer ((value) => {
    return typeof value === 'string' ? value.split(',').map((b) => b.trim()) : value;})
  .isArray()
  .withMessage('Las fronteras deben ser un arreglo.')
  .bail()
  .custom((borders) => {
    return borders.every((border) => /^[A-Z]{3}$/.test(border));})
  .withMessage('Las fronteras debe ser un código de 3 letras MAYÚSCULAS.'),
  body('area')
  .isFloat({ gt: 0 })
  .withMessage('El área debe ser un número positivo.')
  .optional(),
  body('population')
  .notEmpty()
  .withMessage('La población es obligatoria.')
  .isInt({ gt: 0 })
  .withMessage('La población debe ser un número entero positivo.'),
];