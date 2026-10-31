# Instrucciones para Claude

## Al empezar y al terminar cada sesión

1. Leer `MEMORIA_DE_TRABAJO.md` antes de proponer o hacer cualquier cosa: dice dónde quedamos, qué se decidió y qué sigue.
2. Al terminar, actualizar `MEMORIA_DE_TRABAJO.md` (Dónde quedamos, Próximos pasos y Bitácora) y hacer commit.
3. Cada fuente nueva, norma aplicada o duda que surja se anota en `FUENTES_Y_CONSULTAS.md`, con URL, fecha de consulta y estado.

## Reglas del proyecto

- Los textos deben ser los de la edición aprobada para Chile (Misal Romano del Cono Sur y sus Leccionarios, con «ustedes»).
- Nunca completar ni corregir textos litúrgicos de memoria: todo texto sale de una fuente identificada, registrada en `FUENTES_Y_CONSULTAS.md`.
- No hacer push a `main` sin que el usuario lo pida: cada push a `main` despliega el sitio público (GitHub Pages).
- Responder al usuario en español.

## Comandos

- Compilar el sitio: `node build_complete_app.js` (genera `index.html` y `misal.html`; debe informar 399 numerales usados, ninguno sin usar ni repetido).
- Pruebas: `node test_calendar.js`.
- `generate_full_misal.js` debe quedar idéntico a `build_complete_app.js`.
