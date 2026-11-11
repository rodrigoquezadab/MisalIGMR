# Instrucciones para Claude

## Al empezar y al terminar cada sesión

1. Leer `MEMORIA_DE_TRABAJO.md` antes de proponer o hacer cualquier cosa: dice dónde quedamos, qué se decidió y qué sigue.
2. Al terminar, actualizar `MEMORIA_DE_TRABAJO.md` (Dónde quedamos, Próximos pasos y Bitácora) y hacer commit.
3. Cada fuente nueva, norma aplicada o duda que surja se anota en `FUENTES_Y_CONSULTAS.md`, con URL, fecha de consulta y estado.

## Reglas del proyecto

- Los textos deben ser los de la edición aprobada para Chile (Misal Romano del Cono Sur y sus Leccionarios, con «ustedes»).
- Nunca completar ni corregir textos litúrgicos de memoria: todo texto sale de una fuente identificada, registrada en `FUENTES_Y_CONSULTAS.md`.
- No hacer push a `main` sin que el usuario lo pida: cada push a `main` despliega el sitio público en GitHub Pages (https://rodrigoquezadab.github.io/MisalIGMR/).
- Desde el 11-11-2026 el repositorio y el sitio son **públicos** por decisión del usuario, para que lo revisen en su parroquia, aunque incluyen textos con derechos de autor (`fuentes/`, `textos_chile.json`) todavía sin permiso (D3). No ampliar esa publicación a otros lugares sin que el usuario lo decida, y avisarle si algo cambia al respecto.
- Responder al usuario en español.

## Comandos

- Compilar el sitio: `node build_complete_app.js` (genera `index.html` y `misal.html`; debe informar 399 numerales usados, ninguno sin usar ni repetido).
- Pruebas: `node test_calendar.js`, `node test_textos.js` y `node test_verificador.js`.
- «Seguir la Misa»: los pasos están en `verificador_datos.js`. «Comienza» y «Termina» llevan **solo frases exactas del Misal** con su fuente (`test_verificador.js` lo comprueba); toda aclaración va en `nota`, bajo el título. Partes numeradas 1, 1.1, 1.2…
- Textos para Chile: `node fuentes/extraer_eucaristiadiaria.js` (páginas → `fuentes/eucaristiadiaria/extraido.json` y `revision.md`), luego `node fuentes/unir_textos.js` (→ `textos_chile.json`), luego compilar. `textos_chile.json` es generado: no editarlo a mano.
- `generate_full_misal.js` debe quedar idéntico a `build_complete_app.js`.
