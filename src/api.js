/**
 * Servicio de API para obtener datos meteorológicos de Open-Meteo.
 * Implementa geocodificación y obtención de clima actual/pronóstico.
 */

const BASE_GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const BASE_WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Obtiene las coordenadas de una ciudad por su nombre.
 * @param {string} city - Nombre de la ciudad.
 * @returns {Promise<Object>} - Coordenadas y metadatos de la ciudad.
 */
export async function fetchCoordinates(city) {
  if (!city) throw new Error('Se requiere el nombre de una ciudad.');

  try {
    const url = `${BASE_GEO_URL}?name=${encodeURIComponent(city)}&count=5&language=es&format=json`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('Fallo en la conexión con el servicio de geocodificación.');
    
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error(`No se encontró la ubicación: "${city}".`);
    }

    return data.results; // Devolvemos múltiples resultados para que el usuario elija si es necesario
  } catch (error) {
    console.error('Error in fetchCoordinates:', error);
    throw error;
  }
}

/**
 * Obtiene el clima actual y pronóstico para unas coordenadas dadas.
 * @param {number} lat - Latitud.
 * @param {number} lon - Longitud.
 * @returns {Promise<Object>} - Datos meteorológicos detallados.
 */
export async function fetchWeather(lat, lon) {
  try {
    const url = `${BASE_WEATHER_URL}?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
    const response = await fetch(url);

    if (!response.ok) throw new Error('Fallo al obtener datos meteorológicos.');

    const data = await response.json();
    
    if (!data.current_weather) {
      throw new Error('Datos del clima no disponibles para esta ubicación.');
    }

    return data;
  } catch (error) {
    console.error('Error in fetchWeather:', error);
    throw error;
  }
}

/**
 * Mapeo de códigos de clima de la OMM a descripciones legibles e iconos.
 * @param {number} code - Código de clima.
 * @returns {string} - Descripción del clima.
 */
export function getWeatherDescription(code) {
  const codes = {
    0: 'Cielo despejado',
    1: 'Principalmente despejado', 2: 'Parcialmente nublado', 3: 'Nublado',
    45: 'Niebla', 48: 'Niebla con escarcha',
    51: 'Llovizna ligera', 53: 'Llovizna moderada', 55: 'Llovizna densa',
    61: 'Lluvia ligera', 63: 'Lluvia moderada', 65: 'Lluvia fuerte',
    71: 'Nieve ligera', 73: 'Nieve moderada', 75: 'Nieve fuerte',
    80: 'Chubascos ligeros', 81: 'Chubascos moderados', 82: 'Chubascos violentos',
    95: 'Tormenta eléctrica',
  };
  return codes[code] || 'Desconocido';
}
