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

---

## 3. Especificaciones Funcionales y de Arquitectura

### 3.1. Aislamiento Estricto de Vistas (Home View vs. Mass View)
- **Portada y Guía de Inicio (`#homeView`)**:
  - Al iniciar la aplicación, se muestra **únicamente** la portada informativa con la guía del Misal, resumen de características y las 6 tarjetas de exploración por tiempos litúrgicos.
  - La barra de herramientas de la Misa (`#mainToolbar`) y los textos de la celebración permanecen ocultos para evitar confusión o filtración visual de partes de la Misa antes de elegir una celebración.
  - El logotipo superior `MISAL ROMANO ✠` y la opción `🏠 Portada y Guía de Inicio` en el catálogo lateral permiten regresar y resetear el índice en cualquier momento.
- **Vista de la Celebración (`#massView`)**:
  - Se activa inmediatamente al seleccionar cualquier Misa desde el selector superior, el catálogo desplegable o las tarjetas de la portada.
  - Muestra el título y distintivo litúrgico de la Misa en la cabecera superior y despliega la barra de herramientas de lectura.

### 3.2. Doble Selector en Cascada (Tiempo Litúrgico ➔ Misa)
Para facilitar la navegación entre las 74 celebraciones sin necesidad de desplazarse por una lista interminable:
1. **Selector de Tiempo Litúrgico (`#quickSeasonSelect`)**:
   - `❖ Todos los Tiempos (74)`
   - `🟣 Adviento (4)`
   - `⚪ Navidad y Epifanía (8)`
   - `🟣 Cuaresma (7)`
   - `🔴 Semana Santa y Triduo (8)`
   - `⚪ Pascua (10)`
   - `🟢 Tiempo Ordinario (34)`
   - `⚪ Solemnidades (3)`
2. **Selector de Misa Filtrado (`#quickMassSelect`)**:
   - Se actualiza automáticamente al cambiar el tiempo litúrgico, mostrando únicamente las celebraciones pertenecientes al tiempo elegido.
   - Cuenta con sincronización bidireccional: al seleccionar una misa desde el índice lateral, el filtro de tiempo se auto-ajusta a la categoría correspondiente.

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

La aplicación contiene el **100% de los 399 numerales oficiales** distribuidos en concordancia exacta:

1. **0. Proemio y Principios Generales**:
   - Proemio (nn. 1-15).
   - Cap. I: Importancia y dignidad de la celebración eucarística (nn. 16-26).
2. **1. Ritos Iniciales**:
   - Estructura general y posturas de la asamblea (nn. 27-45).
   - Naturaleza de los Ritos Iniciales (n. 46).
   - Entrada, procesión y reverencia al altar (nn. 47-49) y Disposición del presbiterio e iglesia (nn. 288-318).
   - Saludo Inicial (n. 50), Acto Penitencial (n. 51), Kyrie (n. 52), Gloria (n. 53), Oración Colecta (n. 54).
3. **2. Liturgia de la Palabra**:
   - Naturaleza y silencio en la Palabra (nn. 55-56).
   - Ministerios y lectores (nn. 91-111).
   - I Lectura (n. 57), Salmo Responsorial (n. 61), II Lectura (nn. 58-59), Aclamación/Aleluya (nn. 62-64).
   - Proclamación del Evangelio y Ritos de ministros (nn. 60, 134-135).
   - Homilía (nn. 65-66, 136), Credo y reverencias (nn. 67-68, 137), Oración Universal (nn. 69-71, 138).
4. **3. Liturgia Eucarística**:
   - Estructura de la Liturgia Eucarística (n. 72), Formas de celebración (nn. 112-133), Pan, Vino y Vasos Sagrados (nn. 319-351).
   - Preparación de Dones y Ofertorio (nn. 73-76, 139-145), Oración sobre Ofrendas (nn. 77, 146).
   - Plegaria Eucarística y Concelebración (nn. 78-79, 147-151, 209-236).
   - Rito de la Comunión y Comunión bajo dos especies (nn. 80-88, 152-163, 281-287), Postcomunión (nn. 89, 164-165).
5. **4. Rito de Conclusión**:
   - Despedida y bendición (nn. 90, 166-170).
   - Misa con diácono y otros ministros (nn. 171-208).
   - Conclusiones de concelebración (nn. 237-251) y Misa con un solo ministro (nn. 252-272).
   - Incienso, reverencias y purificaciones (nn. 273-280).
6. **5. Normas Complementarias de la IGMR**:
   - Cap. VII: Elección de la Misa y de sus partes (nn. 352-367).
   - Cap. VIII: Misas por diversas necesidades y difuntos (nn. 368-385).
   - Cap. IX: Adaptaciones episcopales (nn. 386-399).

### 5.1. Depuración y Fidelidad Tipográfica de la IGMR
- **0 Entidades HTML residuales**: Todas las entidades de caracteres (como `&#x201c;`, `&#x201d;`, `&#x2014;`, `&uuml;`, `&ordm;`) han sido convertidas a caracteres tipográficos españoles estándar (`«...»`, `—`, `ü`, `º`, `ö`).
- **Eliminación de notas al pie en corchetes (`[n]`)**: Se suprimieron las 332 referencias bibliográficas/canónicas numéricas aisladas (ej. `[57]`, `[105]`) que obstaculizaban la lectura continua de las normas.
- **Supresión de títulos residuales**: Se limpiaron los encabezados de sección y notas de pie de página pegadas indebidamente al final de párrafos precedentes.

---

## 6. Pipeline de Compilación y Publicación

- **Base de datos litúrgica**: Generada por `build_liturgia_data.js` -> `liturgia_db.json`.
- **Compilador del sitio web**: Ejecutado por `node build_complete_app.js` -> Genera `misal.html` e `index.html`.
- **Sincronización**: `generate_full_misal.js` se mantiene en paridad con `build_complete_app.js`.
- **Despliegue y Hosting**: Repositorio Git alojado en GitHub y publicado de forma continua mediante GitHub Pages en:
  👉 **https://rodrigoquezadab.github.io/MisalIGMR/**
