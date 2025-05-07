import express from 'express';
import { validateCountryExists } from '../middleware/countriesMiddleware.mjs';
import { validateCountry } from '../validators/countriesValidators.mjs';
import { validationResult } from 'express-validator';
/*
import { validateObjectId } from '../middleware/countriesMiddleware.mjs';
*/
import {
  listCountriesController,
  addCountryController,
  editCountryController,
  updateCountryDataController,
  deleteCountryDataController,
} from '../controllers/countriesController.mjs';


const router = express.Router();

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).render(req.originalUrl.includes('add') ? 'addCountry' : 'editCountry', {
      errors: errorMessages,
      country: req.body,
    });
  }
  next();
};

router.get('/', listCountriesController);
router.get('/add', (req, res) => res.render('addCountry', { errors: [], country: {} }));
router.post('/', validateCountry, handleValidationErrors, addCountryController);
router.get('/edit/:id', validateCountryExists, editCountryController);
router.put('/:id', validateCountryExists, validateCountry, handleValidationErrors, updateCountryDataController);
router.delete('/:id', validateCountryExists, deleteCountryDataController);

export default router;