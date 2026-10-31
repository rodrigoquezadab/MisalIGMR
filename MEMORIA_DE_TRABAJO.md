# Memoria de trabajo

Dónde quedamos y qué sigue. **Leer al comenzar cada sesión y actualizar al terminarla.**

Las fuentes, normas y dudas para consultar están en `FUENTES_Y_CONSULTAS.md`. La descripción de la app está en `CONTEXT.md`.

---

## Dónde quedamos

**Última sesión: 31-10-2026 (tarde).** Rama `claude/youthful-wozniak-8ooc6f`, todavía no unida a `main`.

- La app sigue mostrando los textos de la edición **colombiana** («vosotros»). Ningún texto litúrgico se ha reemplazado todavía.
- Ya se sabe dónde está el «vosotros»: unas 340 formas, la mayoría en las lecturas (`CONTEXT.md` §2.2).
- Fuente digital elegida para Chile: **eucaristiadiaria.cl** (Arzobispado de Santiago). Trae los propios y las lecturas de cada día ya con «ustedes». Su Ordinario tiene errores.
- La portada muestra la «Celebración de hoy» (`liturgical_calendar.js`, con pruebas en `test_calendar.js`).

## Decisiones tomadas

| Fecha | Decisión |
| :-- | :-- |
| 31-10-2026 | Los textos deben ser los de la edición aprobada para Chile (Misal del Cono Sur y sus Leccionarios, con «ustedes»). No se cambia «vosotros» por «ustedes» a mano: se reemplaza el texto completo desde una fuente identificada. |
| 31-10-2026 | Nunca completar ni corregir textos litúrgicos de memoria. |
| 31-10-2026 | Seguir trabajando con los textos con derechos de autor hasta tener una app correcta; entonces mostrarla y pedir permiso (ver D3 en `FUENTES_Y_CONSULTAS.md`). Mientras tanto, no publicar en `main`: cada push a `main` despliega el sitio público en GitHub Pages. |
| 31-10-2026 | Registrar toda fuente, norma y duda en `FUENTES_Y_CONSULTAS.md` para llevarla a consultas presenciales. |

## Próximos pasos

1. **Descargar y guardar las fuentes.** Para cada una de las 74 misas, calcular sus fechas en los ciclos A, B y C con `liturgical_calendar.js`. Descargar esas páginas de eucaristiadiaria.cl y guardarlas en el repositorio con la URL y la fecha de descarga, para poder citar cada texto.
2. **Extraer los textos.** Pasar a datos cada parte: antífonas, colecta, lecturas con su cita, salmo con respuesta, aclamación, evangelio, ofrendas, prefacio, comunión y poscomunión. Revisar a mano las páginas que tengan otra estructura (Triduo, Navidad).
3. **Reemplazar en `liturgia_db.json`**, guardando la fuente de cada texto. Decidir con la consulta D4 si se guardan los tres ciclos.
4. **Ordinario.** Rehacerlo comparando el de eucaristiadiaria.cl con el Misal impreso del Cono Sur. Anotar en D7 cada diferencia.
5. **Prueba automática** que falle si queda alguna forma de «vosotros» en textos proclamados (fuera de las citas de la IGMR).

## Bitácora

| Fecha | Qué se hizo |
| :-- | :-- |
| 21/22-08-2026 | Catálogo de 74 misas, Viernes Santo y Sábado Santo, selector por tiempo, portada, limpieza de los 399 numerales de la IGMR, rediseño visual. |
| 31-10-2026 (madrugada) | IGMR por momento y por ministerio, posturas y silencios de la asamblea, títulos de la IGMR como encabezados. Se anotó que los textos no son la edición para Chile. (Rama `claude/blissful-archimedes-1bkjty`, ya en `main`.) |
| 31-10-2026 (tarde) | Tarjeta «Celebración de hoy» con su calendario y pruebas. Inventario del «vosotros» y búsqueda de fuentes para Chile. Creación de este archivo, de `FUENTES_Y_CONSULTAS.md` y de `CLAUDE.md`. |
