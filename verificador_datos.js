// Datos de «Seguir la Misa»: las partes de la Misa como lista de verificación.
//
// Cada paso dice cómo empieza y cómo termina, para orientarse; no es el texto
// completo (para eso está el resto de la app). Las citas literales llevan su
// fuente y test_verificador.js comprueba que aparezcan tal cual en ella:
//   'ord-7'  Ordinario de la Misa de Eucaristía Diaria, edición de septiembre de 2026
//            (fuentes/eucaristiadiaria/ordinario/id-7.html)
//   'ord-9'  ídem, edición de octubre de 2026 (id-9.html)
//   'dias'   páginas de los días guardadas en fuentes/eucaristiadiaria/paginas/
// Lo que no tiene una cita respaldada se describe con «nota», sin comillas.
//
// cuando: qué pasa en domingo (o solemnidad) y en día de semana:
//   'si'        se hace siempre
//   'puede'     se hace si corresponde (se puede marcar «no corresponde»)
//   'no'        no se hace (el paso no aparece)
// esencial: elemento sin el cual no hay consagración (materia y palabras).
// obligatorio: la IGMR lo manda siempre; se destaca en el resumen.

const PARTES = [
  {
    id: 'iniciales', titulo: 'Ritos iniciales', pasos: [
      { id: 'entrada', titulo: 'Entrada', igmr: [47, 49],
        inicio: { nota: 'Canto o antífona de entrada mientras avanza el sacerdote.' },
        fin: { nota: 'El sacerdote saluda al altar con una inclinación profunda y lo besa.' } },
      { id: 'saludo', titulo: 'Señal de la cruz y saludo', igmr: [50],
        inicio: { cita: 'En el nombre del Padre, y del Hijo, y del Espíritu Santo.', fuente: 'ord-9' },
        fin: { cita: 'Y con tu espíritu.', fuente: 'ord-7' } },
      { id: 'penitencial', titulo: 'Acto penitencial', igmr: [51],
        inicio: { cita: 'Hermanos: para celebrar dignamente estos sagrados misterios, reconozcamos nuestros pecados.', fuente: 'ord-7' },
        fin: { cita: 'Dios todopoderoso tenga misericordia de nosotros, perdone nuestros pecados y nos lleve a la vida eterna.', fuente: 'ord-7' } },
      { id: 'kyrie', titulo: 'Señor, ten piedad', igmr: [52], domingo: 'puede', semana: 'puede',
        nota: 'Se omite si ya se dijo dentro del acto penitencial.',
        inicio: { cita: 'Señor, ten piedad', fuente: 'ord-7' },
        fin: { cita: 'Cristo, ten piedad', fuente: 'ord-7', antes: 'Después de ', despues: ', otra vez «Señor, ten piedad».' } },
      { id: 'gloria', titulo: 'Gloria', igmr: [53], domingo: 'puede', semana: 'puede',
        nota: 'Los domingos fuera de Adviento y Cuaresma, en las solemnidades y en las fiestas.',
        inicio: { cita: 'Gloria a Dios en el cielo, y en la tierra paz a los hombres que ama el Señor.', fuente: 'ord-7' },
        fin: { cita: 'en la gloria de Dios Padre. Amén.', fuente: 'ord-7' } },
      { id: 'colecta', titulo: 'Oración colecta', igmr: [54],
        inicio: { cita: 'Oremos.', fuente: 'dias', despues: ' Breve silencio.' },
        fin: { cita: 'por los siglos de los siglos.', fuente: 'dias', despues: ' Todos: «Amén».' } }
    ]
  },
  {
    id: 'palabra', titulo: 'Liturgia de la Palabra', pasos: [
      { id: 'lectura1', titulo: 'Primera lectura', igmr: [59, 128],
        inicio: { nota: 'El lector anuncia el libro: «Lectura del libro de…», «Lectura de la carta…».' },
        fin: { cita: 'Palabra de Dios.', fuente: 'dias' } },
      { id: 'salmo', titulo: 'Salmo responsorial', igmr: [61],
        inicio: { nota: 'El salmista dice la respuesta y todos la repiten.' },
        fin: { nota: 'Última estrofa y la respuesta de todos.' } },
      { id: 'lectura2', titulo: 'Segunda lectura', igmr: [357], domingo: 'si', semana: 'no',
        inicio: { nota: 'Lectura de una carta de los Apóstoles (o del Apocalipsis).' },
        fin: { cita: 'Palabra de Dios.', fuente: 'dias' } },
      { id: 'aclamacion', titulo: 'Aclamación antes del Evangelio', igmr: [62],
        inicio: { nota: 'Todos de pie. Se canta el Aleluya (en Cuaresma, otra aclamación).' },
        fin: { nota: 'Termina la aclamación; el sacerdote o el diácono va al ambón.' } },
      { id: 'evangelio', titulo: 'Evangelio', igmr: [60, 134],
        inicio: { cita: 'Evangelio de nuestro Señor Jesucristo según san', fuente: 'dias', antes: 'Después del saludo, «', despues: '…».', sinComillas: true },
        fin: { cita: 'Palabra del Señor.', fuente: 'dias' } },
      { id: 'homilia', titulo: 'Homilía', igmr: [65, 66], domingo: 'si', semana: 'puede',
        nota: 'Obligatoria los domingos y fiestas de precepto; recomendada los demás días.',
        inicio: { nota: 'Todos se sientan; el sacerdote o el diácono predica.' },
        fin: { nota: 'Breve silencio.' } },
      { id: 'credo', titulo: 'Profesión de fe (Credo)', igmr: [67, 68], domingo: 'si', semana: 'no',
        inicio: { cita: 'Creo en un solo Dios', fuente: 'ord-9', despues: ' (o el Símbolo de los Apóstoles: «Creo en Dios, Padre todopoderoso»).' },
        fin: { cita: 'y la vida del mundo futuro. Amén.', fuente: 'ord-9' } },
      { id: 'universal', titulo: 'Oración universal', igmr: [69, 71], domingo: 'si', semana: 'puede',
        inicio: { nota: 'El sacerdote invita a orar; se proponen las intenciones.' },
        fin: { nota: 'Oración final del sacerdote; todos: «Amén».' } }
    ]
  },
  {
    id: 'eucaristia', titulo: 'Liturgia Eucarística', pasos: [
      { id: 'dones', titulo: 'Preparación de los dones', igmr: [73, 75, 76],
        inicio: { cita: 'Bendito seas, Señor, Dios del universo, por este pan', fuente: 'ord-7', despues: '…' },
        fin: { cita: 'El Señor reciba de tus manos este sacrificio, para alabanza y gloria de su nombre, para nuestro bien y el de toda su santa Iglesia.', fuente: 'ord-7' } },
      { id: 'ofrendas', titulo: 'Oración sobre las ofrendas', igmr: [77],
        inicio: { nota: 'Oración propia del día, con las manos extendidas.' },
        fin: { cita: 'Por Jesucristo, nuestro Señor.', fuente: 'ord-7', despues: ' Todos: «Amén».' } },
      { id: 'prefacio', titulo: 'Plegaria Eucarística: prefacio', igmr: [78, 79, 148],
        inicio: { cita: 'Levantemos el corazón.', fuente: 'ord-7', antes: 'Después de «El Señor esté con ustedes», «', despues: '»', sinComillas: true },
        fin: { nota: 'El prefacio termina invitando a cantar el Santo.' } },
      { id: 'santo', titulo: 'Santo', igmr: [79],
        inicio: { cita: 'Santo, Santo, Santo es el Señor, Dios del Universo.', fuente: 'ord-7' },
        fin: { cita: 'Bendito el que viene en nombre del Señor. Hosanna en el cielo.', fuente: 'ord-7' } },
      { id: 'epiclesis', titulo: 'Epíclesis: invocación del Espíritu Santo sobre los dones', igmr: [79],
        inicio: { nota: 'El sacerdote extiende las manos sobre el pan y el vino.' },
        fin: { cita: 'te suplicamos que santifiques por el mismo Espíritu estos dones', fuente: 'ord-7', antes: 'Por ejemplo, en la Plegaria III: «…', despues: '…»', sinComillas: true } }
    ]
  },
  {
    id: 'consagracion', titulo: 'Consagración', destacado: true,
    intro: 'Relato de la institución y consagración: con las palabras y los gestos de Cristo se realiza el sacrificio que él instituyó en la última Cena (IGMR 79). Verifique cada paso.',
    pasos: [
      { id: 'materia', titulo: 'Sobre el altar hay pan de trigo y vino de uva', igmr: [320, 322, 72], esencial: true,
        nota: 'Pan de trigo sin mezcla, ácimo y reciente; vino natural del fruto de la vid, con un poco de agua.',
        inicio: { nota: 'Se verifica desde la preparación de los dones.' },
        fin: { nota: 'Si en el cáliz había agua y no vino, el sacerdote debe poner vino y consagrarlo (IGMR 324).' } },
      { id: 'pan', titulo: 'Consagración del pan', igmr: [79, 72], esencial: true,
        nota: 'El sacerdote dice las palabras completas sobre el pan:',
        inicio: { nota: 'Toma el pan y lo sostiene un poco elevado sobre el altar.' },
        fin: { cita: 'TOMEN Y COMAN TODOS DE ÉL, PORQUE ESTO ES MI CUERPO, QUE SERÁ ENTREGADO POR USTEDES.', fuente: 'ord-7', palabras: true } },
      { id: 'elevacion-pan', titulo: 'Elevación de la Hostia y genuflexión', igmr: [150, 274],
        inicio: { nota: 'Muestra la Hostia consagrada al pueblo (puede tocarse la campanilla).' },
        fin: { nota: 'La deja sobre la patena y hace genuflexión.' } },
      { id: 'caliz', titulo: 'Consagración del vino', igmr: [79, 72], esencial: true,
        nota: 'El sacerdote dice las palabras completas sobre el cáliz:',
        inicio: { nota: 'Toma el cáliz y lo sostiene un poco elevado sobre el altar.' },
        fin: { cita: 'TOMEN Y BEBAN TODOS DE ÉL, PORQUE ÉSTE ES EL CÁLIZ DE MI SANGRE, SANGRE DE LA ALIANZA NUEVA Y ETERNA, QUE SERÁ DERRAMADA POR USTEDES Y POR MUCHOS PARA EL PERDÓN DE LOS PECADOS. HAGAN ESTO EN CONMEMORACIÓN MÍA.', fuente: 'ord-7', palabras: true } },
      { id: 'elevacion-caliz', titulo: 'Elevación del cáliz y genuflexión', igmr: [150, 274],
        inicio: { nota: 'Muestra el cáliz al pueblo (puede tocarse la campanilla).' },
        fin: { nota: 'Lo deja sobre el corporal y hace genuflexión.' } },
      { id: 'misterio', titulo: 'Aclamación después de la consagración', igmr: [151],
        inicio: { cita: 'Éste es el Misterio de la fe.', fuente: 'ord-7', despues: ' (o «Este es el Sacramento de nuestra fe»).' },
        fin: { cita: 'Anunciamos tu muerte, proclamamos tu resurrección. ¡Ven, Señor Jesús!', fuente: 'ord-7', despues: ' (u otra aclamación).' } }
    ]
  },
  {
    id: 'fin-plegaria', titulo: 'Fin de la Plegaria Eucarística', pasos: [
      { id: 'intercesiones', titulo: 'Memorial, ofrenda e intercesiones', igmr: [79],
        inicio: { nota: 'Se hace memoria de la pasión, resurrección y ascensión de Cristo y se ofrece la Víctima.' },
        fin: { cita: 'con nuestro Papa N.', fuente: 'ord-7', antes: 'Se ora por la Iglesia, ', despues: ' y el Obispo, por los difuntos y por todos.', sinComillas: true } },
      { id: 'doxologia', titulo: 'Doxología final', igmr: [79, 151],
        inicio: { cita: 'Por Cristo, con él y en él', fuente: 'ord-7', despues: '…' },
        fin: { cita: 'todo honor y toda gloria por los siglos de los siglos.', fuente: 'ord-7', despues: ' Todos: «Amén».' } }
    ]
  },
  {
    id: 'comunion', titulo: 'Rito de la Comunión', pasos: [
      { id: 'padrenuestro', titulo: 'Padre nuestro', igmr: [81],
        inicio: { cita: 'Fieles a la recomendación del Salvador y siguiendo su divina enseñanza, nos atrevemos a decir:', fuente: 'ord-7' },
        fin: { cita: 'Tuyo es el reino, tuyo el poder y la gloria, por siempre, Señor.', fuente: 'ord-7' } },
      { id: 'paz', titulo: 'Rito de la paz', igmr: [82],
        inicio: { cita: 'Señor Jesucristo, que dijiste a tus apóstoles', fuente: 'ord-7', despues: '…' },
        fin: { cita: 'La paz del Señor esté siempre con ustedes.', fuente: 'ord-7', despues: ' Puede seguir el saludo de paz.' } },
      { id: 'fraccion', titulo: 'Fracción del pan', igmr: [83],
        inicio: { cita: 'Cordero de Dios, que quitas el pecado del mundo, ten piedad de nosotros.', fuente: 'ord-7' },
        fin: { cita: 'Cordero de Dios, que quitas el pecado del mundo, danos la paz.', fuente: 'ord-7' } },
      { id: 'invitacion', titulo: 'Invitación a la Comunión', igmr: [84],
        inicio: { cita: 'Este es el Cordero de Dios, que quita el pecado del mundo.', fuente: 'ord-7' },
        fin: { cita: 'Señor, no soy digno de que entres en mi casa, pero una palabra tuya bastará para sanarme.', fuente: 'ord-7' } },
      { id: 'comunion-sacerdote', titulo: 'Comunión del sacerdote', igmr: [158, 85], obligatorio: true,
        nota: 'El sacerdote comulga el Cuerpo y la Sangre de Cristo de lo consagrado en la misma Misa.',
        inicio: { nota: 'Comulga el Cuerpo de Cristo.' },
        fin: { nota: 'Bebe la Sangre de Cristo del cáliz.' } },
      { id: 'comunion-fieles', titulo: 'Comunión de los fieles', igmr: [86, 160],
        inicio: { cita: 'El Cuerpo de Cristo.', fuente: 'ord-7', despues: ' Cada uno responde «Amén».' },
        fin: { nota: 'Purificación de los vasos sagrados; silencio o canto de acción de gracias.' } },
      { id: 'poscomunion', titulo: 'Oración después de la comunión', igmr: [89],
        inicio: { cita: 'Oremos.', fuente: 'dias' },
        fin: { cita: 'Por Jesucristo, nuestro Señor.', fuente: 'ord-7', despues: ' Todos: «Amén».' } }
    ]
  },
  {
    id: 'conclusion', titulo: 'Rito de conclusión', pasos: [
      { id: 'avisos', titulo: 'Avisos', igmr: [90], domingo: 'puede', semana: 'puede',
        inicio: { nota: 'Breves avisos, si fueran necesarios.' },
        fin: { nota: 'Terminan los avisos.' } },
      { id: 'bendicion', titulo: 'Saludo y bendición', igmr: [90],
        inicio: { cita: 'El Señor esté con ustedes.', fuente: 'ord-7' },
        fin: { cita: 'descienda sobre ustedes y permanezca para siempre.', fuente: 'ord-7', antes: '«La bendición de Dios todopoderoso… ', despues: '» Todos: «Amén».', sinComillas: true } },
      { id: 'despedida', titulo: 'Despedida', igmr: [90],
        inicio: { nota: 'El diácono o el sacerdote despide al pueblo.' },
        fin: { cita: 'Demos gracias a Dios.', fuente: 'ord-9', antes: 'Todos: «', despues: '»', sinComillas: true } }
    ]
  }
];

const FUENTES = {
  'ord-7': { titulo: 'Ordinario de la Misa, Eucaristía Diaria (edición de septiembre de 2026)', url: 'https://www.eucaristiadiaria.cl/ordinario.php?id=7', archivo: 'fuentes/eucaristiadiaria/ordinario/id-7.html' },
  'ord-9': { titulo: 'Ordinario de la Misa, Eucaristía Diaria (edición de octubre de 2026)', url: 'https://www.eucaristiadiaria.cl/ordinario.php?id=9', archivo: 'fuentes/eucaristiadiaria/ordinario/id-9.html' },
  'dias': { titulo: 'Páginas de los días, Eucaristía Diaria', url: 'https://www.eucaristiadiaria.cl/calendario.php', archivo: 'fuentes/eucaristiadiaria/paginas/' }
};

module.exports = { PARTES, FUENTES };
