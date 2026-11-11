// Datos de «Seguir la Misa»: dos Misas genéricas (dominical y de semana) como
// guía y lista de verificación de sus partes.
//
// Cada paso:
//   titulo        nombre de la parte (tituloSemana si cambia en la Misa de semana)
//   nota          aclaración o explicación; se muestra bajo el título
//   inicio, fin   frase EXACTA del Misal con la que comienza / termina la parte:
//                 { cita, fuente, sigue }  — sigue: true muestra «…» al final
//                 (la frase continúa). Sin frase fija, se omite y la nota explica.
//   palabras      true: palabras de la consagración (se muestran destacadas)
//   esencial      elemento sin el cual no hay consagración (materia y palabras)
//   domingo, semana  'no' si el paso no está en esa Misa (por omisión, está)
//   igmr          números de la IGMR que respaldan el paso (no se muestran)
//
// Fuentes de las frases (test_verificador.js comprueba que cada una aparezca
// literalmente en su fuente guardada):
//   'ord-7'  Ordinario de la Misa de Eucaristía Diaria, edición de septiembre de 2026
//            (fuentes/eucaristiadiaria/ordinario/id-7.html)
//   'ord-9'  ídem, edición de octubre de 2026 (id-9.html)
//   'dias'   páginas de los días (fuentes/eucaristiadiaria/paginas/)

