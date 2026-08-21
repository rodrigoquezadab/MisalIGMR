# Contexto del Proyecto: Ordinario de la Misa con IGMR

## 1. Prompt Inicial / Requerimientos Fundacionales

El proyecto se originó con el siguiente requerimiento explícito:

> *"Quiero crear un sitio web que tenga todas las partes de la misa ordenadas como aparece en el misal, si bien existen diferentes misas usaremos una estándar del tiempo ordinario, debe aparecer las partes separadas por títulos según la parte de la misa y estos títulos deben estar numerados, debe aparecer el texto de forma clara con la capacidad de ampliar la letra o reducirla según necesidad del usuario. En cada parte de la misa y donde corresponda debemos incluir todo la instrucción general del misal romano, la idea es poder tener todas las instrucciones, también según su temática, en cada sección de la misa y sin dejar nada fuera, para poder saber qué elementos corresponden en cada parte de la misa, estas deben aparecer con títulos y colapsables que permitan ver las instrucciones. Utiliza la referencia web del misal romano [https://seminariobogota.arquibogota.org.co/sites/default/files/inline-files/misal-romanopdf.pdf](https://seminariobogota.arquibogota.org.co/sites/default/files/inline-files/misal-romanopdf.pdf) y la web del la instrucción general del misal romano [https://www.vatican.va/roman_curia/congregations/ccdds/documents/rc_con_ccdds_doc_20030317_ordinamento-messale_sp.html](https://www.vatican.va/roman_curia/congregations/ccdds/documents/rc_con_ccdds_doc_20030317_ordinamento-messale_sp.html)"*

---

