# Fuentes, normas y consultas pendientes

Registro para consultar con las fuentes oficiales y con personas de la Iglesia en forma presencial. Cada entrada dice qué es, dónde se vio y qué tan verificada está.

**Estados**: ✅ verificado en la fuente · 🔎 visto en una fuente secundaria, falta confirmar · ❓ duda abierta · ⛔ descartado.

---

## 1. Bibliografía

### 1.1. Textos litúrgicos

| # | Documento | Emisor / editorial | Edición y fecha | Dónde se consultó | Estado | Uso en la app |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| B1 | *Missale Romanum*, editio typica tertia | Santa Sede | 2002; reimpresión enmendada 2008 | No consultado directamente | ❓ | Base de toda traducción |
| B2 | Misal Romano, edición para Argentina, Bolivia, Chile, Paraguay y Uruguay (Cono Sur) | Conferencia Episcopal Argentina, Oficina del Libro | Traducción aprobada por la Santa Sede en 2007 (según el prefacio citado en copias de Scribd); obligatoria en Chile desde el I Domingo de Adviento de 2010 | Solo existe impreso; [episcopado.org](https://episcopado.org/ver/1395) | 🔎 | **Debería** ser la fuente del Ordinario, plegarias, prefacios y propios. Aún no se usa |
| B3 | Misal Romano, edición colombiana | Conferencia Episcopal de Colombia | PDF del Seminario Conciliar de Bogotá | [PDF](https://seminariobogota.arquibogota.org.co/sites/default/files/inline-files/misal-romanopdf.pdf) | ✅ | Fuente **actual** de los textos (usa «vosotros»). Debe reemplazarse |
| B4 | Leccionarios (3.ª edición) para Argentina, Bolivia, Chile, Paraguay y Uruguay | Conferencias episcopales de esos países; texto bíblico de *El Libro del Pueblo de Dios* | — | [Orientaciones Pastorales CECh 2023-2026](https://iglesiadeconcepcion.cl/wp-content/uploads/2023/07/Orientaciones-Pastorales-2023-2026-CEch.pdf); [Wikipedia](https://es.wikipedia.org/wiki/Libro_del_Pueblo_de_Dios) | 🔎 | **Debería** ser la fuente de las lecturas. Aún no se usa |
| B5 | Eucaristía Diaria | Departamento de Liturgia del Arzobispado de Santiago; impreso por Ediciones San José | En línea; unos 3.900 días hasta el 30-11-2026 | [eucaristiadiaria.cl](https://www.eucaristiadiaria.cl/calendario.php); día: `dia_cal.php?fecha=AAAA-MM-DD`; [Ordinario](https://www.eucaristiadiaria.cl/ordinario.php) | ✅ (contenido visto el 31-10-2026) | Fuente digital elegida para propios y lecturas de Chile. Su Ordinario tiene errores (ver D7) |

### 1.2. Normas

| # | Documento | Emisor | Fecha | Dónde se consultó | Estado | Uso en la app |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| N1 | Instrucción General del Misal Romano (IGMR) | Congregación para el Culto Divino | 2002 (3.ª ed.); traducción de la Conf. Episcopal de Colombia, © 2007 | [vatican.va](https://www.vatican.va/roman_curia/congregations/ccdds/documents/rc_con_ccdds_doc_20030317_ordinamento-messale_sp.html) → `igmr_vatican.html` | ✅ | Los 399 numerales de la app |
| N2 | IGMR, edición argentina (Cono Sur) | Conferencia Episcopal Argentina | — | [curas.com.ar](https://www.curas.com.ar/Misal3/IGMR3.htm) (sin datos de edición; descarga directa respondió 503) | ❓ | Ninguno. Ver D2 |
| N3 | Normas Universales sobre el Año Litúrgico y el Calendario (promulgadas con *Mysterii paschalis*) | Santa Sede | 14-02-1969, vigentes desde 1-1-1970 | No consultado directamente (la red de la sesión bloqueó las copias encontradas) | ❓ | Reglas del calendario (`liturgical_calendar.js`) y guía: tiempos, grados, traslados. Citado sin número de párrafo |
| N4 | Decreto n.º 438 de la Conferencia Episcopal de Chile sobre el nuevo Misal | CECh | 2009 | [iglesia.cl, 05-10-2009](https://www.iglesia.cl/detalle_noticia.php?id=10375) | 🔎 | Fundamenta que la edición para Chile es B2 |
| N5 | Decreto de la Conferencia Episcopal Argentina sobre «ustedes» en lugar de «vosotros» | CEA | — | [episcopado.org/ver/426](https://episcopado.org/ver/426) | 🔎 | Fundamenta el cambio de «vosotros» |
| N7 | Ordenación de las Lecturas de la Misa (*Ordo Lectionum Missae*), Prenotandos | Congregación para el Culto Divino | 2.ª ed., 1981 | No consultado directamente. Copia del cap. IV en [dioceseoflaredo.org](https://dioceseoflaredo.org/wp-content/uploads/2024/04/CapituloIVDistribucionGeneraldeLasLecturasdelaMisa.pdf) (la red de la sesión no permite abrirla) | ❓ | Guía: ciclos A, B y C y ciclo de dos años de las ferias, citados sin número de párrafo |
| N6 | Ordo litúrgico 2026 | Conferencia Episcopal de Chile | 2026, PDF por tiempo | [iglesia.cl](https://www.iglesia.cl/nuestra_liturgia.php) (p. ej. `docs/2026-Ordinario-II.pdf`) | 🔎 | Para verificar el calendario chileno (D1). No leído aún |

### 1.3. Fuentes descartadas

| Fuente | Motivo |
| :-- | :-- |
| Copias del Misal o de la IGMR en Scribd, Academia.edu, Internet Archive | Subidas por particulares, sin procedencia verificable ⛔ |
| Completar o corregir textos de memoria | Regla del proyecto: todo texto litúrgico sale de una fuente identificada ⛔ |

---

## 2. Normas que la app aplica hoy

Cada regla indica de dónde sale y si está confirmada para Chile.

| Regla | Dónde está en el código | Fundamento | Estado |
| :-- | :-- | :-- | :-- |
| Pascua por cómputo gregoriano | `liturgical_calendar.js` | Cálculo estándar; probado contra fechas conocidas | ✅ |
| Epifanía el domingo entre el 2 y el 8 de enero | `liturgical_calendar.js` | N3, n. 7 (donde no es de precepto). B5 la pone el domingo 05-01-2025 y el domingo 04-01-2026 | 🔎 coincide con B5; confirmar D1 |
| Bautismo del Señor el lunes si la Epifanía cae el 7 u 8 de enero | `liturgical_calendar.js` | N3. B5 lo pone el lunes 08-01-2024 | 🔎 coincide con B5 |
| Ascensión el VII Domingo de Pascua | `liturgical_calendar.js` | N3, n. 7. B5 la pone en domingo (12-05-2024, 01-06-2025, 17-05-2026) | 🔎 coincide con B5; confirmar D1 |
| Corpus Christi el domingo después de la Trinidad | `liturgical_calendar.js` | N3, n. 7. B5 lo pone en domingo (02-06-2024, 22-06-2025, 07-06-2026) | 🔎 coincide con B5; confirmar D1 |
| Sagrada Familia el domingo de la octava, o el 30 de diciembre | `liturgical_calendar.js` | Calendario Romano General | 🔎 |
| Fiestas del Señor y solemnidades que reemplazan al domingo del T. O. (2-2, 24-6, 29-6, 6-8, 15-8, 14-9, 1-11, 2-11, 9-11) | `liturgical_calendar.js` | N3, tabla de precedencias. B5 celebra en domingo, sin trasladar: Presentación (02-02-2025), San Pedro y San Pablo (29-06-2025), Fieles Difuntos (02-11-2025), Letrán (09-11-2025) y Todos los Santos (01-11-2026) | 🔎 coincide con B5; falta ver 24-6, 6-8, 15-8 y 14-9 |
| Ciclo dominical A/B/C | `liturgical_calendar.js` | Coincide con eucaristiadiaria.cl («Inicio ciclo B», 29-11-2026) | ✅ |
| Qué misa del catálogo corresponde a cada fecha | `liturgical_calendar.js` | Los títulos de las 195 páginas de B5 descargadas coinciden con la misa calculada (ver `fuentes/eucaristiadiaria/indice.json`, campo `encabezado`) | 🔎 |
| Plegaria Eucarística sugerida para cada misa | `liturgia_db.json` (`plegariaRecomendada`) | N1, n. 365 | ❓ D5 |
| Posturas de la asamblea en cada momento | `build_complete_app.js` (`.posture`) | N1, nn. 43, 137, 160 | ❓ D6 |
| Estructura del Viernes Santo (4 partes, sin Liturgia Eucarística) | `build_complete_app.js` | Misal Romano, Viernes Santo | 🔎 cotejar con B2 |

---

## 3. Dudas para consultar

Para llevar a la Comisión Nacional de Liturgia (CONALI) de la CECh, al Departamento de Liturgia del Arzobispado de Santiago o a un sacerdote o liturgista de confianza. Al resolver una, anotar la respuesta, quién la dio y la fecha.

| # | Pregunta | Por qué importa | A quién | Respuesta |
| :-- | :-- | :-- | :-- | :-- |
| D1 | En Chile, ¿Epifanía, Ascensión y Corpus Christi se trasladan al domingo? ¿Se traslada San Pedro y San Pablo (29-6)? ¿Qué solemnidades propias de Chile (p. ej., Virgen del Carmen, 16-7) prevalecen sobre un domingo? | Define qué misa muestra la tarjeta «Celebración de hoy» | CONALI / Ordo CECh | Parcial (31-10-2026, según B5, no oficial): Epifanía, Ascensión y Corpus en domingo; San Pedro y San Pablo y Todos los Santos se celebran el domingo en que caen. Falta confirmar con el Ordo y ver las solemnidades propias de Chile |
| D2 | ¿Cuál es el texto oficial de la IGMR para Chile? ¿Existe una edición argentina o chilena aprobada, y dónde conseguirla? | Hoy la app usa la traducción colombiana del sitio del Vaticano | CONALI / Oficina del Libro (CEA) | — |
| D3 | Permiso para usar en la app los textos del Misal (Cono Sur), del Leccionario y de Eucaristía Diaria. ¿A quién se pide cada uno? | Los textos tienen derechos de autor. Decisión del 31-10-2026: seguir trabajando con ellos hasta tener una app correcta y entonces pedir el permiso mostrando la app | Arzobispado de Santiago (pastoralliturgica@iglesiadedesantiago.cl); Oficina del Libro de la CEA | — |
| D4 | ¿Conviene mostrar las lecturas de los tres ciclos (A, B, C) o solo las del año en curso? | Hoy las lecturas mezclan ciclos (Adviento del C, Cuaresma III-V del A) | Liturgista | — |
| D5 | ¿Es correcta la plegaria sugerida para cada misa? Por ejemplo, ¿Plegaria II para Lunes, Martes y Miércoles Santo, y Plegaria III para todos los domingos? | La app presenta la sugerencia como aplicación de la IGMR n. 365 | Liturgista | — |
| D6 | ¿Ha determinado la CECh posturas propias para Chile (IGMR 43)? Por ejemplo, ¿de rodillas desde el Santo hasta el final de la Plegaria? ¿Comunión de pie o de rodillas (IGMR 160)? | La app muestra las posturas generales de la IGMR | CONALI | — |
| D7 | El Ordinario de eucaristiadiaria.cl trae «El Señor esté con vosotros» en dos diálogos del prefacio, una nota interna («PONER PLEGARIA EUCARÍSTICA I, III…») y no trae todas las plegarias. ¿Hay un Ordinario digital fiel al Misal del Cono Sur? ¿Les sirve que les avisemos de esos errores? | Para el Ordinario no hay fuente digital confiable | Arzobispado de Santiago | — |
| D8 | Del IV al XXXIV Domingo del Tiempo Ordinario, las lecturas son texto de relleno y 30 misas comparten la misma colecta. ¿De dónde tomar los propios correctos? | Contenido incompleto | Se resuelve con B2 y B5 | — |
| D10 | ¿Dónde guardar la copia de las páginas de Eucaristía Diaria mientras se prepara la app? | Los textos tienen derechos de autor | Decisión interna | Resuelta (31-10-2026): el repositorio se hizo privado y las páginas se guardan en él, solo para preparar la app. Al pedir el permiso (D3), mencionar que se guardó esta copia de trabajo |
| D11 | La página del Jueves Santo de 2025 en Eucaristía Diaria no trae la Misa Crismal (las de 2024 y 2026 sí). ¿Es habitual? ¿Dónde está la Crismal ese año? | Hueco en la fuente | Arzobispado de Santiago | — |
| D12 | Revisar la «Guía para entender la Misa» (`guia_aprendizaje.html`). Verificar en especial lo que no viene de la IGMR: el orden y los límites de los tiempos, la regla de la Pascua, qué celebraciones son fijas y cuáles móviles, cuándo se lee San Juan, el año par/impar de las ferias, y la precedencia de los domingos. Agregar números de párrafo de N3 y N7 | La guía se redactó con la IGMR (verificada en el texto del proyecto) y, para lo demás, con conocimiento general no cotejado con N3 y N7 | Liturgista; cotejo con N3 y N7 | — |
| D13 | Errores encontrados en las páginas de Eucaristía Diaria al extraer los textos (31-10-2026): XVI Domingo T. O. (2025 y 2026) rotula la poscomunión como «Oración sobre las ofrendas»; XXXIII Domingo, 15-11-2026: falta la colecta y la antífona de entrada termina en «pondré fin a» (sin «su cautiverio.»); Navidad 25-12-2025: solo trae las misas de la Vigilia (incompleta) y de la Noche (sin oraciones finales); Jueves Santo 28-03-2024: la Misa de la Cena del Señor solo trae los ritos iniciales; Jueves Santo 17-04-2025: no trae la Misa Crismal; Corpus 2024: «saciamos» por «saciarnos». ¿Les sirve que les enviemos la lista? | Para elegir el texto correcto y para colaborar con la fuente | Arzobispado de Santiago | — |
| D14 | Diferencias de texto entre años en Eucaristía Diaria: antífona de entrada del XIII Domingo T. O. («Pueblos todos, batan palmas. Aclamen a Dios…» en 2026; «Todos los pueblos aplaudan y aclamen al Señor…» en 2022 y 2024); «Nombre» / «nombre» y «Eucaristía» / «eucaristía» en colectas y poscomuniones. ¿Cuál es el texto del Misal del Cono Sur? | Elegir el texto correcto | Misal impreso (B2) | — |
| D9 | El Sábado Santo, la app muestra una meditación (Oficio de Lecturas) en lugar de una misa. ¿Es adecuado presentarlo así? | Coherencia con el Misal | Liturgista | — |
