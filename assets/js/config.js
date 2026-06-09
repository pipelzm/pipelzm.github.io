/*
  CONFIGURACIÓN RÁPIDA
  Cambia estos valores para personalizar la web sin tocar el resto del código.
*/
window.SITE_CONFIG = {
  owner: 'Felipe Lizama-Mora',
  handle: '@pipelzm',
  year: '2026',
  feedbackEmail: 'felipelzm02@gmail.com',

  // GitHub: usa el usuario de tu GitHub Pages. Ej: pipelzm.github.io => pipelzm
  githubUser: 'pipelzm',

  // Spotify estático: reemplaza por el embed de una canción, álbum o playlist.
  // En Spotify: Compartir > Insertar canción > copia la URL del iframe src.
  spotifyEmbedUrl: 'https://open.spotify.com/embed/track/4uLU6hMCjMI75M1A2tKUQC?utm_source=generator',

  // Opcional avanzado: si más adelante creas un backend/serverless que entregue tu última canción,
  // pon aquí la URL del endpoint. Debe devolver JSON como:
  // { "title":"Song", "artist":"Artist", "embedUrl":"https://open.spotify.com/embed/track/...", "externalUrl":"https://open.spotify.com/track/..." }
  spotifyStatusEndpoint: '',

  // Redes: reemplaza estos links por tus perfiles reales.
  socials: {
    email: 'mailto:felipelzm02@gmail.com',
    github: 'https://github.com/pipelzm',
    linkedin: 'https://www.linkedin.com/',
    orcid: 'https://orcid.org/',
    home: 'https://pipelzm.github.io'
  },

  // Relojes globales. No hay mapa: solo horas en vivo.
  cityTimes: [
    { city: 'Santiago', country: 'CL', tz: 'America/Santiago' },
    { city: 'New York', country: 'US', tz: 'America/New_York' },
    { city: 'London', country: 'UK', tz: 'Europe/London' },
    { city: 'Tokyo', country: 'JP', tz: 'Asia/Tokyo' },
    { city: 'Sydney', country: 'AU', tz: 'Australia/Sydney' }
  ]
};
