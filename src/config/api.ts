// src/config/api.ts

// Déterminer l'URL de l'API selon l'environnement
export const API_BASE_URL = 
  process.env.REACT_APP_API_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:3001'
    : 'https://rs-evcdashboaard.mongo-ibara.fr' // Domaine PROD
  );

console.log('API URL:', API_BASE_URL);

export default API_BASE_URL;