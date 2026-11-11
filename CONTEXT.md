# Contexto del Proyecto: Misal Romano Digital con IGMR Íntegra

## 1. Misión y Requerimientos Fundacionales

El proyecto tiene como objetivo ofrecer una plataforma litúrgica y pastoral completa, interactiva y rigurosamente fiel al Magisterio y las normas litúrgicas de la **Iglesia Católica Apostólica Romana**, reuniendo en una sola aplicación web autocontenida:

1. El **Ordinario de la Misa** íntegro según la *Tercera Edición Típica del Misal Romano*.
2. El **Catálogo Completo del Año Litúrgico** con **74 celebraciones concretas**, cada una con sus textos propios completos (Antífona de Entrada, Colecta, I Lectura, Salmo Responsorial con respuesta y estrofas, II Lectura, Aclamación/Aleluya, Santo Evangelio, Oración sobre las Ofrendas, Prefacio Propio, Antífona de Comunión y Postcomunión).
3. La **totalidad de los 399 numerales de la Instrucción General del Misal Romano (IGMR)** integrados temáticamente en cada sección de la Misa y accesibles mediante botones interactivos (`.igmr-badge`) y ventana modal de inspección instantánea.
4. Las **4 Plegarias Eucarísticas Oficiales** (Canon Romano I, Plegaria II, Plegaria III y Plegaria IV) con asignación automática canónica según la **IGMR n. 365**.
5. Los **28 Prefacios Litúrgicos** correspondientes a todos los Tiempos, Solemnidades y Fiestas del Año Cristiano.
6. **Estructuras litúrgicas canónicas adaptativas**:
   - Misa Ordinaria (72 celebraciones).
   - **Viernes Santo en la Pasión del Señor**: Adaptación estricta a las 4 partes canónicas (Liturgia de la Palabra con Pasión de San Juan y las 10 Solemnes Plegarias Universales, Adoración de la Santa Cruz, Sagrada Comunión con la Reserva del Jueves Santo y Despedida en Silencio), suprimiendo la Liturgia Eucarística y la Consagración según prescribe el Misal Romano.
   - **Sábado Santo**: Celebración alitúrgica de silencio y meditación junto al Sepulcro del Señor.
7. **Diseño Mobile-First y Portabilidad Absoluta**: Aplicación responsiva con aislamiento estricto entre la Portada/Guía de Inicio y la Celebración, conmutador de tema oscuro/claro, escalador de letra para ambón/altar y panel lateral con buscador en tiempo real.

---

## 2. Fuentes Oficiales y Documentos de Referencia

