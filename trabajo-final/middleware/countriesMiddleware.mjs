import { editCountry } from "../services/countriesService.mjs";
export const validateCountryExists = async (req, res, next) => {
    try {
        const country = await editCountry(req.params.id);
        // Validar que el país exista.
        if (!country) {
            return res.status(404).json({ message: 'País no encontrado' });
        }
        // Adjuntar el país al objeto para que lo solicite el controlador.
        req.country = country;
        next();
    } catch (error) {
        console.error('Error al validar país:', error);
        res.status(500).json({ message: 'Error al validar país' });
    }
}
/*
export const validateObjectId = (req, res, next) => {
    const idPattern = /^[0-9a-fA-F]{24}$/; // Patron para un ID de MongoDB.
    if (!idPattern.test(req.params.id)) {
        console.log(`Solicitid Ignorada; ${req.method} ${req.url} no es un ObjectId`);
        return next();
    }
    next();
}
*/