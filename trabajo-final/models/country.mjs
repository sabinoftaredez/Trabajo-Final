import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  capital: { type: [String], default: [] },
  borders: { type: [String], default: [] },
  area: { type: Number, default: 0 },
  population: { type: Number, default: 0 },
  timezones: { type: [String], default: [] },
  creador: { type: String, default: 'Sabino Felipe Tartalos Aredez' },
});

export default mongoose.model('Country', countrySchema);