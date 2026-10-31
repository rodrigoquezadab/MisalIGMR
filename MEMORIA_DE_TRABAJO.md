# Memoria de trabajo

Dónde quedamos y qué sigue. **Leer al comenzar cada sesión y actualizar al terminarla.**

Las fuentes, normas y dudas para consultar están en `FUENTES_Y_CONSULTAS.md`. La descripción de la app está en `CONTEXT.md`.

---

## Dónde quedamos

**Última sesión: 31-10-2026 (noche, 4.ª parte).** Rama `claude/youthful-wozniak-8ooc6f`, todavía no unida a `main`.

- La app sigue mostrando los textos de la edición **colombiana** («vosotros»). Ningún texto litúrgico se ha reemplazado todavía.
- **Paso 1 hecho:** `fuentes/descargar_eucaristiadiaria.js` calcula la fecha de cada misa en los ciclos A, B y C y descarga esas páginas de eucaristiadiaria.cl. Resultado: 195 páginas, 207 pares misa-ciclo, índice en `fuentes/eucaristiadiaria/indice.json` (URL, fecha de descarga, sha256 y título de cada página).
  - Las páginas están guardadas en el repositorio, en `fuentes/eucaristiadiaria/paginas/` (el repositorio es privado desde el 31-10-2026). No hace falta volver a descargarlas.
  - Sin página: `pas-sabado-santo` (no tiene misa), `to-1` y `pas-7` (no se celebran en Chile), `to-9` (no cayó en domingo entre 2014 y 2026).
  - Ciclos sin página: `sem-crismal` C (la página de 2025 no la trae), `to-7` B, `to-8` B, `to-10` A. Para los domingos faltantes habrá que buscar otra fuente (Leccionario impreso).
  - Dónde está cada misa en el sitio: la Vigilia de Navidad en la página del 25 de diciembre (con Noche, Aurora y Día); la Vigilia Pascual en la del Sábado Santo; la Misa Crismal en la del Jueves Santo (salvo 2025).
- **Paso 2 hecho (extracción):** `node fuentes/extraer_eucaristiadiaria.js` convierte las páginas en `fuentes/eucaristiadiaria/extraido.json` (por misa y ciclo: antífonas, colecta, lecturas con título, encabezado y cita, salmo con respuesta y estrofas, aclamación, evangelio con evangelista, ofrendas, prefacio, comunión, poscomunión, oración sobre el pueblo, bendición solemne, rúbricas, Gloria/Credo, y la fuente de cada uno). Deja fuera el material pastoral del sitio (sugerencias, oración de los fieles). Escribe `fuentes/eucaristiadiaria/revision.md` con lo que falta y lo que difiere.
  - 183 de 206 pares misa-ciclo sin observaciones. Las 23 restantes: celebraciones especiales para revisar a mano (Ramos, Crismal, Jueves Santo, Viernes Santo, Vigilia Pascual) y huecos de la fuente (D13).
  - Control de calidad: las antífonas y oraciones de una misa deben ser iguales en los tres ciclos. 322 coinciden; las 28 que difieren son antífonas de comunión propias de cada ciclo (Cuaresma III-V, Pascua III), antífonas con dos opciones, diferencias menores de la fuente (D14) o fugas dentro de las celebraciones especiales.
- La tarjeta «Celebración de hoy» y su calendario coinciden con lo que publica el sitio en las 195 fechas.
- **Guía para aprender** (`guia_aprendizaje.html`, vista `#learnView`): propósito de la app como plataforma de aprendizaje, cómo participa la asamblea (IGMR 35-36, 42-45), año litúrgico, fechas fijas y móviles (con tabla del año en curso), ciclos A/B/C y evangelistas, años pares e impares, solemnidades/fiestas/memorias/ferias y otras Misas (IGMR cap. VIII). Se abre desde la portada y desde el índice lateral. Lo que no viene de la IGMR queda por verificar (D12).

## Decisiones tomadas