const PARTES = [
  {
    id: 'iniciales', titulo: 'Ritos iniciales', pasos: [
      { id: 'entrada', titulo: 'Entrada', igmr: [47, 49],
        nota: 'Canto o antífona de entrada (propia de cada día) mientras avanza el sacerdote; saluda al altar con una inclinación profunda y lo besa.' },
      { id: 'saludo', titulo: 'Señal de la cruz y saludo', igmr: [50],
        inicio: { cita: 'En el nombre del Padre, y del Hijo, y del Espíritu Santo.', fuente: 'ord-9' },
        fin: { cita: 'Y con tu espíritu.', fuente: 'ord-7' } },
      { id: 'penitencial', titulo: 'Acto penitencial', igmr: [51],
        nota: 'Hay varias fórmulas; esta es la primera.',
        inicio: { cita: 'Hermanos: para celebrar dignamente estos sagrados misterios, reconozcamos nuestros pecados.', fuente: 'ord-7' },
        fin: { cita: 'Dios todopoderoso tenga misericordia de nosotros, perdone nuestros pecados y nos lleve a la vida eterna.', fuente: 'ord-7' } },
      { id: 'kyrie', titulo: 'Señor, ten piedad', igmr: [52],
        nota: 'Se omite si ya se dijo dentro del acto penitencial.',
        inicio: { cita: 'Señor, ten piedad', fuente: 'ord-7' },
        fin: { cita: 'Señor, ten piedad', fuente: 'ord-7' } },
      { id: 'gloria', titulo: 'Gloria', igmr: [53], semana: 'no',
        nota: 'No se dice en Adviento ni en Cuaresma.',
        inicio: { cita: 'Gloria a Dios en el cielo, y en la tierra paz a los hombres que ama el Señor.', fuente: 'ord-7' },
        fin: { cita: 'en la gloria de Dios Padre. Amén.', fuente: 'ord-7' } },
      { id: 'colecta', titulo: 'Oración colecta', igmr: [54],
        nota: 'Oración propia del día, después de un breve silencio. Todos responden «Amén».',
        inicio: { cita: 'Oremos.', fuente: 'dias' },
        fin: { cita: 'por los siglos de los siglos.', fuente: 'dias' } }
    ]
  },
  {
    id: 'palabra', titulo: 'Liturgia de la Palabra', pasos: [
      { id: 'lectura1', titulo: 'Primera lectura', igmr: [59, 128],
        nota: 'El lector anuncia el libro (del Antiguo Testamento; en Pascua, de los Hechos de los Apóstoles).',
        inicio: { cita: 'Lectura del libro de', fuente: 'dias', sigue: true },
        fin: { cita: 'Palabra de Dios.', fuente: 'dias' } },
      { id: 'salmo', titulo: 'Salmo responsorial', igmr: [61],
        nota: 'El salmista dice la respuesta, todos la repiten, y después de cada estrofa. Texto propio de cada día.' },
      { id: 'lectura2', titulo: 'Segunda lectura', igmr: [357], semana: 'no',
        nota: 'De las cartas de los Apóstoles (o del Apocalipsis).',
        inicio: { cita: 'Lectura de la carta', fuente: 'dias', sigue: true },
        fin: { cita: 'Palabra de Dios.', fuente: 'dias' } },
      { id: 'aclamacion', titulo: 'Aclamación antes del Evangelio', igmr: [62],
        nota: 'Todos de pie. En Cuaresma se dice otra aclamación en lugar del Aleluya.',
        inicio: { cita: 'Aleluya.', fuente: 'dias' },
        fin: { cita: 'Aleluya.', fuente: 'dias' } },
      { id: 'evangelio', titulo: 'Evangelio', igmr: [60, 134],
        nota: 'Se anuncia: «Evangelio de nuestro Señor Jesucristo según san…».',
        inicio: { cita: 'El Señor esté con ustedes.', fuente: 'ord-7' },
        fin: { cita: 'Palabra del Señor.', fuente: 'dias' } },
      { id: 'homilia', titulo: 'Homilía', tituloSemana: 'Homilía (si la hay)', igmr: [65, 66],
        nota: 'El sacerdote o el diácono predica; después, un breve silencio. Obligatoria los domingos.' },
      { id: 'credo', titulo: 'Profesión de fe (Credo)', igmr: [67, 68], semana: 'no',
        nota: 'Puede decirse también el Símbolo de los Apóstoles («Creo en Dios, Padre todopoderoso…»).',
        inicio: { cita: 'Creo en un solo Dios', fuente: 'ord-9', sigue: true },
        fin: { cita: 'y la vida del mundo futuro. Amén.', fuente: 'ord-9' } },
      { id: 'universal', titulo: 'Oración universal', tituloSemana: 'Oración universal (si la hay)', igmr: [69, 71],
        nota: 'El sacerdote invita a orar, se proponen las intenciones y termina con una oración; todos responden «Amén».' }
    ]
  },
  {
    id: 'eucaristia', titulo: 'Liturgia Eucarística', pasos: [
      { id: 'dones', titulo: 'Preparación de los dones', igmr: [73, 75, 76],
        nota: 'Se presentan el pan y el vino; el sacerdote se lava las manos e invita a orar.',
        inicio: { cita: 'Bendito seas, Señor, Dios del universo, por este pan', fuente: 'ord-7', sigue: true },
        fin: { cita: 'El Señor reciba de tus manos este sacrificio, para alabanza y gloria de su nombre, para nuestro bien y el de toda su santa Iglesia.', fuente: 'ord-7' } },
      { id: 'ofrendas', titulo: 'Oración sobre las ofrendas', igmr: [77],
        nota: 'Oración propia del día. Todos responden «Amén».',
        fin: { cita: 'Por Jesucristo, nuestro Señor.', fuente: 'ord-7' } },
      { id: 'prefacio', titulo: 'Plegaria Eucarística: prefacio', igmr: [78, 79, 148],
        nota: 'Diálogo y prefacio (propio del día o del tiempo), que termina invitando a cantar el Santo.',
        inicio: { cita: 'El Señor esté con ustedes.', fuente: 'ord-7' },
        fin: { cita: 'Es justo y necesario.', fuente: 'ord-7' } },
      { id: 'santo', titulo: 'Santo', igmr: [79],
        inicio: { cita: 'Santo, Santo, Santo es el Señor, Dios del Universo.', fuente: 'ord-7' },
        fin: { cita: 'Bendito el que viene en nombre del Señor. Hosanna en el cielo.', fuente: 'ord-7' } },
      { id: 'epiclesis', titulo: 'Invocación del Espíritu Santo sobre los dones', igmr: [79],
        nota: 'Frases de la Plegaria Eucarística III; cada plegaria tiene su propio texto.',
        inicio: { cita: 'Santo eres en verdad, Padre', fuente: 'ord-7', sigue: true },
        fin: { cita: 'te suplicamos que santifiques por el mismo Espíritu estos dones', fuente: 'ord-7', sigue: true } }
    ]
  },
  {
    id: 'consagracion', titulo: 'Consagración', destacado: true,
    intro: 'Verifique con especial atención: pan y vino sobre el altar, y las palabras de Cristo completas sobre cada uno. Frases de la Plegaria Eucarística III; las palabras de Cristo son las mismas en todas las plegarias.',
    pasos: [
      { id: 'materia', titulo: 'Pan de trigo y vino de uva sobre el altar', igmr: [320, 322, 324, 72], esencial: true,
        nota: 'Se presentan en la preparación de los dones; el vino está en el cáliz, con un poco de agua.' },
      { id: 'pan', titulo: 'Consagración del pan', igmr: [79, 72], esencial: true, palabras: true,
        nota: 'El sacerdote toma el pan y lo sostiene un poco elevado sobre el altar.',
        inicio: { cita: 'Porque él mismo, la noche en que iba a ser entregado, tomó pan', fuente: 'ord-7', sigue: true },
        fin: { cita: 'TOMEN Y COMAN TODOS DE ÉL, PORQUE ESTO ES MI CUERPO, QUE SERÁ ENTREGADO POR USTEDES.', fuente: 'ord-7' } },
      { id: 'elevacion-pan', titulo: 'Elevación de la Hostia y genuflexión', igmr: [150, 274],
        nota: 'Muestra la Hostia consagrada al pueblo (puede tocarse la campanilla), la deja sobre la patena y hace genuflexión.' },
      { id: 'caliz', titulo: 'Consagración del vino', igmr: [79, 72], esencial: true, palabras: true,
        nota: 'El sacerdote toma el cáliz y lo sostiene un poco elevado sobre el altar.',
        inicio: { cita: 'Del mismo modo, acabada la cena, tomó el cáliz', fuente: 'ord-7', sigue: true },
        fin: { cita: 'TOMEN Y BEBAN TODOS DE ÉL, PORQUE ÉSTE ES EL CÁLIZ DE MI SANGRE, SANGRE DE LA ALIANZA NUEVA Y ETERNA, QUE SERÁ DERRAMADA POR USTEDES Y POR MUCHOS PARA EL PERDÓN DE LOS PECADOS. HAGAN ESTO EN CONMEMORACIÓN MÍA.', fuente: 'ord-7' } },
      { id: 'elevacion-caliz', titulo: 'Elevación del cáliz y genuflexión', igmr: [150, 274],
        nota: 'Muestra el cáliz al pueblo (puede tocarse la campanilla), lo deja sobre el corporal y hace genuflexión.' },
      { id: 'misterio', titulo: 'Aclamación después de la consagración', igmr: [151],
        nota: 'También «Este es el Sacramento de nuestra fe», y otras aclamaciones del pueblo.',
        inicio: { cita: 'Éste es el Misterio de la fe.', fuente: 'ord-7' },
        fin: { cita: 'Anunciamos tu muerte, proclamamos tu resurrección. ¡Ven, Señor Jesús!', fuente: 'ord-7' } }
    ]
  },
  {
    id: 'fin-plegaria', titulo: 'Fin de la Plegaria Eucarística', pasos: [
      { id: 'intercesiones', titulo: 'Memorial, ofrenda e intercesiones', igmr: [79],
        nota: 'Frases de la Plegaria Eucarística III. Se ora por la Iglesia, el Papa y el Obispo, por los difuntos y por todos.',
        inicio: { cita: 'Así, Padre, al celebrar ahora el memorial', fuente: 'ord-7', sigue: true },
        fin: { cita: 'por quien concedes al mundo todos los bienes.', fuente: 'ord-7' } },
      { id: 'doxologia', titulo: 'Doxología final', igmr: [79, 151],
        nota: 'Todos responden «Amén».',
        inicio: { cita: 'Por Cristo, con él y en él', fuente: 'ord-7', sigue: true },
        fin: { cita: 'todo honor y toda gloria por los siglos de los siglos.', fuente: 'ord-7' } }
    ]
  },
  {
    id: 'comunion', titulo: 'Rito de la Comunión', pasos: [
      { id: 'padrenuestro', titulo: 'Padre nuestro', igmr: [81],
        inicio: { cita: 'Fieles a la recomendación del Salvador y siguiendo su divina enseñanza, nos atrevemos a decir:', fuente: 'ord-7' },
        fin: { cita: 'Tuyo es el reino, tuyo el poder y la gloria, por siempre, Señor.', fuente: 'ord-7' } },
      { id: 'paz', titulo: 'Rito de la paz', igmr: [82],
        inicio: { cita: 'Señor Jesucristo, que dijiste a tus apóstoles', fuente: 'ord-7', sigue: true },
        fin: { cita: 'Como hijos de Dios, intercambiemos ahora un signo de comunión fraterna.', fuente: 'ord-7' } },
      { id: 'fraccion', titulo: 'Fracción del pan', igmr: [83],
        inicio: { cita: 'Cordero de Dios, que quitas el pecado del mundo, ten piedad de nosotros.', fuente: 'ord-7' },
        fin: { cita: 'Cordero de Dios, que quitas el pecado del mundo, danos la paz.', fuente: 'ord-7' } },
      { id: 'invitacion', titulo: 'Invitación a la Comunión', igmr: [84],
        inicio: { cita: 'Este es el Cordero de Dios, que quita el pecado del mundo.', fuente: 'ord-7' },
        fin: { cita: 'Señor, no soy digno de que entres en mi casa, pero una palabra tuya bastará para sanarme.', fuente: 'ord-7' } },
      { id: 'comunion-sacerdote', titulo: 'Comunión del sacerdote', igmr: [158, 85],
        nota: 'El sacerdote comulga el Cuerpo y la Sangre de Cristo consagrados en esta Misa.' },
      { id: 'comunion-fieles', titulo: 'Comunión de los fieles', igmr: [86, 160],
        nota: 'Cada uno responde «Amén». Después, purificación de los vasos sagrados y silencio o canto de acción de gracias.',
        inicio: { cita: 'El Cuerpo de Cristo.', fuente: 'ord-7' } },
      { id: 'poscomunion', titulo: 'Oración después de la comunión', igmr: [89],
        nota: 'Oración propia del día. Todos responden «Amén».',
        inicio: { cita: 'Oremos.', fuente: 'dias' },
        fin: { cita: 'Por Jesucristo, nuestro Señor.', fuente: 'ord-7' } }
    ]
  },
  {
    id: 'conclusion', titulo: 'Rito de conclusión', pasos: [
      { id: 'bendicion', titulo: 'Saludo y bendición', igmr: [90],
        nota: 'Antes pueden darse breves avisos. Todos responden «Amén».',
        inicio: { cita: 'El Señor esté con ustedes.', fuente: 'ord-7' },
        fin: { cita: 'descienda sobre ustedes y permanezca para siempre.', fuente: 'ord-7' } },
      { id: 'despedida', titulo: 'Despedida', igmr: [90],
        nota: 'El diácono o el sacerdote despide al pueblo.',
        fin: { cita: 'Demos gracias a Dios.', fuente: 'ord-9' } }
    ]
  }
];

const FUENTES = {
  'ord-7': { titulo: 'Ordinario de la Misa, Eucaristía Diaria (edición de septiembre de 2026)', url: 'https://www.eucaristiadiaria.cl/ordinario.php?id=7', archivo: 'fuentes/eucaristiadiaria/ordinario/id-7.html' },
  'ord-9': { titulo: 'Ordinario de la Misa, Eucaristía Diaria (edición de octubre de 2026)', url: 'https://www.eucaristiadiaria.cl/ordinario.php?id=9', archivo: 'fuentes/eucaristiadiaria/ordinario/id-9.html' },
  'dias': { titulo: 'Páginas de los días, Eucaristía Diaria', url: 'https://www.eucaristiadiaria.cl/calendario.php', archivo: 'fuentes/eucaristiadiaria/paginas/' }
};

module.exports = { PARTES, FUENTES };
