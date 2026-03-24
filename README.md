# 🌦️ Antigravity Weather App

Una aplicación meteorológica de vanguardia construida con **React**, **Vite**, **Lucide React** y la API gratuita de **Open-Meteo**.

## ✨ Características Premium
- **✨ Diseño Glassmorphism**: Una interfaz moderna y traslúcida que se integra con cualquier entorno.
- **🔍 Búsqueda Inteligente**: Localiza cualquier ciudad del mundo gracias al motor de geocodificación integrado.
- **🕒 Historial con Caché Local**: Tus últimas 5 búsquedas se guardan automáticamente en el navegador (`localStorage`) para un acceso instantáneo.
- **⚡ Conversión de Unidades**: Cambia entre Celsius y Fahrenheit con un solo clic.
- **🛡️ Manejo de Errores Robusto**: Notificaciones claras si la ciudad no existe o hay problemas de red.
- **🧪 Pruebas Automatizadas**: Suite de pruebas unitarias para garantizar la estabilidad del servicio de datos.

## 🚀 Instalación y Uso

1. **Clonar/Descargar** el proyecto.
2. **Instalar dependencias**:
   ```bash
   npm install
   ```
3. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```
4. **Ejecutar pruebas**:
   ```bash
   npm run test
   ```

## 🔐 Seguridad y Ética
- **Codificación Segura**: Los datos de entrada del usuario son sanitizados y se utiliza la vinculación de datos de React para prevenir ataques de inyección (XSS).
- **Consumo Responsable**: No se requieren claves de API privadas, lo que garantiza que no haya fugas de credenciales en el código fuente.
- **Uso de IA**: Esta aplicación ha sido desarrollada con la asistencia de **Antigravity AI**, siguiendo principios de desarrollo ético y generación de código transparente.
- **Licencia**: Licencia [MIT](https://opensource.org/licenses/MIT).

## 📂 Estructura del Proyecto
- `src/api.js`: Lógica de interacción con Open-Meteo.
- `src/App.jsx`: Componente principal y gestión de estado.
- `src/index.css`: Sistema de diseño y estilos personalizados.
- `src/api.test.js`: Suite de pruebas unitarias.

---
Desarrollado con ❤️ por **Antigravity IA** para el curso de Programación.
