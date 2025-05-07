import express from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import path from 'path';
import { fileURLToPath } from 'url';
import { processAndSaveCountries } from './services/countriesService.mjs';
import countriesRoutes from './routes/countriesRoutes.mjs';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
})
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  console.log('Middleware Express-ejs-layout ejecutado');
  next();
})

// Configuración del motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressEjsLayouts);
app.set('layout', 'layout');
console.log('Middleware express-ejs-layouts configurado correctamente');

// Conexión a MongoDB
mongoose.connect('mongodb+srv://SabinoFelipe:WhatsAWonderfulWorld@cluster0.u3q1f.mongodb.net/paisesDB')
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Guardar países al iniciar la aplicación
processAndSaveCountries().then(() => {
  console.log('Países procesados y guardados en la base de datos.');
}).catch(err => {
  console.error('Error al procesar los países:', err);
});

// Rutas
app.use((req, res, next) => {
  console.log(`Ruta no manejada por estáticos: ${req.method} ${req.url}`);
  next();
});
app.use('/countries', countriesRoutes);

// Inicia el servidor
const PORT = 10000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});