/**
 * normalizeText.js
 * Utilidad reutilizable para normalizar cadenas de texto.
 * Elimina espacios innecesarios al inicio, al final y entre palabras,
 * mejorando la calidad y consistencia de los datos ingresados.
 *
 * Principios aplicados:
 *  - Reutilización: puede usarse en cualquier formulario del sistema.
 *  - Separación de responsabilidades: lógica de normalización aislada.
 *  - Calidad de datos: previene registros con espacios inconsistentes.
 */

/**
 * Elimina espacios al inicio y al final de una cadena.
 * @param {string} value - Texto a normalizar.
 * @returns {string} Texto sin espacios extremos.
 */
export const normalizeText = (value) => {
  if (typeof value !== 'string') return value;
  return value.trim();
};

/**
 * Elimina espacios múltiples internos y recorta extremos.
 * Ejemplo: "  Equipo    no inicia  " => "Equipo no inicia"
 * @param {string} value - Texto a normalizar.
 * @returns {string} Texto limpio.
 */
export const normalizeFullText = (value) => {
  if (typeof value !== 'string') return value;
  return value.trim().replace(/\s+/g, ' ');
};

/**
 * Convierte texto a minúsculas y elimina espacios extremos.
 * Útil para comparaciones de correo electrónico.
 * @param {string} value - Texto a normalizar.
 * @returns {string} Texto en minúsculas sin espacios extremos.
 */
export const normalizeEmail = (value) => {
  if (typeof value !== 'string') return value;
  return value.trim().toLowerCase();
};

export default normalizeText;
