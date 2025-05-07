import Country from '../models/country.mjs';

export const saveCountries = async ( countries ) => {
  return await Country.insertMany( countries );
};

export const daleteInvalindCountries = async () => {
  return await Country.deleteMany({ name: 'Nombre no disponible' });
};

export const updateOrInsertCountry = async (filter, update) => {
    await Country.updateOne(filter, update, { upsert: true });
};

export const getAllCountries = async () => {
  return await Country.find();
};

export const getCountryById = async (id) => {
  console.log('Consulta a la base de datos con ID:', id);
  return await Country.findById(id);
};

export const updateCountry = async (id, data) => {
  return await Country.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCountry = async (id) => {
  return await Country.findByIdAndDelete(id);
}