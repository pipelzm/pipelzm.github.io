# Felipe Lizama-Mora · Retro Personal Website

Sitio estático listo para GitHub Pages, inspirado en una estética monocromática tipo libreta digital / old web / retro OS.

## Estructura

```txt
pipelzm_retro_site/
├── index.html
├── about.html
├── projects.html
├── resume.html
├── contact.html
└── assets/
    ├── css/
    │   └── styles.css
    └── js/
        ├── config.js
        └── main.js
```

## Cómo subir a GitHub Pages

1. Crea o abre tu repositorio `pipelzm.github.io`.
2. Sube todos los archivos de esta carpeta a la raíz del repositorio.
3. En GitHub: `Settings > Pages`.
4. Source: `Deploy from a branch`.
5. Branch: `main`, folder `/root`.
6. Guarda y espera unos minutos.

## Personalización rápida

Edita `assets/js/config.js`:

- `githubUser`: usuario usado para cargar repositorios públicos.
- `feedbackEmail`: correo usado por la barra de quick feedback.
- `spotifyEmbedUrl`: URL del iframe embed de Spotify.
- `spotifyStatusEndpoint`: opcional, para conectar una API propia que muestre la última canción escuchada.
- `cityTimes`: ciudades y zonas horarias del mini mapa mundial.
- `socials`: enlaces de redes.

## Sobre Spotify y la última canción escuchada

GitHub Pages es estático y no puede guardar de forma segura los secretos de Spotify. Por eso el sitio trae dos modos:

1. Modo simple: un iframe de Spotify que puedes cambiar manualmente en `config.js`.
2. Modo avanzado: un endpoint externo/serverless en `spotifyStatusEndpoint` que devuelva la última canción y el `embedUrl`.

No pongas `client_secret` de Spotify dentro del JavaScript público.