| Documento | Entidad Emisora / Fuente | Uso en la Aplicación |
| :--- | :--- | :--- |
| **Misal Romano (Tercera Edición Típica en Español)** | Santa Sede / Congregación para el Culto Divino y la Disciplina de los Sacramentos | Textos litúrgicos del Ordinario, oraciones presidenciales, rúbricas ceremoniales, diálogos, plegarias eucarísticas y formularios propios de los 74 días litúrgicos. [Seminario Conciliar de Bogotá](https://seminariobogota.arquibogota.org.co/sites/default/files/inline-files/misal-romanopdf.pdf) |
| **Instrucción General del Misal Romano (IGMR)** | Congregación para el Culto Divino y la Disciplina de los Sacramentos (17 de marzo de 2003 / 2008) | Incorporación íntegra de los 399 numerales (Proemio y Capítulos I al IX), normativa de posturas corporales, rúbricas y criterios de elección litúrgica. [Sitio Oficial del Vaticano](https://www.vatican.va/roman_curia/congregations/ccdds/documents/rc_con_ccdds_doc_20030317_ordinamento-messale_sp.html) |
| **Normas Universales sobre el Año Litúrgico y el Calendario Romano General** | Santa Sede | Ordenación canónica de los 8 Tiempos Litúrgicos, precedencias y colores litúrgicos. |
| **Recursos Litúrgicos - Liturgia Papal** | Liturgia Papal | Cotejo y verificación de rúbricas ceremoniales, oraciones secretas del celebrante y fórmulas alternativas. [Liturgia Papal](https://liturgiapapal.org/index.php/recursos-lit%C3%BArgicos/libros-lit%C3%BArgicos/604-misal-romano.html) |

### 2.1. Pendiente: los textos no corresponden aún a la edición aprobada para Chile

- **Edición vigente en Chile**: por el decreto n.º 438 de la Conferencia Episcopal de Chile, rige la traducción castellana de la Tercera Edición Típica editada en Argentina conjuntamente para Argentina, Bolivia, Chile, Paraguay y Uruguay (edición del Cono Sur), oficial y obligatoria desde el Primer Domingo de Adviento de 2010 ([iglesia.cl, 05-10-2009](https://www.iglesia.cl/detalle_noticia.php?id=10375)). Esa edición usa «ustedes» y deroga «vosotros» ([decreto de la CEA](https://episcopado.org/ver/426)).
- **Fuentes actuales del proyecto**: la IGMR de `igmr_vatican.html` es la traducción de la Conferencia Episcopal de Colombia (© 2007) y los textos del Misal provienen de la edición colombiana (PDF del Seminario de Bogotá). El Ordinario y las lecturas usan «vosotros» («El Señor esté con vosotros»). Coincide con Chile en «derramada por muchos».
- **Textos propios incompletos**: del IV Domingo del Tiempo Ordinario a Cristo Rey (31 misas), las lecturas de `liturgia_db.json` son textos de relleno («Lectura propia del … Domingo del Tiempo Ordinario») y 30 de ellas comparten la misma Colecta y Antífona de Entrada. El Domingo I del Tiempo Ordinario tiene como I Lectura 1 Samuel 1, 1-8, que es de feria.
- **Siguiente paso**: obtener una fuente digital de la edición del Cono Sur (Misal Romano y Leccionarios) y reemplazar con ella el Ordinario, la IGMR, las lecturas y los propios. No completar los textos de memoria.

### 2.2. Revisión del «vosotros» y fuentes para Chile (31-10-2026)

**Dónde está el «vosotros»** (formas de 2.ª persona plural: vosotros, os, vuestro, habéis, tomad, mirad…; recuento aproximado):

| Texto | Formas | Fuente que corresponde en Chile |
| :--- | ---: | :--- |
| Ordinario fijo en `build_complete_app.js` (saludos, «Orad, hermanos», consagración, despedida) | ~25 | Misal Romano, edición del Cono Sur |
| II Lectura | ~115 | Leccionario (texto bíblico de *El Libro del Pueblo de Dios*) |
| Evangelio | ~70 | Leccionario |
| I Lectura | ~40 | Leccionario |
| Aleluya / aclamación | ~23 | Leccionario |
| Salmo responsorial | ~16 | Leccionario |
| Antífonas de entrada y de comunión, oración sobre las ofrendas | ~31 | Misal Romano, edición del Cono Sur |
| Colectas, poscomuniones, prefacios | 0 | (sin cambios de persona, pero igual deben cotejarse con la edición del Cono Sur) |
| IGMR (`igmr_full_399.json`) | pocas, casi todas citas («Tomad y comed») | IGMR de la edición argentina |

No basta con cambiar «vosotros» por «ustedes»: la edición del Cono Sur es otra traducción (p. ej., Gloria «a los hombres que ama el Señor», Confiteor «ante ustedes, hermanos… de pensamiento, palabra, obra y omisión»), y las lecturas usan otra versión bíblica. Hay que reemplazar los textos completos desde la fuente.

**Fuentes encontradas**

1. **Eucaristía Diaria** — https://www.eucaristiadiaria.cl — Departamento de Liturgia del Arzobispado de Santiago; el portal de la Conferencia Episcopal (iglesia.cl, «Evangelio del día») toma sus textos de aquí. Publica para cada día el formulario completo (antífonas, colecta, lecturas, salmo, aclamación, evangelio, ofrendas, prefacio, comunión, poscomunión) ya en la edición chilena («ustedes»).
   - Día: `https://www.eucaristiadiaria.cl/dia_cal.php?fecha=AAAA-MM-DD`. El calendario (`calendario.php`) lista unos 3.900 días hasta el 30-11-2026, lo que cubre los tres ciclos dominicales.
   - Ordinario: `https://www.eucaristiadiaria.cl/ordinario.php`. Ojo: es una transcripción con errores; trae «El Señor esté con vosotros» dos veces (diálogo del prefacio de la Plegaria III y de una plegaria para diversas circunstancias), una nota editorial interna («PONER PLEGARIA EUCARÍSTICA I, III…») y no trae todas las plegarias. Sirve para comparar, no como única fuente del Ordinario.
   - Los textos son de uso pastoral; se venden impresos por Ediciones San José. Antes de copiarlos al sitio público hay que pedir autorización (contacto: pastoralliturgica@iglesiadedesantiago.cl).
2. **Ordo litúrgico de la Conferencia Episcopal de Chile** — https://www.iglesia.cl/nuestra_liturgia.php (PDF por tiempo, p. ej. `docs/2026-Ordinario-II.pdf`). Sirve para verificar el calendario chileno, no trae los textos.
3. **Misal Romano, edición del Cono Sur** — Oficina del Libro de la Conferencia Episcopal Argentina (https://episcopado.org). Es la fuente oficial del Ordinario, las plegarias, los prefacios y los propios; solo impresa (no se encontró versión digital oficial). Las copias en Scribd/Internet Archive no son fuentes confiables.
4. **IGMR, edición argentina** — https://www.curas.com.ar/Misal3/IGMR3.htm dice ser la 3.ª edición, pero no indica año ni aprobación, y no respondió a descargas directas (503). Pendiente encontrar una fuente con datos de edición; mientras tanto se mantiene la IGMR del Vaticano (traducción colombiana), que no es texto litúrgico proclamado.

**Decisión (31-10-2026)**: seguir trabajando con estos textos hasta tener una app correcta; entonces mostrarla y pedir permiso. El plan de trabajo está en `MEMORIA_DE_TRABAJO.md` y las fuentes, normas y dudas en `FUENTES_Y_CONSULTAS.md`.

---

## 3. Especificaciones Funcionales y de Arquitectura

### 3.1. Aislamiento Estricto de Vistas (Home View vs. Mass View)
- **Portada y Guía de Inicio (`#homeView`)**:
  - Al iniciar la aplicación, se muestra **únicamente** la portada informativa con la guía del Misal, resumen de características y las tarjetas de exploración por tiempos litúrgicos.
  - La barra de herramientas de la Misa (`#mainToolbar`) y los textos de la celebración permanecen ocultos para evitar confusión o filtración visual de partes de la Misa antes de elegir una celebración.
  - El logotipo superior `MISAL ROMANO ✠` y la opción `🏠 Portada y Guía de Inicio` en el catálogo lateral permiten regresar y resetear el índice en cualquier momento.
- **Vista de la Celebración (`#massView`)**:
  - Se activa inmediatamente al seleccionar cualquier Misa desde el selector superior, el catálogo desplegable o las tarjetas de la portada.
  - Muestra el título y distintivo litúrgico de la Misa en la cabecera superior y despliega la barra de herramientas de lectura.
  - **Barra de Salto Rápido Litúrgico (`#sectionJumpNav`)**: Barra flotante sticky que permite desplazarse instantáneamente entre las partes de la celebración (`❖ Ritos Iniciales`, `📖 Palabra`, `🍞 Eucaristía`, `🍷 Comunión`, `✝️ Conclusión`, `📜 IGMR`), adaptándose automáticamente en **Viernes Santo** a sus 4 partes canónicas. Incluye *ScrollSpy* interactivo.

### 3.2. Doble Selector en Cascada y Catálogo Lateral Optimizado
Para facilitar la navegación entre las 74 celebraciones:
1. **Selector de Tiempo Litúrgico (`#quickSeasonSelect`)**:
   - `❖ Todos los Tiempos (74)`
   - `🟣 Adviento (4)`
   - `⚪ Navidad y Epifanía (8)`
   - `🟣 Cuaresma (6)`
   - `🔴 Semana Santa y Triduo (9)`
   - `⚪ Pascua (10)`
   - `🟢 Tiempo Ordinario (34)`
   - `⚪ Solemnidades (3)`
2. **Selector de Misa Filtrado (`#quickMassSelect`)**:
   - Se actualiza y selecciona automáticamente al cambiar el tiempo litúrgico, mostrando únicamente las celebraciones pertenecientes al tiempo elegido.
   - Sincronización bidireccional entre la cabecera, el catálogo lateral y los selectores.
3. **Catálogo Lateral (`#liturgyDrawer`)**:
   - Buscador en tiempo real con botón de limpieza instantánea (`✕`).
   - Chips de filtrado rápido por tiempo litúrgico.
   - Contador de celebraciones encontradas en tiempo real.
4. **Ergonomía de Altar y Lectura**:
   - Indicador visual del tamaño de letra actual (ej. `18px`).
   - Atajos de teclado: `/` o `Ctrl+K` para abrir el índice, `T` para alternar tema claro/oscuro, `Esc` para cerrar modales.
   - Tipografía editorial sagrada: **Cinzel** para títulos sacros y latinos, e **Inter** para oraciones y rúbricas.

### 3.3. Estructuras Litúrgicas Canónicas Adaptativas

#### A. Celebraciones Eucarísticas Estándar (72 Misas)
Se estructuran en 5 secciones numeradas y categorizadas:
- **0. Proemio y Principios Generales** (IGMR 1-26).
- **1. Ritos Iniciales** (IGMR 27-54, 288-318): Entrada con Antífona Propia, Saludo, Acto Penitencial (Fórmulas 1, 2 y 3), Kyrie, Gloria (según el tiempo litúrgico) y Oración Colecta propia.
- **2. Liturgia de la Palabra** (IGMR 55-71, 91-111, 134-138): I Lectura con cita bíblica completa, Salmo Responsorial con respuesta y estrofas, II Lectura, Aclamación antes del Evangelio (Aleluya o versículo cuaresmal), Santo Evangelio, Homilía, Profesión de Fe (Credo Niceno-Constantinopolitano o Apostólico) y Oración de los Fieles.
- **3. Liturgia Eucarística** (IGMR 72-89, 112-133, 139-165, 209-236, 281-287, 319-351): Preparación de los Dones, Oración sobre las Ofrendas propia, Diálogo del Prefacio, Prefacio Propio (de los 28 prefacios), Sanctus, Plegaria Eucarística seleccionada (I, II, III o IV con rúbricas de consagración y genuflexión) y Rito de la Comunión (Padrenuestro, Embolismo, Rito de la Paz, Fracción del Pan, Cordero de Dios, Antífona de Comunión propia y Postcomunión propia).
- **4. Rito de Conclusión** (IGMR 90, 166-208, 237-280): Bendición sacerdotal y Despedida.
- **5. Normas Complementarias de la IGMR** (IGMR 352-399): Capítulos VII, VIII y IX para referencia canónica permanente.

#### B. Viernes Santo en la Pasión del Señor (`pas-viernes-santo`)
En estricto cumplimiento del Misal Romano, se suprime la Liturgia Eucarística, el ofertorio, las plegarias eucarísticas y la consagración, desplegando sus **4 partes canónicas**:
1. **Primera Parte: Liturgia de la Palabra**:
   - Entrada en silencio, postración rostro en tierra de los ministros y Oración Colecta sin saludo previo.
   - I Lectura (*Isaías 52, 13 — 53, 12: Cuarto Cántico del Siervo*).
   - Salmo 30 (*«Padre, a tus manos encomiendo mi espíritu»*).
   - II Lectura (*Hebreos 4, 14-16; 5, 7-9: Jesús, Sumo Sacerdote compasivo*).
   - Aclamación a Cristo en su Pasión (*Flp 2, 8-9*).
   - Proclamación de la **Pasión de nuestro Señor Jesucristo según San Juan** (*Jn 18, 1 — 19, 42*) con pausa y arrodillamiento tras la muerte del Señor.
   - **Solemne Oración Universal (Las 10 Grandes Plegarias)**: por la Santa Iglesia, el Papa, el clero y fieles, los catecúmenos, la unidad de los cristianos, los judíos, los que no creen en Cristo, los que no creen en Dios, los gobernantes y los que sufren.
2. **Segunda Parte: Adoración de la Santa Cruz**:
   - Triple ostensión con el canto solemne: *«¡Mirad el árbol de la Cruz, donde estuvo clavada la salvación del mundo! — ¡Venid a adorarlo!»*.
   - Rito de veneración con los *Improperios* y el himno *Crux Fidelis*.
3. **Tercera Parte: Sagrada Comunión**:
   - Traslado del Santísimo Sacramento desde el Monumento (formas consagradas el Jueves Santo).
   - Padrenuestro, Embolismo, *Cordero de Dios*, Comunión de los fieles y Oración Postcomunión.
4. **Cuarta Parte: Despedida en Silencio**:
   - Oración sobre el pueblo, despojo del altar y salida en silencio (sin bendición final ordinaria).

#### C. Sábado Santo (`pas-sabado-santo`)
- Presenta la meditación litúrgica patrística de la Sepultura del Señor y el Oficio de Lecturas («Un gran silencio envuelve hoy la tierra»), recordando el carácter alitúrgico del día hasta la llegada de la Solemne Vigilia Pascual.

### 3.4. Celebración de Hoy (`#todayCard`)
- La portada muestra qué Misa del catálogo corresponde hoy; si hoy es una feria sin misa propia en el catálogo, muestra la próxima (siempre dentro de la semana, porque todos los domingos están). Incluye fecha, color, ciclo dominical (A, B o C) y un botón para abrirla.
- Cuando el día tiene más de una Misa (24 y 25 de diciembre, Jueves Santo, Sábado Santo, Domingo de Pascua) ofrece las demás como botones secundarios.
- Si una fiesta del Señor o una solemnidad del Calendario Romano General cae en domingo del Tiempo Ordinario (p. ej., Todos los Santos el 1 de noviembre de 2026), avisa que esa misa reemplaza al domingo y que no está en el catálogo.
- La lógica vive en `liturgical_calendar.js` (Pascua por cómputo gregoriano; Epifanía el domingo entre el 2 y el 8 de enero, Ascensión el VII Domingo de Pascua y Corpus Christi el domingo, como en Chile) y el build la incrusta en la página. No cubre ferias ni el santoral.
- `node test_calendar.js` la prueba con fechas conocidas y un barrido de 2000 a 2100 (todo domingo tiene misa, todo id existe en `liturgia_db.json`, ningún domingo del Tiempo Ordinario se repite en un año). El workflow de despliegue corre esta prueba antes de publicar.
- Nunca se llega a `to-1` (el Domingo I lo ocupa el Bautismo del Señor) ni a `pas-7` (en Chile la Ascensión se celebra ese domingo).

### 3.5. Guía para Aprender (`#learnView`)
- Vista propia (`guia_aprendizaje.html`, insertada por el build), accesible desde el botón «📘 Guía para entender la Misa y el año litúrgico» de la portada y desde el índice lateral.
- Explica la intención de la app (aprender las partes de la Misa y lo que la IGMR espera de la asamblea), cómo participa la asamblea, el año litúrgico, las fechas fijas y móviles, los ciclos A/B/C con su evangelista, los años pares e impares de las ferias, los grados de las celebraciones y las otras Misas del Misal.
- Muestra en vivo el ciclo dominical, el año I/II y una tabla con las fechas móviles del año (`LiturgicalCalendar.movableDates`, `weekdayCycle`).
- Los números de la IGMR citados se convierten en enlaces a la ventana de consulta. Lo que no proviene de la IGMR está pendiente de cotejo (`FUENTES_Y_CONSULTAS.md`, D12).

### 3.6. Textos para Chile y Selector de Ciclo (`#cycleBar`)
- `textos_chile.json` (generado por `fuentes/unir_textos.js` a partir de las páginas de Eucaristía Diaria) trae, para 65 celebraciones, las antífonas y oraciones (comunes a los tres ciclos) y, por ciclo A/B/C, las lecturas, el salmo, la aclamación, la secuencia, el evangelio y la antífona de comunión, cada uno con la URL y fecha de su página de origen.
- `app_textos.js` (incrustado por el build) dibuja los textos propios de cada misa: usa los de Chile cuando existen y, si no, los anteriores con la etiqueta «texto provisional».
- Al comienzo de la Liturgia de la Palabra, la barra de ciclo muestra los botones A (Mateo), B (Marcos) y C (Lucas); abre en el ciclo de la próxima vez que se celebre esa misa, indica la fecha y enlaza la página de origen. Si las lecturas no cambian entre ciclos (Ceniza, Navidad), lo dice en lugar de mostrar botones.
- Aún con textos provisionales: Ramos, Crismal, Jueves Santo, Viernes Santo, Vigilia Pascual; el Ordinario fijo.
- `node test_textos.js` verifica la estructura, las fuentes, la ausencia de «vosotros» y que el evangelio de cada domingo del Tiempo Ordinario sea del evangelista de su ciclo.

### 3.7. Seguir la Misa (`#followView`)
- Dos Misas genéricas, **dominical** y **de semana**, como guía y lista de verificación de sus partes. Se abren con los botones «Misa dominical» y «Misa de semana» bajo el título de la portada (y desde el índice lateral).
- Partes numeradas (1, 1.1, 1.2… 2, 2.1…; la numeración se recalcula en la Misa de semana). Cada parte: título, aclaración bajo el título si hace falta, **Comienza** y **Termina** con la frase exacta del Misal («…» si continúa) y una casilla. Las partes sin palabras fijas (entrada, salmo, homilía, elevaciones…) solo llevan la aclaración. La siguiente pendiente queda resaltada.
- La **Consagración** es un bloque propio y destacado: pan y vino sobre el altar y las palabras completas sobre el pan y el cáliz, marcados «Esencial»; al marcarlos aparece «Consagración verificada».
- Dominical: 36 partes (con Gloria, segunda lectura y Credo). De semana: 33 (sin ellos; homilía y oración universal «si la hay»). Las frases de la Plegaria (epíclesis, inicio de la consagración, intercesiones) son de la Plegaria III, y se indica.
- El avance se guarda en el navegador durante el día, por separado para cada Misa.
- Datos: `verificador_datos.js` (cada paso conserva sus números IGMR, aunque no se muestran); HTML: `verificador_build.js`; comportamiento: `verificador_app.js`. `node test_verificador.js` comprueba que cada cita aparezca literalmente en el Ordinario guardado.

---

## 4. Asignación Canónica de Plegarias Eucarísticas (IGMR n. 365)

El sistema litúrgico implementa la regla de selección automática de la Plegaria Eucarística según la norma oficial de la Santa Sede:

| Criterio IGMR n. 365 | Plegaria Recomendada | Celebraciones Asignadas |
| :--- | :--- | :--- |
| **IGMR 365 a** (Canon Romano por solemnidades con partes propias de *Communicantes* y *Hanc igitur*) | **Plegaria Eucarística I (Canon Romano)** | Vigilia de Navidad, Nochebuena, Misa de la Aurora, Misa del Día, Santa María Madre de Dios, Epifanía, Domingo de Ramos, Misa Crismal, Jueves Santo en la Cena del Señor, Solemne Vigilia Pascual, Domingo de Pascua, Ascensión y Pentecostés. |
| **IGMR 365 b** (Aconsejada para ferias, días penitenciales y celebraciones entre semana) | **Plegaria Eucarística II** | Miércoles de Ceniza, Lunes Santo, Martes Santo y Miércoles Santo. |
| **IGMR 365 c** (Preferida para los Domingos y Fiestas por su teología eclesial y de la asamblea) | **Plegaria Eucarística III** | Domingos de Adviento, Navidad, Cuaresma, Pascua, Domingos del Tiempo Ordinario (I al XXXIV), Solemnidades de la Santísima Trinidad, Corpus Christi y Sagrado Corazón. |
| **IGMR 365 d** (Posee prefacio propio inmutable con resumen de la historia salvífica) | **Plegaria Eucarística IV** | Disponible para libre elección en misas con asambleas homogéneas y catequesis bíblica. |

---

## 5. Distribución Temática de la IGMR Íntegra (1 al 399)

La aplicación contiene el **100% de los 399 numerales oficiales**, cada uno en un solo lugar (el build avisa si falta o se repite alguno). Lo general va al comienzo; lo que la IGMR ordena para cada momento va junto a ese momento, agrupado por quién lo hace y en qué forma de celebración.

1. **0. Proemio y Principios Generales**: Proemio (nn. 1-15), Cap. I (nn. 16-26), Cap. II: estructura, elementos, posturas y silencio (nn. 27-45), Cap. III: oficios y ministerios (nn. 91-111), Cap. IV: formas de celebrar y preparación (nn. 112-119), funciones generales del diácono y del acólito (nn. 171, 187, 189), normas generales de la concelebración (nn. 199-209) y de la Misa con un solo ministro (nn. 252-254), Cap. V: iglesias (nn. 288-318) y Cap. VI: pan, vino, vasos y vestiduras (nn. 319-351).
2. **Cada momento de la Misa** (Ritos Iniciales, Liturgia de la Palabra, Liturgia Eucarística y Rito de Conclusión) muestra un bloque IGMR con estos grupos, según lo que diga la IGMR de ese momento:
   - *Sentido del rito*: Cap. II, nn. 46-90.
   - *Misa con pueblo: el sacerdote*: Cap. IV, nn. 120-170.
   - *Con diácono*: nn. 172-186.
   - *Lector y acólito*: nn. 188-198.
   - *Misa concelebrada*: nn. 210-251.
   - *Misa con un solo ministro*: nn. 255-272.
   - En la Entrada, los *gestos* (beso al altar, genuflexión, inclinación, incienso: nn. 273-277); en la Comunión, *fragmentos y purificación* (nn. 278-280) y *Comunión bajo las dos especies* (nn. 281-287).
   - El reparto exacto de cada numeral está en las llamadas `useMoment(...)` de `build_complete_app.js`.
3. **5. Normas Complementarias de la IGMR**:
   - Cap. VII: Elección de la Misa y de sus partes (nn. 352-367).
   - Cap. VIII: Misas por diversas necesidades y difuntos (nn. 368-385).
   - Cap. IX: Adaptaciones episcopales (nn. 386-399).

### 5.1. Depuración y Fidelidad Tipográfica de la IGMR
- **0 Entidades HTML residuales**: Todas las entidades de caracteres (como `&#x201c;`, `&#x201d;`, `&#x2014;`, `&uuml;`, `&ordm;`) han sido convertidas a caracteres tipográficos españoles estándar (`«...»`, `—`, `ü`, `º`, `ö`).
- **Eliminación de notas al pie en corchetes (`[n]`)**: Se suprimieron las 332 referencias bibliográficas/canónicas numéricas aisladas (ej. `[57]`, `[105]`) que obstaculizaban la lectura continua de las normas.
- **Títulos como encabezado del numeral siguiente**: `build_igmr_399.js` reconoce los títulos del documento («Entrada», «A) Misa sin diácono», «Plegaria Eucarística II»…) y los guarda en el campo `subsection` del numeral que introducen, en vez de dejarlos pegados al final del anterior. La ventana de consulta los muestra como subtítulo (p. ej., n. 47: «III. Cada una de las partes de la Misa · A) Ritos iniciales · Entrada»).
- **Notas al pie fuera del texto**: la lectura termina en el n. 399; las notas que siguen ya no se agregan a su texto.

---

## 6. Pipeline de Compilación y Publicación

- **Base de datos litúrgica**: Generada por `build_liturgia_data.js` -> `liturgia_db.json`.
- **Compilador del sitio web**: Ejecutado por `node build_complete_app.js` -> Genera `misal.html` e `index.html` (incrusta `liturgical_calendar.js`).
- **Pruebas**: `node test_calendar.js`.
- **Sincronización**: `generate_full_misal.js` se mantiene en paridad con `build_complete_app.js`.
- **Despliegue y Hosting**: Repositorio Git alojado en GitHub y publicado de forma continua mediante GitHub Pages en:
  👉 **https://rodrigoquezadab.github.io/MisalIGMR/**
