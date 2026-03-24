import React, { useState, useEffect } from 'react';
import { Search, Thermometer, Wind, CloudRain, RotateCcw, Info, AlertOctagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCoordinates, fetchWeather, getWeatherDescription } from './api';

export default function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);

  // Cargar historial de búsqueda al iniciar
  useEffect(() => {
    const savedHistory = localStorage.getItem('weatherHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (cityName) => {
    const updatedHistory = [cityName, ...history.filter(c => c !== cityName)].slice(0, 5);
    setHistory(updatedHistory);
    localStorage.setItem('weatherHistory', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('weatherHistory');
  }

  const handleSearch = async (e, searchCity = city) => {
    if (e) e.preventDefault();
    if (!searchCity.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Obtener coordenadas
      const locations = await fetchCoordinates(searchCity);
      const { latitude, longitude, name, country } = locations[0];

      // 2. Obtener clima
      const weather = await fetchWeather(latitude, longitude);
      
      setWeatherData({
        name,
        country,
        temperature: weather.current_weather.temperature,
        windspeed: weather.current_weather.windspeed,
        weathercode: weather.current_weather.weathercode,
        time: weather.current_weather.time,
        dailyMax: weather.daily.temperature_2m_max[0],
        dailyMin: weather.daily.temperature_2m_min[0]
      });

      saveToHistory(`${name}, ${country}`);
      setCity('');
    } catch (err) {
      setError(err.message || 'Ocurrió un error inesperado al buscar el clima.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const convertTemp = (temp) => {
    if (isCelsius) return Math.round(temp);
    return Math.round((temp * 9) / 5 + 32);
  };

  return (
    <div className="app-container">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Antigravity Weather</h1>
      </motion.header>

      <form className="search-container" onSubmit={handleSearch}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Introduce una ciudad..." 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ paddingLeft: '3rem' }}
          />
        </div>
        <button type="submit" className="primary" disabled={loading}>
          {loading ? '...' : <><Search size={20} style={{ marginRight: '8px' }} /> Buscar</>}
        </button>
      </form>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
          >
            <AlertOctagon size={20} />
            <span>{error}</span>
          </motion.div>
        )}

        {weatherData ? (
          <motion.div 
            key={weatherData.name}
            className="weather-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.75rem' }}>{weatherData.name}, {weatherData.country}</h2>
              <button 
                onClick={() => setIsCelsius(!isCelsius)}
                style={{ background: 'none', border: '1px solid var(--glass-border)', color: 'var(--accent-color)', borderRadius: '0.5rem', padding: '0.25rem 0.5rem', cursor: 'pointer' }}
              >
                Cambiar a °{isCelsius ? 'F' : 'C'}
              </button>
            </div>

            <div className="temp">
              {convertTemp(weatherData.temperature)}<span className="unit">°{isCelsius ? 'C' : 'F'}</span>
            </div>
            
            <p className="description">
              {getWeatherDescription(weatherData.weathercode)}
            </p>

            <div className="details">
              <div className="detail-item">
                <span className="detail-label"><CloudRain size={16} inline="true" /> Máx / Mín</span>
                <span className="detail-value">{convertTemp(weatherData.dailyMax)}° / {convertTemp(weatherData.dailyMin)}°</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><Wind size={16} inline="true" /> Viento</span>
                <span className="detail-value">{weatherData.windspeed} km/h</span>
              </div>
            </div>
          </motion.div>
        ) : (
          !loading && (
            <div className="weather-card" style={{ background: 'transparent', border: '1px dashed var(--glass-border)' }}>
              <Info size={40} color="var(--text-secondary)" style={{ marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-secondary)' }}>Escribe el nombre de una ciudad para comenzar.</p>
            </div>
          )
        )}
      </AnimatePresence>

      <section className="history">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h3 className="history-title">Búsquedas Recientes</h3>
          {history.length > 0 && (
            <button onClick={clearHistory} style={{ background: 'none', border: 'none', color: 'var(--error-color)', display: 'flex', alignItems: 'center', fontSize: '0.8rem', cursor: 'pointer', opacity: 0.7 }}>
              <RotateCcw size={12} style={{ marginRight: '4px' }} /> Limpiar
            </button>
          )}
        </div>
        <div className="history-tags">
          {history.length > 0 ? (
            history.map((hCity, idx) => (
              <motion.span 
                key={idx} 
                className="tag"
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  const pureCity = hCity.split(',')[0];
                  setCity(pureCity);
                  handleSearch(null, pureCity);
                }}
              >
                {hCity}
              </motion.span>
            ))
          ) : (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Aún no hay búsquedas.</p>
          )}
        </div>
      </section>

      <footer style={{ marginTop: '3rem', fontSize: '0.75rem', textAlign: 'center', opacity: 0.5 }}>
        <p>&copy; 2026 Antigravity IA. Datos por Open-Meteo.</p>
        <p>Codificación Segura | Licencia MIT | IA Responsable</p>
      </footer>
    </div>
  );
}
