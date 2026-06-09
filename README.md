# Felipe Lizama-Mora · Retro personal website

Sitio estático listo para GitHub Pages.

## Archivos principales

- `index.html`: home.
- `about.html`: perfil extendido con foto.
- `projects.html`: proyectos e investigación.
- `resume.html`: CV ligero.
- `contact.html`: contacto.
- `assets/css/styles.css`: estética general.
- `assets/js/config.js`: configuración rápida.
- `assets/js/main.js`: reloj en vivo, horas globales, repos de GitHub, Spotify y feedback.
- `assets/img/profile-halftone.png`: imagen del perfil.

## Cambios incluidos

- Se eliminó el mapa mundial.
- Se dejó un bloque de horas alrededor del mundo, actualizado cada segundo.
- El reloj superior también se actualiza cada segundo.
- Se redujo el tamaño de la letra del cuerpo, manteniendo títulos y subtítulos grandes.
- Se mejoraron los iconos superiores y los accesos sociales del footer.
- Se agregó la imagen personal en `about.html`.

## Personalización rápida

Edita `assets/js/config.js` para cambiar:

- usuario de GitHub;
- correo de feedback;
- enlaces de redes;
- embed de Spotify;
- ciudades del reloj global.

## Subida a GitHub Pages

Copia todos estos archivos dentro del repositorio `pipelzm.github.io`, luego ejecuta:

```bash
git add .
git commit -m "Update retro personal website"
git push origin main
```
