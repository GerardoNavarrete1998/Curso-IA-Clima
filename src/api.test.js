import { describe, it, expect, vi } from 'vitest';
import { fetchCoordinates, getWeatherDescription } from './api';

describe('Weather API Service', () => {
  it('getWeatherDescription should return "Cielo despejado" for code 0', () => {
    expect(getWeatherDescription(0)).toBe('Cielo despejado');
  });

  it('getWeatherDescription should return "Desconocido" for an invalid code', () => {
    expect(getWeatherDescription(999)).toBe('Desconocido');
  });

  it('fetchCoordinates should throw an error if no city is provided', async () => {
    await expect(fetchCoordinates('')).rejects.toThrow('Se requiere el nombre de una ciudad.');
  });

  it('fetchCoordinates should handle API errors gracefully', async () => {
    // Mocking fetch to simulate a failure
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 500
      })
    );

    await expect(fetchCoordinates('Madrid')).rejects.toThrow('Fallo en la conexión con el servicio de geocodificación.');
  });
});