## 2. Fuentes y Documentos de Referencia
1. **Misal Romano (Edición típica para Tiempo Ordinario)**:
   - Enlace oficial / referencia: [Misal Romano PDF (Seminario Conciliar de Bogotá)](https://seminariobogota.arquibogota.org.co/sites/default/files/inline-files/misal-romanopdf.pdf)
   - Uso: Estructura del Ordinario de la Misa, oraciones del sacerdote, rúbricas ceremoniales, diálogos y respuestas de la asamblea.
2. **Instrucción General del Misal Romano (IGMR)**:
   - Enlace oficial del Vaticano: [Instrucción General del Misal Romano - Congregación para el Culto Divino y la Disciplina de los Sacramentos](https://www.vatican.va/roman_curia/congregations/ccdds/documents/rc_con_ccdds_doc_20030317_ordinamento-messale_sp.html)
   - Uso: Fundamentación teológica, normas litúrgicas, disposiciones de posturas corporales y detalles de cada rito integrados de forma exhaustiva y temática.
3. **Misal Romano (Recursos Litúrgicos - Liturgia Papal)**:
   - Enlace de referencia: [Misal Romano en Liturgia Papal](https://liturgiapapal.org/index.php/recursos-lit%C3%BArgicos/libros-lit%C3%BArgicos/604-misal-romano.html)
   - Uso: Consulta de rúbricas ceremoniales completas, oraciones secretas del celebrante, ordo missae y fórmulas alternativas.

---

## 3. Especificaciones Funcionales y de Diseño

| Requisito del Prompt | Implementación en la Web |
| :--- | :--- |
| **Catálogo completo de Misas del Año Litúrgico** | Formularios completos para **todas las Misas y Tiempos Litúrgicos**: Tiempo Ordinario (34 Domingos completos hasta Cristo Rey), Tiempo de Adviento (I al IV Domingo), Tiempo de Navidad (Medianoche / Nochebuena, Epifanía), Tiempo de Cuaresma (Miércoles de Ceniza, Domingo de Ramos), Tiempo Pascual (Domingo de Pascua, Domingo de Pentecostés). Cada Misa incluye sus textos propios: Antífonas de entrada y comunión, Colecta, I Lectura, Salmo Responsorial con respuesta y estrofas, II Lectura, Aclamación/Aleluya, Santo Evangelio, Oración sobre las Ofrendas, Prefacios Propios y Oración después de la Comunión. |
| **Índice Litúrgico Desplegable (Drawer)** | Panel lateral accesible desde la barra superior (`📑 Índice de Misas`), con búsqueda en tiempo real, organización por tiempos litúrgicos y distintivos visuales de color litúrgico. |
| **4 Plegarias Eucarísticas Completas (I, II, III, IV)** | Selector instantáneo en la barra de herramientas para conmutar entre el Canon Romano (I), Plegaria Eucarística II, Plegaria Eucarística III y Plegaria Eucarística IV, con todas sus oraciones secretas, epíclesis, consagración, memoriales, intercesiones y doxología. |
| **Títulos numerados y categorizados** | Estructura jerárquica: `0. Proemio y Principios Generales`, `1. Ritos Iniciales`, `1.1 Entrada...`, `2. Liturgia de la Palabra`, `3. Liturgia Eucarística`, `4. Rito de Conclusión`, `5. Normas Complementarias de la IGMR`. |
| **Control de tamaño de letra** | Barra fija con botones `A -`, `A` (reset 18px), `A +` con límites accesibles (14px - 28px). |
| **Instrucciones IGMR exhaustivas (1 al 399)** | **Integración literal e íntegra del 100% de la IGMR** (Proemio y los 9 Capítulos completos, párrafos 1 al 399 sin omisiones ni resúmenes). |
| **IGMR colapsables con títulos** | Elementos semánticos `<details>` y `<summary>` con flecha indicadora y botones globales "Expandir todas las IGMR / Colapsar todas las IGMR". |
| **Referencias interactivas e inspección instantánea** | Todos los numerales de la IGMR citados en el texto litúrgico (ej. `IGMR 43`, `IGMR 152`) son **botones interactivos (`.igmr-badge`)**. Al hacer clic en cualquiera de ellos, se abre de inmediato una **ventana modal con el texto íntegro y literal del numeral**, junto con un botón para **saltar directamente a su ubicación en el Misal** con apertura automática del panel y animación de resaltado. |
| **Modo Oscuro por defecto** | Paleta litúrgica oscura de alto contraste (`#121316`) con botón de conmutación y persistencia (`localStorage`). |

---

## 4. Arquitectura del Archivo `misal.html`

- **Naturaleza**: Archivo único y autocontenido (`misal.html`) para máxima portabilidad (sin servidor ni dependencias externas).
- **Semántica HTML5**: `<header>`, `<aside id="liturgyDrawer">`, `<div class="toolbar-container">`, `<main id="content">`, `<section class="mass-section">`, `<details>`, `<summary>`, `<div id="igmrModal">`, `<footer>`.
- **Diseño CSS**:
  - Variables personalizadas (`:root` y `[data-theme="light"]`).
  - Paleta litúrgica cuidada: rojo litúrgico / coral para rúbricas (`.rubric`), azul suave para títulos de ministros (`.speaker`), blanco/negro contrastado para la asamblea (`.response`).
  - Panel deslizante lateral (*drawer*) con desenfoque de fondo y transiciones de aceleración suave.
  - Ventana modal con fondo desenfocado (`backdrop-filter`), animaciones fluidas y resaltado dinámico (`igmr-highlight-pulse`).
- **Lógica JavaScript**:
  - `populateSelectors()` / `selectMass(massId)` / `selectPrayer(prayerId)`: Actualización reactiva instantánea del formulario litúrgico, lecturas bíblicas, oraciones y prefacios sin recargar la página.
  - `toggleDrawer(state)` / `filterDrawer()`: Navegación y filtrado en el catálogo completo de Misas.
  - `changeFontSize(delta)` / `resetFontSize()`: Ajuste dinámico del tamaño tipográfico.
  - `toggleAllDetails(shouldOpen)`: Apertura o cierre masivo de los paneles de instrucción.
  - `showIGMR(num)` / `closeIGMRModal()` / `jumpToIGMR()`: Motor de consulta rápida y navegación contextual a cualquier numeral de la IGMR.
  - `initTheme()`, `setTheme(theme)`, `toggleTheme()`: Control de tema claro/oscuro y almacenamiento local.

---

## 5. Distribución Temática de la IGMR Íntegra (nn. 1 al 399)

1. **0. Proemio y Principios Generales**:
   - Proemio (nn. 1-15).
   - Cap. I: Importancia y dignidad de la celebración eucarística (nn. 16-26).
2. **1. Ritos Iniciales**:
   - Estructura general y posturas de la asamblea (nn. 27-45).
   - Naturaleza de los Ritos Iniciales (n. 46).
   - 1.1 Entrada, procesión y reverencia al altar (nn. 47-49) y Disposición del altar e iglesia (nn. 288-318).
   - 1.2 Saludo Inicial (n. 50).
   - 1.3 Acto Penitencial (n. 51).
   - 1.4 Señor, ten piedad (n. 52).
   - 1.5 Gloria in excelsis (n. 53).
   - 1.6 Oración Colecta (n. 54).
3. **2. Liturgia de la Palabra**:
   - Naturaleza de la Liturgia de la Palabra y silencio (nn. 55-56).
   - Ministerios y lectores (nn. 91-111).
   - 2.1 Primera Lectura (n. 57).
   - 2.2 Salmo Responsorial (n. 61).
   - 2.3 Segunda Lectura (nn. 58-59).
   - 2.4 Aclamación / Aleluya (nn. 62-64).
   - 2.5 Proclamación del Santo Evangelio (n. 60, 134-135).
   - 2.6 Homilía y silencio sagrado (nn. 65-66, 136).
   - 2.7 Profesión de Fe / Credo (nn. 67-68, 137).
   - 2.8 Oración Universal o de los Fieles (nn. 69-71, 138).
4. **3. Liturgia Eucarística**:
   - Estructura general de la Liturgia Eucarística (n. 72), Formas de celebrar (nn. 112-133), Pan, Vino y Vasos sagrados (nn. 319-351).
   - 3.1 Preparación de los Dones / Ofertorio (nn. 73-76, 139-145).
   - 3.2 Oración sobre las Ofrendas (n. 77, 146).
   - 3.3 Plegaria Eucarística y Concelebración (nn. 78-79, 147-151, 209-236).
   - 3.4 Rito de la Comunión y Comunión bajo dos especies (nn. 80-88, 152-163, 281-287).
   - 3.5 Oración después de la Comunión (n. 89, 164-165).
5. **4. Rito de Conclusión**:
   - Rito de conclusión, bendición y envío (nn. 90, 166-170).
   - Misa con diácono y otros ministros (nn. 171-208).
   - Concelebración conclusiones (nn. 237-251).
   - Misa con un solo ministro (nn. 252-272).
   - Normas generales: incienso, reverencias, purificaciones (nn. 273-280).
6. **5. Normas Complementarias de la IGMR**:
   - Cap. VII: Elección de la Misa y de sus partes (nn. 352-367).
   - Cap. VIII: Misas por diversas necesidades y difuntos (nn. 368-385).
   - Cap. IX: Adaptaciones de los Obispos y Conferencias Episcopales (nn. 386-399).
