// index.js (Punto de entrada)

import { obtenerCoordenadas, obtenerClimaActual } from './src/api.js';
import { extraerArgumentoCiudad, mostrarError, mostrarExito, mostrarInformacion } from './src/utils.js';

async function iniciarAplicacion() {
  const ciudad = extraerArgumentoCiudad();

  if (!ciudad) {
    mostrarError('Por favor, ingresa el nombre de una ciudad.');
    console.log('💡 Uso: node index.js <nombre_de_la_ciudad>');
    process.exit(1); // Detiene la ejecución con código de error
  }

  try {
    // 1. Obtener coordenadas (geocodificación)
    const ubicacion = await obtenerCoordenadas(ciudad);
    const { latitude, longitude, name, country } = ubicacion;

    mostrarInformacion(`Buscando el clima para ${name}, ${country} (Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)})...`);

    // 2. Obtener información del clima a través de las coordenadas
    const clima = await obtenerClimaActual(latitude, longitude);
    const temperatura = clima.temperature;

    mostrarExito(`La temperatura actual en ${name} es de ${temperatura}°C.`);

  } catch (error) {
    // Captura cualquier error de las llamadas a la API que nosotros mismos lanzamos
    mostrarError(error.message);
  }
}

// Ejecutamos la función asíncrona principal
iniciarAplicacion();
