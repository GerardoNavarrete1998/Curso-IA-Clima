// src/utils.js
// Archivo de utilidades generales, como el manejo de errores, formato de mensajes y extracción de comandos.

export function extraerArgumentoCiudad() {
  // Los primeros dos argumentos de process.argv son la ruta a node y la ruta al script.
  // slice(2) descarta estos dos, y join une todas las palabras separadas por espacios.
  const ciudad = process.argv.slice(2).join(' ').trim();
  return ciudad;
}

export function mostrarError(mensaje) {
  console.error(`\n❌ Error: ${mensaje}\n`);
}

export function mostrarExito(mensaje) {
  console.log(`\n✅ ¡Éxito! ${mensaje}\n`);
}

export function mostrarInformacion(mensaje) {
  console.log(`\nℹ️ ${mensaje}`);
}