| Fecha | Decisión |
| :-- | :-- |
| 31-10-2026 | Los textos deben ser los de la edición aprobada para Chile (Misal del Cono Sur y sus Leccionarios, con «ustedes»). No se cambia «vosotros» por «ustedes» a mano: se reemplaza el texto completo desde una fuente identificada. |
| 31-10-2026 | Nunca completar ni corregir textos litúrgicos de memoria. |
| 31-10-2026 | Seguir trabajando con los textos con derechos de autor hasta tener una app correcta; entonces mostrarla y pedir permiso (ver D3 en `FUENTES_Y_CONSULTAS.md`). Mientras tanto, no publicar en `main`: cada push a `main` despliega el sitio público en GitHub Pages. |
| 31-10-2026 | Registrar toda fuente, norma y duda en `FUENTES_Y_CONSULTAS.md` para llevarla a consultas presenciales. |
| 31-10-2026 | El usuario hizo **privado** el repositorio de GitHub; las páginas descargadas se guardan en él (D10). Con el plan gratuito de GitHub, el sitio de GitHub Pages deja de estar disponible mientras el repositorio sea privado; para mostrar la app se puede abrir `index.html` directamente. |

## Próximos pasos

1. ~~Guardar las páginas descargadas de forma permanente.~~ Hecho: están en el repositorio privado.
2. ~~Extraer los textos.~~ Hecho para las misas comunes (ver arriba). Pendiente: revisar a mano Ramos, Crismal, Jueves Santo, Viernes Santo y Vigilia Pascual, que tienen estructura propia.
3. **Reemplazar en `liturgia_db.json`**, guardando la fuente de cada texto. Decidir con la consulta D4 si se guardan los tres ciclos (los datos ya están separados por ciclo). Reglas para unir:
   - Antífonas y oraciones: usar el texto en que coinciden la mayoría de los ciclos; si falta en un ciclo (p. ej., colecta del XXXIII Domingo A), tomarlo de otro ciclo y dejar constancia. Excepción: las antífonas de comunión propias de un ciclo («Cuando se lee el evangelio…», «Año A:»).
   - Lecturas, salmo, aclamación y evangelio: siempre del ciclo correspondiente.
   - Misas sin página o ciclos faltantes (`to-9`; `to-7` B, `to-8` B, `to-10` A; Navidad Aurora/Día A; Crismal C; Cena del Señor B): dejar el texto actual marcado como «pendiente» hasta tener fuente.
   - Mostrar en la app de dónde sale cada texto.
4. **Ordinario.** Rehacerlo comparando el de eucaristiadiaria.cl con el Misal impreso del Cono Sur. Anotar en D7 cada diferencia.
5. **Prueba automática** que falle si queda alguna forma de «vosotros» en textos proclamados (fuera de las citas de la IGMR).

## Bitácora

| Fecha | Qué se hizo |
| :-- | :-- |
| 21/22-08-2026 | Catálogo de 74 misas, Viernes Santo y Sábado Santo, selector por tiempo, portada, limpieza de los 399 numerales de la IGMR, rediseño visual. |
| 31-10-2026 (madrugada) | IGMR por momento y por ministerio, posturas y silencios de la asamblea, títulos de la IGMR como encabezados. Se anotó que los textos no son la edición para Chile. (Rama `claude/blissful-archimedes-1bkjty`, ya en `main`.) |
| 31-10-2026 (tarde) | Tarjeta «Celebración de hoy» con su calendario y pruebas. Inventario del «vosotros» y búsqueda de fuentes para Chile. Creación de este archivo, de `FUENTES_Y_CONSULTAS.md` y de `CLAUDE.md`. |
| 31-10-2026 (noche, 4.ª parte) | Extractor de textos (paso 2): 183 de 206 pares sin observaciones, control de consistencia entre ciclos, informe de revisión. Nuevas consultas D13 (errores de la fuente) y D14 (diferencias de texto). |
| 31-10-2026 (noche, 3.ª parte) | El repositorio pasó a ser privado y se subieron las 195 páginas de eucaristiadiaria.cl. |
| 31-10-2026 (noche, 2.ª parte) | Guía para aprender: intención de la app, participación de la asamblea, año litúrgico, fechas fijas y móviles, ciclos A/B/C, años pares e impares, grados de las celebraciones y otras Misas. El calendario ahora calcula las fechas móviles y el año I/II. |
| 31-10-2026 (noche) | Descarga de las páginas de eucaristiadiaria.cl para las 74 misas en los tres ciclos (paso 1). Comprobación de títulos: corregidos los domingos reemplazados por fiestas y la ubicación de las Vigilias. |
