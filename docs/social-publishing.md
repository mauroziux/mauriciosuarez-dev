# Artículos → borradores de LinkedIn y X

Postiz: https://postiz.mauriciosuarez.dev

## Preferencias acordadas

- **X en español**: un hilo completo por día, con enlace a la versión ES del artículo.
- **LinkedIn en inglés**: un post por día, con enlace a la versión EN y slug inglés.
- Traducciones comparten la clave de archivo, no el `routeSlug`. `{article_url}` deriva el canónico actualizado automáticamente para nuevos borradores. Los seis programados usan ahora enlaces canónicos: el 7 de octubre, Mauricio autorizó cambiar solo las URLs antiguas de LinkedIn del 8/9 y X del 10, después de verificar los 301 en producción. El uploader omite publicaciones existentes: un commit/push no modifica su texto ni autoriza editarlas/reprogramarlas automáticamente.
- Hora diaria: **09:00 Europe/Madrid**, elegida por Mauricio. Usar la zona IANA para respetar cambios de horario; no fijar UTC+2 para futuros lotes.
- **Cada pieza lleva una imagen relevante**: en el post de LinkedIn y en el primer mensaje del hilo de X. El texto dentro de la imagen también respeta EN/ES; no repetir la foto en cada respuesta.

## Flujo

1. El agente lee los artículos completos de `src/content/articles/` y adapta su historia a cada red en `docs/social-drafts.json`.
2. `article` señala la fuente ES para X; `linkedin_article`, la fuente EN para LinkedIn. Mantener cifras, límites y contexto de cada fuente; `{article_url}` se sustituye por su ruta pública real. LinkedIn tiene un texto; X, una lista de mensajes del hilo.
3. Seleccionar una ilustración que represente la historia, preservando los límites de las cifras. Reutilizar assets propios de `public/articles/` cuando sirven. Rasterizar SVG a PNG con `sharp` ya instalado, sin recortar textos, y revisar visualmente el resultado. Subir PNG/JPG al endpoint local Postiz `POST /api/public/v1/upload` (multipart campo `file`), sin mandar la clave a un host externo. Guardar en `images.linkedin` / `images.x` del manifiesto el `id`, `path` devueltos, `alt` en el idioma correspondiente y `source` original. El uploader exige estas referencias y adjunta la imagen solo al mensaje raíz; no genera ni sube imágenes por sí solo.
4. Validar y subir **solo borradores**:

```bash
python3 scripts/postiz-drafts.py --self-test
python3 scripts/postiz-drafts.py                     # vista previa, sin red ni claves
python3 scripts/postiz-drafts.py --apply --env-file /home/dev/apps/postiz/.env
```

También admite `POSTIZ_API_KEY` inyectada por el gestor de secretos, sin `--env-file`. El uploader llama a la instancia local en `127.0.0.1:5000`; no almacena claves en este repositorio.

5. Revisar el texto y la imagen en Postiz. Programar requiere una instrucción explícita del usuario; el uploader permanente no puede hacerlo. El primer lote sí fue autorizado y ya está programado. Al modificar borradores existentes, conservar los IDs de todos los mensajes y comprobar que no se pisan ediciones humanas ni se crean duplicados.

## Seguridad y repetición

- Rechaza artículos con `draft: true`, referencias ausentes y textos que excedan límites. Las fuentes usan el formato de frontmatter de este repo.
- Recibos en `~/.local/state/mauriciosuarez-dev/postiz-drafts.json`, fuera del repo. Repetir la ejecución omite pares artículo/red ya creados; editar el JSON no sobrescribe un borrador revisado en Postiz.
- Una respuesta incierta queda `pending`: revisar Postiz antes de cualquier reintento. No borrar recibos a ciegas.
- Un bloqueo local evita dos uploaders simultáneos. Para ejecutar desde varias máquinas haría falta idempotencia compartida.
- La longitud de X es conservadora con emoji compuestos; no hace falta depender de que la cuenta tenga posts largos.

## Calendario del lote actual

Programación autorizada y verificada el 7 de octubre de 2026: seis piezas en `QUEUE`, con seis workflows Temporal activos y temporizadores de espera. Una pieza por plataforma y día, conservando los 16 IDs de mensajes originales. Cada una tiene una imagen adjunta y las respuestas del hilo no repiten la foto. Ninguna estaba publicada en la verificación.

| Fecha (2026) | Tema | X | LinkedIn |
| --- | --- | --- | --- |
| 8 de octubre | Interpretación vs. autorización | Hilo ES + imagen, 09:00 | Post EN + imagen, 09:00 |
| 9 de octubre | Modelos más baratos: no migrar | Hilo ES + imagen, 09:00 | Post EN + imagen, 09:00 |
| 10 de octubre | Endpoint de 29 segundos | Hilo ES + imagen, 09:00 | Post EN + imagen, 09:00 |

Todas las horas son de Madrid; en este lote equivalen a 07:00 UTC. El lote termina el día 10: no hay generación ni programación indefinida. La publicación futura corre en Postiz/Temporal, sin depender de que Pi esté abierto.

Los recibos privados ahora incluyen `scheduleStatus`, `publishDate` y el grupo vigente. Antes de una actualización se guardó `~/.local/state/mauriciosuarez-dev/postiz-pre-schedule-2026-10-07.json` (sin credenciales). Un resultado incierto queda `scheduleStatus: pending`: inspeccionar el calendario antes de reintentar.

Imágenes del lote: solicitud de servicio → etiqueta errónea → rechazo; gráfico del benchmark de ocho casos; portada 29 s → <500 ms. Todas tienen variantes ES/EN, fueron vistas y sus PNG públicos coinciden byte a byte con los revisados. La biblioteca de Postiz conserva los archivos; sus IDs/rutas son propios de esta instancia y hay que re-subirlos si se migra.

La actualización puntual de enlaces guardó `postiz-pre-links-2026-10-07.json` y recibos `linksStatus: pending → updated`. Solo cambiaron tres URLs; el resto del texto, los 16 IDs, imágenes, delays, settings y fechas se conservaron exactamente. Se resguardó la misma programación vía API para recargar workflows; comprobar también sus timers. Los enlaces antiguos permanecen compatibles con 301.

Para adjuntar las imágenes se guardó `postiz-pre-images-2026-10-07.json`, se reservaron recibos `imagesStatus: pending` y se usó la API con los IDs existentes y la misma fecha. Se refrescaron los workflows para cargar los medios nuevos; verificar timers y seis fotos raíz, no solo `QUEUE`. Repetir omite adjuntos idénticos. El override local de X corrige una conversión GIF con MIME PNG/JPEG inconsistente; prueba sin red en `~/apps/postiz/check-x-media.cjs`.

El recordatorio de rotación de claves llega el 8 de octubre a las 07:31 de Madrid, antes del primer post. Tras rotar, actualizar/reconectar los canales y comprobar los seis programados antes de las 09:00. También conviene rotar `PGPASS` (compartida por PostgreSQL/Redis) por su exposición durante una inspección; no se rotó automáticamente.

No se usan llamadas adicionales a una API de IA: el agente prepara el contenido y el script realiza la parte repetitiva.
