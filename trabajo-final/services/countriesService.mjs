import { fetchCountries } from '../utils/fetchCountries.mjs';
import { saveCountries, getAllCountries, getCountryById, updateCountry, deleteCountry, daleteInvalindCountries } from '../repository/countriesRepository.mjs';
import Country from '../models/country.mjs';
// Cosumo de la API de REST y guarda los datos en MongoDB.
export const processAndSaveCountries = async () => {
  // Eliminar países inválidos antes de procesar nuevos datos.
  await daleteInvalindCountries();
  // Obtener los datos de la API.
  const rawCountries = await fetchCountries();
  // Inspeccionar los datos para depuracion.
  console.log(rawCountries[0]); // Muestra el primer país para verificar su estructura.
  // FILTRO
  const filteredCountries = rawCountries
    .filter(country => country.languages?.spa) // Filtrar países que tienen español como idioma.
    .map(country => {
      // Verificar el Campo Translations.
      console.log(`Procesando pais: ${country.name?.official}`);
      // Muestra las traducciones para verificar su estructura.
      console.log(country.translations);
      // Obtener el nombre en español o usar un respaldo.
      const nameInSpanish =
        country.translations?.spa?.official ||
        country.translations?.spa?.common ||
        country.name?.official ||
        country.name?.common || 'Nombre no disponible';
        // Eliminar las Propiedades Innecesarias.
        const { translations, tld, cca2, ccn3, cca3, cioc, idd, altSpellings, car, coatOfArms, postalCode, demonyms, ...filteredCountries } = country;
  return {
        ...filteredCountries,
        name: nameInSpanish,
        capital: country.capital || [],
        borders: country.borders || [],
        area: country.area || 0,
        population: country.population || 0,
        timezones: country.timezones || [],
        creador: 'Sabino Felipe Tartalos Aredez',
      };
    });
  console.log('Países procesados:', filteredCountries);
// Reinicio de la API no sobre escribe los datos.
  for (const country of filteredCountries) {
    await updateOrInsertCountry(
       // Buscar por nombre. y Actualizar los datos.
      { name: country.name }, { $set: country }
    );
  }
};

export const updateOrInsertCountry = async (filter, update) => {
  console.log('Filtro:', filter);
  console.log('Actualización:', update);
  await Country.updateOne(filter, update, { upsert: true });
};

export const listCountries = async () => {
    return await getAllCountries();
};

export const addCountry = async (countryData) => {
  return await saveCountries( countryData );
};

export const editCountry = async (id) => {
  console.log('Buscando país por ID:', id);
  return await getCountryById(id);
};

export const updateCountryData = async (id, data) => {
  return await updateCountry(id, data);
};

export const deleteCountryData = async (id) => {
  return await deleteCountry(id);
};