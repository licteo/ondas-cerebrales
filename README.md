Guía Espiritual del Cuerpo y la Mente — PWA
==========================================

Instalación local / despliegue
1. Coloca todos los archivos en la misma carpeta (index.html, style.css, app.js, manifest.json, service-worker.js, icon-192.png, icon-512.png).
2. Sirve la carpeta desde un servidor HTTPS o localhost (Chrome exige HTTPS para PWA install and service worker).
   - Ejemplo rápido: npm i -g serve ; serve -s .
3. Abre la URL en tu móvil o en el navegador. Verás el botón "Instalar app" si tu navegador permite instalación.

Cómo funciona el service-worker.js
- En 'install' el Service Worker cachea los archivos listados en ASSETS para disponibilidad offline.
- En 'activate' elimina caches previos con nombres distintos al actual.
- En 'fetch' responde primero con la versión cacheada (cache-first). Si no existe, intenta la red y guarda una copia en cache para futuras cargas. En caso de fallas de red y navegación solicita index.html desde cache (útil para SPA-like navegación).

Notas finales
- El botón de instalación aparece gracias al evento 'beforeinstallprompt' y permite al usuario añadir la app al inicio.
- La app es completamente responsiva y optimizada para móvil.

