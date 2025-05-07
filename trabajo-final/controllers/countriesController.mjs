import { name } from 'ejs';
import { processAndSaveCountries, listCountries, addCountry, editCountry, updateCountryData, deleteCountryData } from '../services/countriesService.mjs';
import country from '../models/country.mjs';

export const processAndSaveCountriesController = async (req, res) => {
  try {
    await processAndSaveCountries();
    res.status(200).json({ message: 'Países procesados y guardados Correctamente' });
  } catch (error) {
    console.error('Error al procesar y guardar países:', error);
    res.status(500).json({ message: 'Error al procesar y guardar países' });
  }
};

export const listCountriesController = async (req, res) => {
  try {
    const countries = await listCountries();
    const filteredCountries = countries.map(country => ({
      _id: country._id, // Incluye el campo _id
      name: country.name,
      capital: country.capital,
      borders: country.borders || [],
      area: country.area || 0,
      population: country.population || 0,
      timezones: country.timezones || [],
      creador: country.creador || 'SFTA',
    }));
    // Calcular Totales.
    const totalPopulation = filteredCountries.reduce((sum, country) => sum + country.population, 0);
    const totalArea = filteredCountries.reduce((sum, country) => sum + country.area, 0);
    res.render('dashboard', { countries: filteredCountries, totalPopulation, totalArea, errors: [] });
  } catch (error) {
    console.error('Error al obtener países:', error);
    res.status(500).render( 'dashboard', {
      errors: ['Error al obtener países. Vuelva a intentarlo.'],
      countries: [],
      totalPopulation: 0,
      totalArea: 0,
    });
  }
};

export const addCountryController = async (req, res) => {
  try {
    const { name, capital, borders, area, population } = req.body;
/*
    // Validar que los campos requeridos no estén vacíos
    if (!name || !capital || !area || !population || !timezones) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
*/
    await addCountry([{ name, capital, borders, area, population }]);
    res.redirect('/countries');
  } catch (error) {
    console.error('Error al agregar país:', error);
    res.status(500).render('addCountry', {
      errors: ['error al agregar país. Vuelva a intentarlo.'],
      country: req.body,
    });
  }
};

export const editCountryController = async (req, res) => {
  try {
    console.log('ID del país:', req.params.id);
    const country = await editCountry(req.params.id);
    console.log('País encontrado:', country);
    // Filtrar los datos que se enviaran al dashboard.
    const filteredCountry = {
      name: country.name,
      capital: country.capital,
      borders: country.borders || [],
      area: country.area || 0,
      population: country.population,
    };
/*
    // Validar que el país exista.
    if (!country) {
      return res.status(404).json({ message: 'País no encontrado' });
    }
*/
    res.render('editCountry', { country, errors: [] });
  } catch (error) {
    console.error('Error al obtener país:', error);
    res.status(500).render( 'editCountry', {
      errors: ['Error al obtener país. Vuelva a intentarlo.'],
      country: req.body,
    });
  }
};

export const updateCountryDataController = async (req, res) => {
  try {
    await updateCountryData(req.params.id, req.body);
    res.redirect('/countries');
  } catch (error) {
    console.error('Error al actualizar país:', error);
    res.status(500).render('dashboard', {
      errors: ['Error al actualizar país. Vuelva a intentarlo.'],
      country: req.body,
    });
  }
};

export const deleteCountryDataController = async (req, res) => {
  try {
    console.log('ID del país a eliminar:', req.params.id);
    await deleteCountryData(req.params.id);
    console.log('País eliminado');
    res.redirect('/countries');
  } catch (error) {
    console.error('Error al eliminar país:', error);
    res.status(500).render( 'dashboard', {
      errors: ['Error al eliminar país. Vuelva a intentarlo.'],
      country: req.body,
    });
  }
};