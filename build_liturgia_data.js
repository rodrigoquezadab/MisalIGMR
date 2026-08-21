const fs = require('fs');

// 1. LAS 4 PLEGARIAS EUCARÍSTICAS COMPLETAS
const plegariasEucaristicas = {
  "1": {
    id: "1",
    nombre: "Plegaria Eucarística I (Canon Romano)",
    prefacioPropio: false,
    descripcion: "La venerable y antiquísima anáfora de la Iglesia Romana, con conmemoración de los santos y mártires.",
    contenido: [
      {
        tipo: "rubrica",
        texto: "El sacerdote, con las manos extendidas, dice:"
      },
      {
        speaker: "Sacerdote",
        texto: "Padre clementísimo, te suplicamos humildemente por Jesucristo, tu Hijo, nuestro Señor, que aceptes y bendigas estos + dones, este sacrificio santo y puro que te ofrecemos, ante todo, por tu Iglesia santa y católica, para que le concedas la paz, la protejas, la congregues en la unidad y la gobiernes en el mundo entero, con tu servidor el Papa N., con nuestro Obispo N., y todos los demás Obispos que, fieles a la verdad, promueven la fe católica y apostólica."
      },
      {
        tipo: "rubrica",
        texto: "Conmemoración de los vivos (Memento de vivos):"
      },
      {
        speaker: "Sacerdote",
        texto: "Acuérdate, Señor, de tus hijos N. y N. y de todos los aquí reunidos, cuya fe y entrega bien conoces; por ellos y todos los suyos, por el perdón de sus pecados y la salvación que esperan, te ofrecemos, y ellos mismos te ofrecen, este sacrificio de alabanza, a ti, eterno Dios, vivo y verdadero."
      },
      {
        tipo: "rubrica",
        texto: "Communicantes (Conmemoración de los Santos):"
      },
      {
        speaker: "Sacerdote",
        texto: "Reunidos en comunión con toda la Iglesia, veneramos la memoria, ante todo, de la gloriosa siempre Virgen María, Madre de Jesucristo, nuestro Dios y Señor, la de su esposo san José, la de los santos apóstoles y mártires Pedro y Pablo, Andrés, (Santiago y Juan, Tomás, Santiago, Felipe, Bartolomé, Mateo, Simón y Tadeo; Lino, Cleto, Clemente, Sixto, Cornelio, Cipriano, Lorenzo, Crisógono, Juan y Pablo, Cosme y Damián) y la de todos los santos; por sus méritos y oraciones concédenos en todo tu protección."
      },
      {
        tipo: "rubrica",
        texto: "Hanc igitur (Con las manos extendidas sobre las ofrendas - IGMR 79c, 150):"
      },
      {
        speaker: "Sacerdote",
        texto: "Acepta, Señor, en tu bondad, esta ofrenda de tus siervos y de toda tu familia santa; ordena en tu paz nuestros días, líbranos de la condenación eterna y cuéntanos entre tus elegidos."
      },
      {
        tipo: "rubrica",
        texto: "Quam oblationem (Epíclesis consagratoria - IGMR 79c, 150):"
      },
      {
        speaker: "Sacerdote",
        texto: "Bendice y santifica, oh Padre, esta ofrenda, haciéndola perfecta, espiritual y digna de ti, de manera que sea para nosotros el Cuerpo y la Sangre de tu Hijo amado, Jesucristo, nuestro Señor."
      },
      {
        tipo: "rubrica",
        texto: "Consagración del Pan: Toma el pan, lo sostiene un poco sobre el altar y dice de forma clara (IGMR 79d, 150):"
      },
      {
        speaker: "Sacerdote",
        texto: "El cual, la víspera de su Pasión, tomó pan en sus santas y venerables manos, y, levantando los ojos al cielo, hacia ti, Dios, Padre suyo todopoderoso, dando gracias te bendijo, lo partió y lo dio a sus discípulos, diciendo:\n\n«TOMEN Y COMAN TODOS DE ÉL, PORQUE ESTO ES MI CUERPO, QUE SERÁ ENTREGADO POR USTEDES»."
      },
      {
        tipo: "rubrica",
        texto: "Muestra el pan consagrado al pueblo, lo deposita sobre la patena y hace una genuflexión en adoración (IGMR 150, 274). Luego prosigue:"
      },
      {
        speaker: "Sacerdote",
        texto: "Del mismo modo, acabada la cena, tomó este cáliz glorioso en sus santas y venerables manos; dando gracias te bendijo y lo dio a sus discípulos, diciendo:\n\n«TOMEN Y BEBAN TODOS DE ÉL, PORQUE ÉSTE ES EL CÁLIZ DE MI SANGRE, SANGRE DE LA ALIANZA NUEVA Y ETERNA, QUE SERÁ DERRAMADA POR USTEDES Y POR MUCHOS PARA EL PERDÓN DE LOS PECADOS. HAGAN ESTO EN CONMEMORACIÓN MÍA»."
      },
      {
        tipo: "rubrica",
        texto: "Muestra el cáliz al pueblo, lo deposita sobre el corporal y hace una genuflexión en adoración (IGMR 150, 274). El pueblo se pone de pie (o permanece de rodillas por costumbre laudable - IGMR 43). El sacerdote aclama (IGMR 151):"
      },
      {
        speaker: "Sacerdote",
        texto: "Éste es el Sacramento de nuestra fe."
      },
      {
        speaker: "Pueblo",
        response: true,
        texto: "Anunciamos tu muerte, proclamamos tu resurrección. ¡Ven, Señor Jesús!"
      },
      {
        tipo: "rubrica",
        texto: "Unde et memores (Anámnesis y Ofrenda - IGMR 79e):"
      },
      {
        speaker: "Sacerdote",
        texto: "Por eso, Señor, nosotros, tus siervos, y todo tu pueblo santo, al celebrar el memorial de la muerte gloriosa de Jesucristo, tu Hijo, nuestro Señor, de su santa resurrección del lugar de los muertos y de su admirable ascensión a los cielos, te ofrecemos, de los mismos bienes que nos has dado, la víctima pura, inmaculada y santa: pan de vida eterna y cáliz de eterna salvación."
      },
      {
        speaker: "Sacerdote",
        texto: "Mira con ojos de bondad esta ofrenda y acéptala, como aceptaste los dones del justo Abel, el sacrificio de Abraham, nuestro padre en la fe, y la oblación pura de tu sumo sacerdote Melquisedec."
      },
      {
        tipo: "rubrica",
        texto: "Supplices te rogamus (El sacerdote profundamente inclinado ante el altar dice - IGMR 275a):"
      },
      {
        speaker: "Sacerdote",
        texto: "Te pedimos humildemente, Dios todopoderoso, que esta ofrenda sea llevada a tu presencia, hasta el altar del cielo, por manos de tu ángel, para que cuantos recibimos el Cuerpo y la Sangre de tu Hijo, al participar de este altar, seamos colmados de gracia y bendición celestial."
      },
      {
        tipo: "rubrica",
        texto: "Memento de difuntos (El sacerdote se incorpora y con las manos extendidas dice):"
      },
      {
        speaker: "Sacerdote",
        texto: "Acuérdate también, Señor, de tus hijos N. y N., que nos han precedido con el signo de la fe y duermen ya el sueño de la paz. A ellos, Señor, y a cuantos descansan en Cristo, concédeles el lugar del consuelo, de la luz y de la paz."
      },
      {
        tipo: "rubrica",
        texto: "Nobis quoque peccatoribus (Golpeándose el pecho dice - IGMR 51):"
      },
      {
        speaker: "Sacerdote",
        texto: "Y a nosotros, pecadores, siervos tuyos, que confiamos en tu infinita misericordia, admítenos en la asamblea de los santos apóstoles y mártires Juan el Bautista, Esteban, Matías, Bernabé, (Ignacio, Alejandro, Marcelino y Pedro, Felicidad y Perpetua, Águeda, Lucía, Inés, Cecilia, Anastasia) y de todos los santos; y acéptanos en su compañía, no por nuestros méritos, sino conforme a tu bondad. Por Cristo, Señor nuestro."
      },
      {
        speaker: "Sacerdote",
        texto: "Por quien sigues creando todos los bienes, los santificas, los llenas de vida, los bendices y los repartes entre nosotros."
      },
      {
        tipo: "rubrica",
        texto: "Doxología Final (El sacerdote eleva la patena y el cáliz juntos - IGMR 79h, 151):"
      },
      {
        speaker: "Sacerdote",
        texto: "Por Cristo, con él y en él, a ti, Dios Padre omnipotente, en la unidad del Espíritu Santo, todo honor y toda gloria por los siglos de los siglos."
      },
      {
        speaker: "Pueblo",
        response: true,
        texto: "¡Amén!"
      }
    ]
  },
  "2": {
    id: "2",
    nombre: "Plegaria Eucarística II",
    prefacioPropio: true,
    descripcion: "Inspirada en la Tradición Apostólica de San Hipólito. Destaca por su noble sencillez, claridad teológica y brevedad pastoral.",
    contenido: [
      {
        tipo: "rubrica",
        texto: "El sacerdote, con las manos extendidas, dice:"
      },
      {
        speaker: "Sacerdote",
        texto: "Santo eres en verdad, Señor, fuente de toda santidad;"
      },
      {
        tipo: "rubrica",
        texto: "Junta las manos y, teniéndolas extendidas sobre las ofrendas (Epíclesis - IGMR 79c, 150), dice:"
      },
      {
        speaker: "Sacerdote",
        texto: "por eso te pedimos que santifiques estos dones con la efusión de tu Espíritu, de manera que se conviertan para nosotros en el Cuerpo y la Sangre de Jesucristo, nuestro Señor."
      },
      {
        speaker: "Pueblo",
        response: true,
        texto: "Amén."
      },
      {
        tipo: "rubrica",
        texto: "Consagración del Pan (IGMR 79d, 150):"
      },
      {
        speaker: "Sacerdote",
        texto: "El cual, cuando iba a ser entregado a su Pasión, voluntariamente aceptada, tomó pan, dándote gracias, lo partió y lo dio a sus discípulos, diciendo:\n\n«TOMEN Y COMAN TODOS DE ÉL, PORQUE ESTO ES MI CUERPO, QUE SERÁ ENTREGADO POR USTEDES»."
      },
      {
        tipo: "rubrica",
        texto: "Muestra el pan consagrado al pueblo, lo deposita sobre la patena y hace una genuflexión en adoración (IGMR 150, 274). Luego prosigue:"
      },
      {
        speaker: "Sacerdote",
        texto: "Del mismo modo, acabada la cena, tomó el cáliz, y, dándote gracias de nuevo, lo pasó a sus discípulos, diciendo:\n\n«TOMEN Y BEBAN TODOS DE ÉL, PORQUE ÉSTE ES EL CÁLIZ DE MI SANGRE, SANGRE DE LA ALIANZA NUEVA Y ETERNA, QUE SERÁ DERRAMADA POR USTEDES Y POR MUCHOS PARA EL PERDÓN DE LOS PECADOS. HAGAN ESTO EN CONMEMORACIÓN MÍA»."
      },
      {
        tipo: "rubrica",
        texto: "Muestra el cáliz al pueblo, lo deposita sobre el corporal y hace una genuflexión en adoración (IGMR 150, 274). El pueblo se pone de pie (o permanece de rodillas por costumbre laudable - IGMR 43). El sacerdote aclama (IGMR 151):"
      },
      {
        speaker: "Sacerdote",
        texto: "Éste es el Sacramento de nuestra fe. (O: Éste es el misterio de la fe)."
      },
      {
        speaker: "Pueblo",
        response: true,
        texto: "Anunciamos tu muerte, proclamamos tu resurrección. ¡Ven, Señor Jesús!"
      },
      {
        tipo: "rubrica",
        texto: "Memorial e Intercesiones (IGMR 79e-g, 151):"
      },
      {
        speaker: "Sacerdote",
        texto: "Así, pues, Padre, al celebrar ahora el memorial de la muerte y resurrección de tu Hijo, te ofrecemos el pan de vida y el cáliz de salvación, y te damos gracias porque nos haces dignos de servirte en tu presencia. Te pedimos humildemente que el Espíritu Santo congregue en la unidad a cuantos participamos del Cuerpo y la Sangre de Cristo."
      },
      {
        speaker: "Sacerdote",
        texto: "Acuérdate, Señor, de tu Iglesia extendida por toda la tierra; y con el Papa N., con nuestro Obispo N. y todos los pastores que cuidan de tu pueblo, llévala a su perfección por la caridad. Acuérdate también de nuestros hermanos que durmieron en la esperanza de la resurrección, y de todos los que han muerto en tu misericordia; admítelos a contemplar la luz de tu rostro. Ten misericordia de todos nosotros, y así, con María, la Virgen Madre de Dios, su esposo san José, los apóstoles y cuantos vivieron en tu amistad a través de los tiempos, merezcamos, por tu Hijo Jesucristo, compartir la vida eterna y cantar tus alabanzas."
      },
      {
        tipo: "rubrica",
        texto: "Doxología Final (IGMR 79h, 151):"
      },
      {
        speaker: "Sacerdote",
        texto: "Por Cristo, con él y en él, a ti, Dios Padre omnipotente, en la unidad del Espíritu Santo, todo honor y toda gloria por los siglos de los siglos."
      },
      {
        speaker: "Pueblo",
        response: true,
        texto: "¡Amén!"
      }
    ]
  },
  "3": {
    id: "3",
    nombre: "Plegaria Eucarística III",
    prefacioPropio: false,
    descripcion: "Especialmente apta para los domingos y fiestas. Desarrolla admirablemente la teología del sacrificio y la acción del Espíritu Santo en la Iglesia.",
    contenido: [
      {
        tipo: "rubrica",
        texto: "El sacerdote, con las manos extendidas, dice:"
      },
      {
        speaker: "Sacerdote",
        texto: "Santo eres en verdad, Padre, y con razón te alaban todas tus criaturas, ya que, por Jesucristo, tu Hijo, Señor nuestro, con la fuerza del Espíritu Santo, das vida y santificas todo, y congregas a tu pueblo sin cesar, para que ofrezca en tu honor un sacrificio sin mancha desde donde sale el sol hasta el ocaso."
      },
      {
        tipo: "rubrica",
        texto: "Junta las manos y, teniéndolas extendidas sobre las ofrendas (Epíclesis - IGMR 79c, 150), dice:"
      },
      {
        speaker: "Sacerdote",
        texto: "Por eso, Padre, te suplicamos que santifiques por el mismo Espíritu estos dones que hemos preparado para ti, de manera que se conviertan en el Cuerpo y + la Sangre de Jesucristo, Hijo tuyo y Señor nuestro, que nos mandó celebrar estos misterios."
      },
      {
        speaker: "Pueblo",
        response: true,
        texto: "Amén."
      },
      {
        tipo: "rubrica",
        texto: "Consagración del Pan (IGMR 79d, 150):"
      },
      {
        speaker: "Sacerdote",
        texto: "Porque él mismo, la noche en que iba a ser entregado, tomó pan, y dando gracias te bendijo, lo partió y lo dio a sus discípulos, diciendo:\n\n«TOMEN Y COMAN TODOS DE ÉL, PORQUE ESTO ES MI CUERPO, QUE SERÁ ENTREGADO POR USTEDES»."
      },
      {
        tipo: "rubrica",
        texto: "Muestra el pan consagrado al pueblo, lo deposita sobre la patena y hace una genuflexión en adoración (IGMR 150, 274). Luego prosigue:"
      },
      {
        speaker: "Sacerdote",
        texto: "Del mismo modo, acabada la cena, tomó el cáliz, y, dando gracias te bendijo, y lo pasó a sus discípulos, diciendo:\n\n«TOMEN Y BEBAN TODOS DE ÉL, PORQUE ÉSTE ES EL CÁLIZ DE MI SANGRE, SANGRE DE LA ALIANZA NUEVA Y ETERNA, QUE SERÁ DERRAMADA POR USTEDES Y POR MUCHOS PARA EL PERDÓN DE LOS PECADOS. HAGAN ESTO EN CONMEMORACIÓN MÍA»."
      },
      {
        tipo: "rubrica",
        texto: "Muestra el cáliz al pueblo, lo deposita sobre el corporal y hace una genuflexión en adoración (IGMR 150, 274). El pueblo se pone de pie (o permanece de rodillas por costumbre laudable - IGMR 43). El sacerdote aclama (IGMR 151):"
      },
      {
        speaker: "Sacerdote",
        texto: "Éste es el Sacramento de nuestra fe."
      },
      {
        speaker: "Pueblo",
        response: true,
        texto: "Cada vez que comemos de este pan y bebemos de este cáliz, anunciamos tu muerte, Señor, hasta que vuelvas."
      },
      {
        tipo: "rubrica",
        texto: "Memorial y Oblación (IGMR 79e-f):"
      },
      {
        speaker: "Sacerdote",
        texto: "Así, pues, Padre, al celebrar ahora el memorial de la pasión salvadora de tu Hijo, de su admirable resurrección y ascensión al cielo, mientras esperamos su venida gloriosa, te ofrecemos, en esta acción de gracias, el sacrificio vivo y santo. Dirige tu mirada sobre la ofrenda de tu Iglesia, y reconoce en ella a la Víctima por cuya inmolación quisiste devolvernos tu amistad, para que, fortalecidos con el Cuerpo y la Sangre de tu Hijo y llenos de su Espíritu Santo, formemos en Cristo un solo cuerpo y un solo espíritu."
      },
      {
        speaker: "Sacerdote",
        texto: "Que él nos transforme en ofrenda permanente, para que gocemos de tu heredad junto con tus elegidos: con María, la Virgen Madre de Dios, su esposo san José, los apóstoles y los mártires, y todos los santos, por cuya intercesión confiamos obtener siempre tu ayuda."
      },
      {
        tipo: "rubrica",
        texto: "Intercesiones por la Iglesia y el mundo (IGMR 79g):"
      },
      {
        speaker: "Sacerdote",
        texto: "Te pedimos, Padre, que esta Víctima de reconciliación traiga la paz y la salvación al mundo entero. Confirma en la fe y en la caridad a tu Iglesia, peregrina en la tierra: a tu servidor, el Papa N., a nuestro Obispo N., al orden episcopal, a los presbíteros y diáconos, y a todo el pueblo redimido por ti. Atiende los deseos y súplicas de esta familia que has congregado en tu presencia. Reúne en torno a ti, Padre misericordioso, a todos tus hijos dispersos por el mundo."
      },
      {
        speaker: "Sacerdote",
        texto: "A nuestros hermanos difuntos y a cuantos murieron en tu amistad recíbelos en tu reino, donde esperamos gozar todos juntos de la plenitud eterna de tu gloria, por Cristo, Señor nuestro, por quien concedes al mundo todos los bienes."
      },
      {
        tipo: "rubrica",
        texto: "Doxología Final (IGMR 79h, 151):"
      },
      {
        speaker: "Sacerdote",
        texto: "Por Cristo, con él y en él, a ti, Dios Padre omnipotente, en la unidad del Espíritu Santo, todo honor y toda gloria por los siglos de los siglos."
      },
      {
        speaker: "Pueblo",
        response: true,
        texto: "¡Amén!"
      }
    ]
  },
  "4": {
    id: "4",
    nombre: "Plegaria Eucarística IV",
    prefacioPropio: true,
    descripcion: "Tiene un prefacio propio e inseparable que resume de modo admirable toda la historia de la salvación, desde la creación del cosmos hasta la redención en Cristo.",
    contenido: [
      {
        tipo: "rubrica",
        texto: "Esta plegaria posee su propio prefacio inseparable. Concluido el Santo, el sacerdote, con las manos extendidas, dice:"
      },
      {
        speaker: "Sacerdote",
        texto: "Te alabamos, Padre santo, porque eres grande y porque hiciste todas las cosas con sabiduría y amor. A imagen tuya creaste al hombre y le encomendaste el universo entero, para que, sirviéndote sólo a ti, su Creador, dominara todo lo creado. Y cuando por desobediencia perdió tu amistad, no lo abandonaste al poder de la muerte, sino que, compasivo, tendiste la mano a todos, para que te encuentre el que te busca. Reiteraste, además, tus alianzas a los hombres y por los profetas los fuiste formando en la esperanza de la salvación."
      },
      {
        speaker: "Sacerdote",
        texto: "Y tanto amaste al mundo, Padre santo, que, al cumplirse la plenitud de los tiempos, nos enviaste como salvador a tu único Hijo. El cual se encarnó por obra del Espíritu Santo, nació de María la Virgen, y así compartió en todo nuestra condición humana, menos en el pecado; anunció la salvación a los pobres, la liberación a los oprimidos y a los afligidos el consuelo. Para cumplir tus designios, él mismo se entregó a la muerte, y, resucitando, destruyó la muerte y nos dio nueva vida. Y con el fin de que no vivamos ya para nosotros mismos, sino para él, que por nosotros murió y resucitó, envió, Padre, desde tu seno al Espíritu Santo como primer don para los creyentes, para llevar a plenitud su obra en el mundo y santificar todas las cosas."
      },
      {
        tipo: "rubrica",
        texto: "Junta las manos y, teniéndolas extendidas sobre las ofrendas (Epíclesis - IGMR 79c, 150), dice:"
      },
      {
        speaker: "Sacerdote",
        texto: "Por eso, Padre, te rogamos que este mismo Espíritu santifique estas ofrendas, para que se conviertan en el Cuerpo y + la Sangre de Jesucristo, nuestro Señor, y así celebremos este gran misterio que él mismo nos dejó como alianza eterna."
      },
      {
        speaker: "Pueblo",
        response: true,
        texto: "Amén."
      },
      {
        tipo: "rubrica",
        texto: "Consagración del Pan (IGMR 79d, 150):"
      },
      {
        speaker: "Sacerdote",
        texto: "Porque él mismo, llegada la hora en que había de ser glorificado por ti, Padre santo, habiendo amado a los suyos que estaban en el mundo, los amó hasta el extremo. Y, mientras cenaba con ellos, tomó pan, te bendijo, lo partió y se lo dio a sus discípulos, diciendo:\n\n«TOMEN Y COMAN TODOS DE ÉL, PORQUE ESTO ES MI CUERPO, QUE SERÁ ENTREGADO POR USTEDES»."
      },
      {
        tipo: "rubrica",
        texto: "Muestra el pan consagrado al pueblo, lo deposita sobre la patena y hace una genuflexión en adoración (IGMR 150, 274). Luego prosigue:"
      },
      {
        speaker: "Sacerdote",
        texto: "Del mismo modo, tomó el cáliz lleno del fruto de la vid, te dio gracias y lo pasó a sus discípulos, diciendo:\n\n«TOMEN Y BEBAN TODOS DE ÉL, PORQUE ÉSTE ES EL CÁLIZ DE MI SANGRE, SANGRE DE LA ALIANZA NUEVA Y ETERNA, QUE SERÁ DERRAMADA POR USTEDES Y POR MUCHOS PARA EL PERDÓN DE LOS PECADOS. HAGAN ESTO EN CONMEMORACIÓN MÍA»."
      },
      {
        tipo: "rubrica",
        texto: "Muestra el cáliz al pueblo, lo deposita sobre el corporal y hace una genuflexión en adoración (IGMR 150, 274). El pueblo se pone de pie (o permanece de rodillas por costumbre laudable - IGMR 43). El sacerdote aclama (IGMR 151):"
      },
      {
        speaker: "Sacerdote",
        texto: "Éste es el Sacramento de nuestra fe."
      },
      {
        speaker: "Pueblo",
        response: true,
        texto: "Salvador del mundo, sálvanos, tú que nos has liberado por tu cruz y resurrección."
      },
      {
        tipo: "rubrica",
        texto: "Memorial e Intercesiones (IGMR 79e-g):"
      },
      {
        speaker: "Sacerdote",
        texto: "Por eso, Padre, al celebrar ahora el memorial de nuestra redención, recordamos la muerte de Cristo y su descenso al lugar de los muertos, proclamamos su resurrección y su ascensión a tu derecha, y, mientras esperamos su venida gloriosa, te ofrecemos su Cuerpo y su Sangre, sacrificio agradable a ti y salvación para todo el mundo."
      },
      {
        speaker: "Sacerdote",
        texto: "Dirige tu mirada sobre esta Víctima que tú mismo has preparado a tu Iglesia, y concede a cuantos compartimos este pan y este cáliz, que, congregados en un solo cuerpo por el Espíritu Santo, seamos en Cristo una ofrenda viva para alabanza de tu gloria."
      },
      {
        speaker: "Sacerdote",
        texto: "Y ahora, Señor, acuérdate de todos aquellos por quienes te ofrecemos este sacrificio: de tu servidor el Papa N., de nuestro Obispo N., del orden episcopal y de los presbíteros y diáconos, de los oferentes y de los aquí reunidos, de todo tu pueblo santo y de aquellos que te buscan con sincero corazón. Acuérdate también de los que murieron en la paz de Cristo y de todos los difuntos, cuya fe sólo tú conociste. Padre de bondad, concédenos, a todos tus hijos, alcanzar la herencia eterna con la Virgen María, Madre de Dios, con su esposo san José, con los apóstoles y los santos, en tu reino; donde, junto con toda la creación libre ya del pecado y de la muerte, te glorificaremos por Cristo, Señor nuestro, por quien concedes al mundo todos los bienes."
      },
      {
        tipo: "rubrica",
        texto: "Doxología Final (IGMR 79h, 151):"
      },
      {
        speaker: "Sacerdote",
        texto: "Por Cristo, con él y en él, a ti, Dios Padre omnipotente, en la unidad del Espíritu Santo, todo honor y toda gloria por los siglos de los siglos."
      },
      {
        speaker: "Pueblo",
        response: true,
        texto: "¡Amén!"
      }
    ]
  }
};

// 2. CATÁLOGO COMPLETO DE PREFACIOS POR TIEMPO LITÚRGICO
const prefaciosLiturgicos = {
  "to-1": {
    titulo: "Prefacio I de los Domingos del Tiempo Ordinario",
    subtitulo: "La salvación por el misterio pascual de Cristo",
    texto: "En verdad es justo y necesario, es nuestro deber y salvación darte gracias siempre y en todo lugar, Señor, Padre santo, Dios todopoderoso y eterno, por Cristo, Señor nuestro. Quien, por su misterio pascual, realizó la obra maravillosa de librarnos del pecado y de la muerte, llamándonos a la gloria de ser estirpe elegida, sacerdocio real, nación santa, pueblo adquirido por ti, para que proclamemos las maravillas de aquel que nos llamó de las tinieblas a su luz admirable. Por eso, con los ángeles y los arcángeles, con los tronos y las dominaciones y con todos los coros celestiales, cantamos sin cesar el himno de tu gloria:"
  },
  "to-2": {
    titulo: "Prefacio II de los Domingos del Tiempo Ordinario",
    subtitulo: "El misterio de la salvación",
    texto: "En verdad es justo y necesario, es nuestro deber y salvación darte gracias siempre y en todo lugar, Señor, Padre santo, Dios todopoderoso y eterno. Porque con amor entrañable creaste al hombre, con justicia lo condenaste cuando cayó, y con misericordia lo redimiste por Cristo, Señor nuestro. Por él, los ángeles celebran tu grandeza, te adoran las dominaciones y tiemblan las potestades; los cielos y las virtudes celestiales, junto con los bienaventurados serafines, se unen en un coro de júbilo para ensalzar tu gloria. Con ellos permítenos unir nuestras voces diciendo humildemente:"
  },
  "to-3": {
    titulo: "Prefacio III de los Domingos del Tiempo Ordinario",
    subtitulo: "Nuestra salvación por la muerte y resurrección de Cristo",
    texto: "En verdad es justo y necesario, es nuestro deber y salvación darte gracias siempre y en todo lugar, Señor, Padre santo, Dios todopoderoso y eterno. Porque compadecido del extravío de los hombres, Cristo quiso nacer de la Virgen María; muriendo en la cruz nos libró de la muerte eterna, y resucitando de entre los muertos nos dio vida perdurable. Por eso, con los ángeles y los arcángeles y con todos los coros celestiales, cantamos sin cesar el himno de tu gloria:"
  },
  "adv-1": {
    titulo: "Prefacio I de Adviento",
    subtitulo: "Las dos venidas de Cristo",
    texto: "En verdad es justo y necesario, es nuestro deber y salvación darte gracias siempre y en todo lugar, Señor, Padre santo, Dios todopoderoso y eterno, por Cristo, Señor nuestro. Quien, al venir por vez primera en la humildad de nuestra carne, realizó el plan eterno de tu amor y nos abrió el camino de la salvación eterna; para que, cuando venga de nuevo en la majestad de su gloria, podamos alcanzar los bienes prometidos que ahora esperamos vigilantes en la fe. Por eso, con los ángeles y los arcángeles, con los tronos y las dominaciones y con todos los coros celestiales, cantamos sin cesar el himno de tu gloria:"
  },
  "nav-1": {
    titulo: "Prefacio I de Navidad",
    subtitulo: "Cristo, luz radiante en nuestra noche",
    texto: "En verdad es justo y necesario, es nuestro deber y salvación darte gracias siempre y en todo lugar, Señor, Padre santo, Dios todopoderoso y eterno. Porque gracias al misterio de la Palabra hecha carne, la luz de tu gloria ha brillado ante nuestros ojos con nuevo resplandor; para que, conociendo a Dios visiblemente, seamos arrebatados por él al amor de las realidades invisibles. Por eso, con los ángeles y los arcángeles, con los tronos y dominaciones y con toda la milicia celestial, cantamos el himno de tu gloria, diciendo sin cesar:"
  },
  "cua-1": {
    titulo: "Prefacio I de Cuaresma",
    subtitulo: "El significado espiritual de la Cuaresma",
    texto: "En verdad es justo y necesario, es nuestro deber y salvación darte gracias siempre y en todo lugar, Señor, Padre santo, Dios todopoderoso y eterno, por Cristo, Señor nuestro. Quien, al conceder a tus fieles esperar año tras año con gozo pascual la fiesta de la Pascua, les concede purificar su espíritu, entregarse con mayor devoción a la oración y a la caridad, y así alcanzar la plenitud de los hijos de Dios. Por eso, con los ángeles y arcángeles, tronos y dominaciones, cantamos sin cesar el himno de tu gloria:"
  },
  "pas-1": {
    titulo: "Prefacio I de Pascua",
    subtitulo: "El misterio pascual de la Resurrección",
    texto: "En verdad es justo y necesario, es nuestro deber y salvación aclamarte siempre, Señor, pero más que nunca en este día (tiempo) en que Cristo, nuestra Pascua, ha sido inmolado. Porque él es el verdadero Cordero que quitó el pecado del mundo: muriendo destruyó nuestra muerte, y resucitando restauró nuestra vida. Por eso, con esta efusión de gozo pascual, el mundo entero se desborda de alegría, y también los coros celestiales, los ángeles y los arcángeles, cantan sin cesar el himno de tu gloria:"
  },
  "pent-1": {
    titulo: "Prefacio de Pentecostés",
    subtitulo: "El misterio de Pentecostés y el don del Espíritu Santo",
    texto: "En verdad es justo y necesario, es nuestro deber y salvación darte gracias siempre y en todo lugar, Señor, Padre santo, Dios todopoderoso y eterno. Porque, para llevar a plenitud el misterio pascual, derramaste hoy el Espíritu Santo sobre los que habían sido adoptados como hijos tuyos en comunión con tu Unigénito. Aquel mismo Espíritu que, al nacer la Iglesia, infundió el conocimiento de Dios en todos los pueblos y congregó en la unidad de una sola fe la diversidad de todas las lenguas. Por eso, con efusión de gozo celestial, el mundo entero se alegra y canta tu alabanza:"
  }
};

// 3. GENERADOR DE LOS 34 DOMINGOS DEL TIEMPO ORDINARIO Y TIEMPOS LITÚRGICOS
const misasDB = [];

function crearMisa(cfg) {
  misasDB.push(cfg);
}

// ADVIENTO
crearMisa({
  id: "adv-1",
  tiempo: "Adviento",
  categoria: "Tiempo de Adviento",
  nombre: "I Domingo de Adviento",
  color: "morado",
  colorHex: "#7e22ce",
  antifonaEntrada: "A ti, Señor, levanto mi alma; Dios mío, en ti confío, no quede yo defraudado ni se rían de mí mis enemigos; los que esperan en ti no quedan defraudados. (Sal 24, 1-3)",
  colecta: "Concede a tus fieles, Dios todopoderoso, el deseo de salir al encuentro de Cristo con buenas obras, para que, colocados un día a su derecha, merezcan poseer el reino celestial. Por nuestro Señor Jesucristo.",
  lectura1: {
    cita: "Jeremías 33, 14-16",
    texto: "Mirad que llegan días —oráculo del Señor— en que cumpliré la promesa que hice a la casa de Israel y a la casa de Judá. En aquellos días y en aquella hora suscitaré a David un vástago legítimo que hará justicia y derecho en la tierra. En aquellos días se salvará Judá y Jerusalén vivirá tranquila, y la llamarán: «El Señor es nuestra justicia»."
  },
  salmo: {
    cita: "Salmo 24, 4-5ab. 8-9. 10 y 14",
    respuesta: "A ti, Señor, levanto mi alma.",
    estrofas: [
      "Señor, enséñame tus caminos, instrúyeme en tus sendas: haz que camine con lealtad; enséñame, porque tú eres mi Dios y Salvador.",
      "El Señor es bueno y es recto, y enseña el camino a los pecadores; hace caminar a los humildes con rectitud, enseña su camino a los humildes.",
      "Las sendas del Señor son misericordia y lealtad para los que guardan su alianza y sus mandatos. El Señor se confía a los que lo temen, y les da a conocer su alianza."
    ]
  },
  lectura2: {
    cita: "1 Tesalonicenses 3, 12 — 4, 2",
    texto: "Hermanos: Que el Señor os colme y os haga rebosar de amor mutuo y de amor a todos, lo mismo que nosotros os amamos; para que vuestros corazones se mantengan firmes e irreprochables en la santidad ante Dios, nuestro Padre, en la venida de nuestro Señor Jesús con todos sus santos. Por lo demás, hermanos, os rogamos y exhortamos en el Señor Jesús: ya que habéis aprendido de nosotros cómo debéis comportaros para agradar a Dios, esmeraos más y más."
  },
  aleluya: {
    versiculo: "Muéstranos, Señor, tu misericordia y danos tu salvación. (Sal 84, 8)"
  },
  evangelio: {
    cita: "Lucas 21, 25-28. 34-36",
    texto: "En aquel tiempo, dijo Jesús a sus discípulos: «Habrá signos en el sol y la luna y las estrellas, y en la tierra angustia de las gentes, perplejas por el estruendo del mar y el oleaje, desfalleciendo los hombres por el miedo y la ansiedad ante lo que se le viene encima al mundo, pues los astros se tambalearán. Entonces verán al Hijo del hombre venir en una nube, con gran poder y majestad. Cuando empiece a suceder esto, levantaos, alzad la cabeza; se acerca vuestra liberación. Tened cuidado de vosotros, no sea que se emboten vuestros corazones con juergas, borracheras y las inquietudes de la vida, y se os eche encima de repente aquel día; porque caerá como un lazo sobre todos los habitantes de la tierra. Estad, pues, despiertos en todo tiempo, pidiendo que podáis escapar de todo lo que está por suceder y manteneros en pie ante el Hijo del hombre»."
  },
  ofrendas: "Acepta, Señor, estos dones que recibimos de tu generosidad y ahora te presentamos; concédenos que la celebración fervorosa de estos misterios en el tiempo presente sea para nosotros prenda de redención eterna. Por Jesucristo, nuestro Señor.",
  prefacioId: "adv-1",
  antifonaComunion: "El Señor nos dará la lluvia y nuestra tierra dará su fruto. (Sal 84, 13)",
  postcomunion: "Te pedimos, Señor, que nos aproveche la participación en estos sacramentos con los que nos enseñas a valorar los bienes del cielo y a buscar los que duran para siempre en medio de las realidades pasajeras de este mundo. Por Jesucristo, nuestro Señor."
});

crearMisa({
  id: "adv-2",
  tiempo: "Adviento",
  categoria: "Tiempo de Adviento",
  nombre: "II Domingo de Adviento",
  color: "morado",
  colorHex: "#7e22ce",
  antifonaEntrada: "Pueblo de Sión, mira al Señor que viene a salvar a las naciones; el Señor hará oír la majestad de su voz en el júbilo de vuestro corazón. (Cfr. Is 30, 19. 30)",
  colecta: "Dios todopoderoso y misericordioso, no permitas que los afanes de este mundo impidan a los que van alegres al encuentro de tu Hijo; que la sabiduría celestial nos guíe hacia la comunión con él. Que vive y reina contigo.",
  lectura1: {
    cita: "Baruc 5, 1-9",
    texto: "Jerusalén, desnúdate de tu manto de luto y aflicción, y vístete para siempre con las galas de la gloria que Dios te da; envuélvete en el manto de la justicia de Dios y ponte en la cabeza la diadema de la gloria del Eterno... Porque Dios ha mandado abajar todos los montes elevados y las colinas empinadas, rellenar los barrancos hasta allanar el suelo, para que Israel camine con seguridad bajo la gloria de Dios."
  },
  salmo: {
    cita: "Salmo 125",
    respuesta: "El Señor ha estado grande con nosotros, y estamos alegres.",
    estrofas: [
      "Cuando el Señor hizo volver a los cautivos de Sión, nos parecía soñar: la boca se nos llenaba de risas, la lengua de cantares.",
      "Hasta los gentiles decían: «El Señor ha estado grande con ellos». El Señor ha estado grande con nosotros, y estamos alegres.",
      "Que el Señor cambie nuestra suerte como los torrentes del Negueb. Los que sembraban con lágrimas cosechan entre cantares."
    ]
  },
  lectura2: {
    cita: "Filipenses 1, 4-6. 8-11",
    texto: "Hermanos: Siempre que rezo por vosotros, lo hago con gran alegría, por vuestra colaboración en la difusión del Evangelio desde el primer día hasta hoy. Estoy convencido de que quien comenzó en vosotros esta obra buena la irá perfeccionando hasta el día de Cristo Jesús."
  },
  aleluya: {
    versiculo: "Preparad el camino del Señor, allanad sus senderos. Todos verán la salvación de Dios. (Lc 3, 4. 6)"
  },
  evangelio: {
    cita: "Lucas 3, 1-6",
    texto: "En el año quince del reinado del emperador Tiberio... vino la palabra de Dios sobre Juan, hijo de Zacarías, en el desierto. Y recorrió toda la comarca del Jordán, predicando un bautismo de conversión para el perdón de los pecados, como está escrito en el libro de los oráculos del profeta Isaías: «Voz del que grita en el desierto: Preparad el camino del Señor, allanad sus senderos... Y todos verán la salvación de Dios»."
  },
  ofrendas: "Que las súplicas y las ofrendas de nuestra pobreza te conmuevan, Señor, y, al vernos desprovistos de méritos propios, socórrenos con el auxilio de tu misericordia. Por Jesucristo, nuestro Señor.",
  prefacioId: "adv-1",
  antifonaComunion: "Levántate, Jerusalén, ponte en pie en la altura y contempla el gozo que te viene de tu Dios. (Bar 5, 5; 4, 36)",
  postcomunion: "Saciados con este alimento espiritual, te suplicamos, Señor, que nos enseñes a valorar las realidades de la tierra según la sabiduría de la cruz y a poner nuestro corazón en los bienes del cielo. Por Jesucristo, nuestro Señor."
});

crearMisa({
  id: "adv-3",
  tiempo: "Adviento",
  categoria: "Tiempo de Adviento",
  nombre: "III Domingo de Adviento (Gaudete)",
  color: "rosa",
  colorHex: "#ec4899",
  antifonaEntrada: "Estad siempre alegres en el Señor; os lo repito, estad alegres. Que vuestra mesura la conozca todo el mundo. El Señor está cerca. (Flp 4, 4-5)",
  colecta: "Señor, que contemplas a tu pueblo esperando fielmente la fiesta del nacimiento de tu Hijo, concédenos llegar a la alegría de tan gran salvación y celebrarla siempre con gozo y júbilo desbordante. Por nuestro Señor Jesucristo.",
  lectura1: {
    cita: "Sofonías 3, 14-18a",
    texto: "Regocíjate, hija de Sión; grita de júbilo, Israel; alégrate y gózate de todo corazón, Jerusalén. El Señor ha cancelado tu condena, ha expulsado a tus enemigos. El Señor será el rey de Israel, en medio de ti; ya no temerás mal alguno."
  },
  salmo: {
    cita: "Isaías 12, 2-3. 4bcd. 5-6",
    respuesta: "Gritad jubilosos: «Qué grande es en medio de ti el Santo de Israel».",
    estrofas: [
      "El Señor es mi Dios y Salvador: confiaré y no temeré, porque mi fuerza y mi poder es el Señor, él fue mi salvación.",
      "Dad gracias al Señor, invocad su nombre, contad a los pueblos sus hazañas, proclamad que su nombre es excelso.",
      "Tañed para el Señor, que hizo proezas, anunciadlas a toda la tierra; gritad jubilosos, habitantes de Sión: «Qué grande es en medio de ti el Santo de Israel»."
    ]
  },
  lectura2: {
    cita: "Filipenses 4, 4-7",
    texto: "Hermanos: Estad siempre alegres en el Señor; os lo repito, estad alegres. Que vuestra mesura la conozca todo el mundo. El Señor está cerca. Nada os preocupe; sino que, en toda ocasión, en la oración y en la súplica con acción de gracias, vuestras peticiones sean presentadas a Dios."
  },
  aleluya: {
    versiculo: "El Espíritu del Señor está sobre mí; me ha enviado para anunciar el Evangelio a los pobres. (Is 61, 1)"
  },
  evangelio: {
    cita: "Lucas 3, 10-18",
    texto: "En aquel tiempo, la gente preguntaba a Juan: «¿Entonces, qué debemos hacer?». Él contestaba: «El que tenga dos túnicas, que comparta con el que no tiene; y el que tenga comida, haga lo mismo»... Juan les dijo: «Yo os bautizo con agua; pero viene el que es más fuerte que yo... él os bautizará con Espíritu Santo y fuego»."
  },
  ofrendas: "Que este sacrificio, Señor, ofrecido sin cesar en tu presencia, realice plenamente el misterio instituido y actúe con eficacia en nosotros tu salvación. Por Jesucristo, nuestro Señor.",
  prefacioId: "adv-1",
  antifonaComunion: "Decid a los cobardes de corazón: «Sed fuertes, no temáis; mirad a vuestro Dios que viene a salvaros». (Cfr. Is 35, 4)",
  postcomunion: "Imploramos, Señor, tu clemencia, para que este sacramento divino nos purifique de nuestros pecados y nos disponga para las fiestas que se acercan. Por Jesucristo, nuestro Señor."
});

crearMisa({
  id: "adv-4",
  tiempo: "Adviento",
  categoria: "Tiempo de Adviento",
  nombre: "IV Domingo de Adviento",
  color: "morado",
  colorHex: "#7e22ce",
  antifonaEntrada: "Cielos, destilad el rocío de lo alto, y que las nubes lluevan al Justo; ábrase la tierra y brote la salvación. (Cfr. Is 45, 8)",
  colecta: "Derrama, Señor, tu gracia sobre nosotros, que, por el anuncio del ángel, hemos conocido la encarnación de tu Hijo Jesucristo, para que, por su pasión y su cruz, lleguemos a la gloria de la resurrección. Por nuestro Señor Jesucristo.",
  lectura1: {
    cita: "Miqueas 5, 1-4a",
    texto: "Así dice el Señor: «Pero tú, Belén de Efrata, pequeña entre las aldeas de Judá, de ti saldrá el jefe de Israel. Su origen es desde lo antiguo, de tiempo inmemorial... Se mantendrá firme y pastoreará con la fuerza del Señor, con el dominio del nombre del Señor, su Dios»."
  },
  salmo: {
    cita: "Salmo 79",
    respuesta: "Oh Dios, restáuranos, que brille tu rostro y nos salvaremos.",
    estrofas: [
      "Pastor de Israel, escucha, tú que te sientas sobre querubines, resplandece; despierta tu poder y ven a salvarnos.",
      "Dios del universo, vuélvete: mira desde el cielo, fíjate, ven a visitar tu viña, la cepa que tu diestra plantó.",
      "Que tu mano proteja a tu escogido, al hombre que tú fortaleciste. No nos apartaremos de ti: danos vida, para que invoquemos tu nombre."
    ]
  },
  lectura2: {
    cita: "Hebreos 10, 5-10",
    texto: "Hermanos: Al entrar Cristo en el mundo dice: «Tú no quisiste sacrificios ni ofrendas, pero me formaste un cuerpo... Entonces dije: He aquí que vengo para hacer, oh Dios, tu voluntad»... Y conforme a esa voluntad todos quedamos santificados por la oblación del cuerpo de Jesucristo, hecha una vez para siempre."
  },
  aleluya: {
    versiculo: "He aquí la esclava del Señor; hágase en mí según tu palabra. (Lc 1, 38)"
  },
  evangelio: {
    cita: "Lucas 1, 39-45",
    texto: "En aquellos días, María se levantó y se puso en camino de prisa hacia la montaña, a una ciudad de Judá; entró en casa de Zacarías y saludó a Isabel. Aconteció que, en cuanto Isabel oyó el saludo de María, saltó la criatura en su vientre. Se llenó Isabel de Espíritu Santo y, levantando la voz, exclamó: «¡Bendita tú entre las mujeres, y bendito el fruto de tu vientre!»."
  },
  ofrendas: "Que el mismo Espíritu Santo que santificó el seno virginal de María santifique, Señor, estos dones que hemos colocado sobre tu altar. Por Jesucristo, nuestro Señor.",
  prefacioId: "adv-1",
  antifonaComunion: "Mirad: la Virgen concebirá y dará a luz un hijo, y le pondrá por nombre Emmanuel. (Is 7, 14)",
  postcomunion: "Habiendo recibido la prenda de la redención eterna, te pedimos, Dios todopoderoso, que, cuanto más se acerca el día de nuestra salvación, con mayor fervor nos preparemos para celebrar dignamente el misterio del nacimiento de tu Hijo. Que vive y reina por los siglos de los siglos."
});

// NAVIDAD
crearMisa({
  id: "nav-noche",
  tiempo: "Navidad",
  categoria: "Tiempo de Navidad",
  nombre: "Natividad del Señor: Misa de Medianoche (Nochebuena)",
  color: "blanco",
  colorHex: "#e2e8f0",
  antifonaEntrada: "El Señor me ha dicho: «Tú eres mi Hijo; yo te he engendrado hoy». (Sal 2, 7)",
  colecta: "Señor Dios, que has iluminado esta noche santísima con el resplandor de Cristo, la luz verdadera, concédenos gozar en el cielo del esplendor de su gloria a los que hemos conocido en la tierra los misterios de su claridad. Por nuestro Señor Jesucristo.",
  lectura1: {
    cita: "Isaías 9, 1-6",
    texto: "El pueblo que caminaba en tinieblas vio una luz grande; habitaban en tierra y sombras de muerte, y una luz les brilló... Porque un niño nos ha nacido, un hijo se nos ha dado: lleva a hombros el principado y es su nombre: «Maravilla de Consejero, Dios fuerte, Padre perpetuo, Príncipe de la paz»."
  },
  salmo: {
    cita: "Salmo 95",
    respuesta: "Hoy nos ha nacido un Salvador: el Mesías, el Señor.",
    estrofas: [
      "Cantad al Señor un cántico nuevo, cantad al Señor, toda la tierra; cantad al Señor, bendecid su nombre.",
      "Proclamad día tras día su salvación. Contad a los pueblos su gloria, sus maravillas a todas las naciones.",
      "Alégrese el cielo, goce la tierra, retumbe el mar y cuanto lo llena; vitoreen los campos y cuanto hay en ellos."
    ]
  },
  lectura2: {
    cita: "Tito 2, 11-14",
    texto: "Querido hermano: Ha aparecido la gracia de Dios, que trae la salvación para todos los hombres, enseñándonos a renunciar a una vida sin religión y a los deseos mundanos, y a llevar ya desde ahora una vida sobria, honrada y religiosa, aguardando la dicha que esperamos: la aparición gloriosa del gran Dios y Salvador nuestro, Jesucristo."
  },
  aleluya: {
    versiculo: "Os anuncio una gran alegría: hoy nos ha nacido un Salvador: el Mesías, el Señor. (Lc 2, 10-11)"
  },
  evangelio: {
    cita: "Lucas 2, 1-14",
    texto: "Aconteció en aquellos días que salió un decreto del emperador Augusto, ordenando hacer un censo del mundo entero... Y mientras estaban allí, le llegó el tiempo del parto y dio a luz a su hijo primogénito, lo envolvió en pañales y lo acostó en un pesebre, porque no había sitio para ellos en la posada... El ángel les dijo a los pastores: «No temáis, os anuncio una gran alegría... Gloria a Dios en el cielo, y en la tierra paz a los hombres que ama el Señor»."
  },
  ofrendas: "Acepta, Señor, la ofrenda de la fiesta de hoy, y concédenos, por este santo intercambio de dones, que nos configuremos con Cristo, en quien nuestra sustancia mortal se une a tu divinidad. Por Jesucristo, nuestro Señor.",
  prefacioId: "nav-1",
  antifonaComunion: "La Palabra se hizo carne y contemplamos su gloria. (Jn 1, 14)",
  postcomunion: "Señor y Dios nuestro, concede a los que celebramos con gozo el nacimiento de nuestro Redentor que, por una vida santa, merezcamos gozar de su presencia en el cielo. Por Jesucristo, nuestro Señor."
});

crearMisa({
  id: "nav-epifania",
  tiempo: "Navidad",
  categoria: "Tiempo de Navidad",
  nombre: "Epifanía del Señor",
  color: "blanco",
  colorHex: "#e2e8f0",
  antifonaEntrada: "Ya viene el Señor soberano; en su mano está el reino, la potestad y el imperio. (Cfr. Mal 3, 1; 1 Crón 29, 12)",
  colecta: "Señor Dios, que en este día revelaste a tu Hijo único a los pueblos paganos por medio de una estrella, concédenos a los que ya te conocemos por la fe llegar a contemplar la hermosura de tu gloria en el cielo. Por nuestro Señor Jesucristo.",
  lectura1: {
    cita: "Isaías 60, 1-6",
    texto: "¡Levántate, brilla, Jerusalén, que llega tu luz; la gloria del Señor amanece sobre ti!... Caminarán los pueblos a tu luz, los reyes al resplandor de tu aurora. Levanta la vista en torno, mira: todos ésos se han reunido, vienen hacia ti... Te inundará una multitud de camellos... traerán oro e incienso y proclamarán las alabanzas del Señor."
  },
  salmo: {
    cita: "Salmo 71",
    respuesta: "Se postrarán ante ti, Señor, todos los reyes de la tierra.",
    estrofas: [
      "Dios mío, confía tu juicio al rey, tu justicia al hijo de reyes, para que rija a tu pueblo con justicia, a tus humildes con rectitud.",
      "Los reyes de Tarsis y de las islas le paguen tributo; los reyes de Sabá y de Arabia le ofrezcan sus dones; póstrense ante él todos los reyes, y sírvanle todos los pueblos.",
      "Él librará al pobre que clamaba, al afligido que no tenía protector; él se apiadará del pobre y del indigente, y salvará la vida de los pobres."
    ]
  },
  lectura2: {
    cita: "Efesios 3, 2-3a. 5-6",
    texto: "Hermanos: Habéis oído hablar de la distribución de la gracia de Dios que se me ha dado en favor vuestro... que también los gentiles son coherederos, miembros del mismo cuerpo, y partícipes de la misma promesa en Jesucristo, por medio del Evangelio."
  },
  aleluya: {
    versiculo: "Hemos visto su estrella en el oriente y venimos a adorar al Señor. (Mt 2, 2)"
  },
  evangelio: {
    cita: "Mateo 2, 1-12",
    texto: "Habiendo nacido Jesús en Belén de Judea en tiempos del rey Herodes, unos magos de Oriente se presentaron en Jerusalén preguntando: «¿Dónde está el Rey de los judíos que ha nacido? Porque hemos visto salir su estrella y venimos a adorarlo»... Entraron en la casa, vieron al niño con María, su madre, y cayendo de rodillas lo adoraron; abrieron sus cofres y le ofrecieron regalos: oro, incienso y mirra."
  },
  ofrendas: "Mira con bondad, Señor, los dones de tu Iglesia, que no son oro, incienso y mirra, sino el mismo Jesucristo que en estos dones se proclama, se inmola y se recibe como alimento. Por Jesucristo, nuestro Señor.",
  prefacioId: "nav-1",
  antifonaComunion: "Hemos visto su estrella en el oriente y venimos con ofrendas a adorar al Señor. (Cfr. Mt 2, 2)",
  postcomunion: "Que tu luz celestial nos guíe siempre y en todo lugar, Señor, para que contemplemos con ojos limpios y recibamos con amor sincero el misterio de cuya participación nos has hecho dignos. Por Jesucristo, nuestro Señor."
});

// CUARESMA
crearMisa({
  id: "cua-ceniza",
  tiempo: "Cuaresma",
  categoria: "Tiempo de Cuaresma",
  nombre: "Miércoles de Ceniza",
  color: "morado",
  colorHex: "#7e22ce",
  antifonaEntrada: "Te compadeces de todos, Señor, y no odias nada de lo que has hecho; pasas por alto los pecados de los hombres para que se arrepientan, y los perdonas, porque tú eres el Señor, nuestro Dios. (Sab 11, 24. 25. 27)",
  colecta: "Concédenos, Señor, iniciar con el santo ayuno una campaña de combate cristiano, para que, al luchar contra los enemigos espirituales, nos fortalezca la templanza. Por nuestro Señor Jesucristo.",
  lectura1: {
    cita: "Joel 2, 12-18",
    texto: "«Ahora —oráculo del Señor— convertíos a mí de todo corazón con ayuno, con llanto, con luto. Rasgad vuestros corazones, no vuestros vestidos; convertíos al Señor, vuestro Dios, porque es clemente y misericordioso, lento a la cólera, rico en piedad»."
  },
  salmo: {
    cita: "Salmo 50",
    respuesta: "Misericordia, Señor: hemos pecado.",
    estrofas: [
      "Misericordia, Dios mío, por tu bondad, por tu inmensa compasión borra mi culpa; lava del todo mi delito, limpia mi pecado.",
      "Pues yo reconozco mi culpa, tengo siempre presente mi pecado: contra ti, contra ti solo pequé, cometí la maldad que aborreces.",
      "Oh Dios, crea en mí un corazón puro, renuévame por dentro con espíritu firme; no me arrojes lejos de tu rostro, no me quites tu santo espíritu."
    ]
  },
  lectura2: {
    cita: "2 Corintios 5, 20 — 6, 2",
    texto: "Hermanos: Somos embajadores de Cristo, y es como si Dios os exhortara por medio de nosotros. En nombre de Cristo os pedimos que os reconciliéis con Dios... Mirad, ahora es el tiempo favorable, ahora es el día de la salvación."
  },
  aleluya: {
    versiculo: "Hoy no endurezcáis vuestro corazón, escuchad la voz del Señor. (Sal 94, 8)"
  },
  evangelio: {
    cita: "Mateo 6, 1-6. 16-18",
    texto: "En aquel tiempo, dijo Jesús a sus discípulos: «Cuidad de no practicar vuestra justicia delante de los hombres para ser vistos por ellos... Tú, cuando hagas limosna, que no sepa tu mano izquierda lo que hace tu derecha... Tú, cuando ores, entra en tu cuarto, cierra la puerta y ora a tu Padre que está en lo secreto... Y cuando ayunéis, no pongáis cara triste... perfúmate la cabeza y lávate la cara»."
  },
  ofrendas: "Al ofrecerte este sacrificio solemne al comienzo de la Cuaresma, te suplicamos, Señor, que, por las obras de penitencia y caridad, dominemos las malas pasiones y, limpios de pecado, merezcamos celebrar con fervor la pasión de tu Hijo. Que vive y reina por los siglos de los siglos.",
  prefacioId: "cua-1",
  antifonaComunion: "El que medita la ley del Señor día y noche, da fruto en su sazón. (Cfr. Sal 1, 2-3)",
  postcomunion: "Que este sacramento que hemos recibido, Señor, nos sirva de ayuda para que nuestro ayuno sea agradable a tus ojos y provechoso para la curación de nuestras almas. Por Jesucristo, nuestro Señor."
});

crearMisa({
  id: "cua-ramos",
  tiempo: "Cuaresma",
  categoria: "Semana Santa",
  nombre: "Domingo de Ramos en la Pasión del Señor",
  color: "rojo",
  colorHex: "#dc2626",
  antifonaEntrada: "¡Hosanna al Hijo de David! ¡Bendito el que viene en nombre del Señor! ¡Hosanna en las alturas!",
  colecta: "Dios todopoderoso y eterno, que quisiste que nuestro Salvador se anonadase haciéndose hombre y muriendo en la cruz para que la humanidad tuviera un ejemplo de humildad, concédenos participar de las enseñanzas de su pasión para tener parte en su resurrección gloriosa. Por nuestro Señor Jesucristo.",
  lectura1: {
    cita: "Isaías 50, 4-7",
    texto: "El Señor Dios me ha dado una lengua de discípulo para saber decir al abatido una palabra de aliento... Mi rostro no hurté a los insultos y salivazos. Pero el Señor Dios me ayuda, por eso no quedé confundido."
  },
  salmo: {
    cita: "Salmo 21",
    respuesta: "Dios mío, Dios mío, ¿por qué me has abandonado?",
    estrofas: [
      "Al verme se burlan de mí, hacen visajes, menean la cabeza: «Acudió al Señor, que lo ponga a salvo; que lo libre, si tanto lo quiere».",
      "Me acorrala una jauría de mastines, me cerca una banda de malhechores; me taladran las manos y los pies, puedo contar todos mis huesos.",
      "Se reparten mi ropa, echan a suertes mi túnica. Pero tú, Señor, no te quedes lejos; fuerza mía, ven corriendo a socorrerme."
    ]
  },
  lectura2: {
    cita: "Filipenses 2, 6-11",
    texto: "Cristo Jesús, a pesar de su condición divina, no hizo alarde de su categoría de Dios; al contrario, se despojó de su rango y tomó la condición de esclavo, pasando por uno de tantos... Y por eso Dios lo levantó sobre todo y le concedió el «Nombre-sobre-todo-nombre»."
  },
  aleluya: {
    versiculo: "Cristo se hizo por nosotros obediente hasta la muerte, y una muerte de cruz. (Flp 2, 8-9)"
  },
  evangelio: {
    cita: "Marcos 14, 1 — 15, 47 (Pasión de nuestro Señor Jesucristo)",
    texto: "Pasión de nuestro Señor Jesucristo según san Marcos: Faltaban dos días para la fiesta de la Pascua... Jesús, tomando pan, pronunció la bendición, lo partió y se lo dio diciendo: «Tomad, esto es mi cuerpo»... Y llevaron a Jesús al Gólgota... Y a la hora nona Jesús clamó con voz potente: «Eloí, Eloí, ¿lemá sabactaní?», que significa: «Dios mío, Dios mío, ¿por qué me has abandonado?»."
  },
  ofrendas: "Por la pasión de tu Hijo unigénito apresura, Señor, el momento de nuestra reconciliación, y concédenos alcanzar por este único y admirable sacrificio la misericordia que no merecen nuestras obras. Por Jesucristo, nuestro Señor.",
  prefacioId: "cua-1",
  antifonaComunion: "Padre mío, si no es posible que este cáliz pase sin que yo lo beba, hágase tu voluntad. (Mt 26, 42)",
  postcomunion: "Saciados con estos dones santos, te pedimos, Señor, que, así como nos has fortalecido en la esperanza de los bienes eternos por la muerte de tu Hijo, nos hagas llegar a la meta deseada por su gloriosa resurrección. Por Jesucristo, nuestro Señor."
});

// PASCUA
crearMisa({
  id: "pas-domingo",
  tiempo: "Pascua",
  categoria: "Tiempo Pascual",
  nombre: "Domingo de Pascua de la Resurrección del Señor",
  color: "blanco",
  colorHex: "#e2e8f0",
  antifonaEntrada: "He resucitado y aún estoy contigo, aleluya; has puesto sobre mí tu mano, aleluya; tu sabiduría ha sido maravillosa, aleluya, aleluya. (Cfr. Sal 138, 18. 5. 6)",
  colecta: "Señor Dios, que en este día nos has abierto las puertas de la eternidad por medio de tu Hijo unigénito, vencedor de la muerte, concédenos a los que celebramos la fiesta de su resurrección ser renovados por tu Espíritu y resucitar a la luz de la vida. Por nuestro Señor Jesucristo.",
  lectura1: {
    cita: "Hechos de los Apóstoles 10, 34a. 37-43",
    texto: "En aquellos días, Pedro tomó la palabra y dijo: «Vosotros conocéis lo que sucedió en toda Judea... cómo a Jesús de Nazaret Dios lo ungió con Espíritu Santo y con poder, y cómo pasó haciendo el bien y curando a todos los oprimidos por el diablo... Lo mataron colgándolo de un madero. Pero Dios lo resucitó al tercer día»."
  },
  salmo: {
    cita: "Salmo 117",
    respuesta: "Éste es el día que hizo el Señor: sea nuestra alegría y nuestro gozo.",
    estrofas: [
      "Dad gracias al Señor porque es bueno, porque es eterna su misericordia. Diga la casa de Israel: eterna es su misericordia.",
      "La diestra del Señor es excelsa, la diestra del Señor hace proezas. No he de morir, viviré para contar las hazañas del Señor.",
      "La piedra que desecharon los arquitectos es ahora la piedra angular. Es el Señor quien lo ha hecho, ha sido un milagro patente."
    ]
  },
  lectura2: {
    cita: "Colosenses 3, 1-4",
    texto: "Hermanos: Si habéis resucitado con Cristo, buscad los bienes de allá arriba, donde está Cristo sentado a la derecha de Dios; aspirad a los bienes de arriba, no a los de la tierra. Porque habéis muerto; y vuestra vida está con Cristo escondida en Dios."
  },
  aleluya: {
    versiculo: "Ha resucitado Cristo, nuestra Pascua; celebremos la fiesta con los panes ázimos de la sinceridad y la verdad. (1 Cor 5, 7-8)"
  },
  evangelio: {
    cita: "Juan 20, 1-9",
    texto: "El primer día de la semana, María la Magdalena fue al sepulcro al amanecer, cuando aún estaba oscuro, y vio la losa quitada del sepulcro. Echó a correr y fue donde estaba Simón Pedro y el otro discípulo, a quien Jesús amaba, y les dijo: «Se han llevado del sepulcro al Señor y no sabemos dónde lo han puesto»... Vieron los lienzos en el suelo... Vio y creyó. Pues hasta entonces no habían entendido la Escritura: que él había de resucitar de entre los muertos."
  },
  ofrendas: "Rebosantes de gozo pascual, te ofrecemos, Señor, el sacrificio por el cual tu Iglesia de modo admirable renace y se alimenta. Por Jesucristo, nuestro Señor.",
  prefacioId: "pas-1",
  antifonaComunion: "Ha resucitado Cristo, nuestra Pascua, aleluya; celebremos la fiesta con los panes ázimos de la sinceridad y de la verdad, aleluya, aleluya. (1 Cor 5, 7-8)",
  postcomunion: "Protege con amor continuo, Dios todopoderoso, a tu Iglesia, para que, renovada por los sacramentos pascuales, llegue a la gloria de la resurrección. Por Jesucristo, nuestro Señor."
});

crearMisa({
  id: "pas-pentecostes",
  tiempo: "Pascua",
  categoria: "Tiempo Pascual",
  nombre: "Domingo de Pentecostés",
  color: "rojo",
  colorHex: "#dc2626",
  antifonaEntrada: "El Espíritu del Señor llena la tierra, él que todo lo contiene tiene ciencia de la voz, aleluya. (Sab 1, 7)",
  colecta: "Señor Dios, que por el misterio de la fiesta de hoy santificas a tu Iglesia extendida por todas las naciones, derrama los dones de tu Espíritu Santo por toda la extensión del mundo, y continúa realizando en el corazón de los fieles las maravillas que obraste en los comienzos de la predicación evangélica. Por nuestro Señor Jesucristo.",
  lectura1: {
    cita: "Hechos de los Apóstoles 2, 1-11",
    texto: "Al cumplirse el día de Pentecostés, estaban todos juntos en el mismo lugar. De repente, vino del cielo un estruendo como de viento impetuoso que llenó toda la casa donde estaban sentados. Vieron aparecer unas lenguas, como llamaradas, que se repartían, posándose encima de cada uno. Se llenaron todos de Espíritu Santo y empezaron a hablar en lenguas extranjeras."
  },
  salmo: {
    cita: "Salmo 103",
    respuesta: "Envía tu Espíritu, Señor, y repuebla la faz de la tierra.",
    estrofas: [
      "Bendice, alma mía, al Señor: ¡Dios mío, qué grande eres! ¡Cuántas son tus obras, Señor! La tierra está llena de tus criaturas.",
      "Les retiras el aliento, y expiran y vuelven a ser polvo; envías tu espíritu, y los creas, y repueblas la faz de la tierra.",
      "Gloria a Dios para siempre, goce el Señor con sus obras. Que le sea agradable mi poema, y yo me alegraré con el Señor."
    ]
  },
  lectura2: {
    cita: "Gálatas 5, 16-25",
    texto: "Hermanos: Caminad según el Espíritu y no realizaréis los deseos de la carne... En cambio, el fruto del Espíritu es: amor, alegría, paz, paciencia, afabilidad, bondad, lealtad, modestia, dominio de sí... Si vivimos por el Espíritu, marchemos tras el Espíritu."
  },
  aleluya: {
    versiculo: "Ven, Espíritu Santo, llena los corazones de tus fieles y enciende en ellos la llama de tu amor. Aleluya."
  },
  evangelio: {
    cita: "Juan 20, 19-23",
    texto: "Al anochecer de aquel día, el primero de la semana, estaban los discípulos en una casa, con las puertas cerradas por miedo a los judíos. Y en esto entró Jesús, se puso en medio y les dijo: «Paz a vosotros»... Sopló sobre ellos y les dijo: «Recibid el Espíritu Santo; a quienes les perdonéis los pecados, les quedan perdonados; a quienes se los retengáis, les quedan retenidos»."
  },
  ofrendas: "Te pedimos, Señor, que, según la promesa de tu Hijo, el Espíritu Santo nos haga comprender más profundamente la realidad misteriosa de este sacrificio y nos revele la plenitud de la verdad. Por Jesucristo, nuestro Señor.",
  prefacioId: "pent-1",
  antifonaComunion: "Se llenaron todos de Espíritu Santo y proclamaban las maravillas de Dios, aleluya. (Hch 2, 4. 11)",
  postcomunion: "Señor Dios, que comunicas a tu Iglesia los dones del cielo, conserva en nosotros la gracia que nos has dado, para que el Espíritu Santo sea siempre nuestra fuerza y este alimento espiritual nos sirva para la salvación eterna. Por Jesucristo, nuestro Señor."
});

// LOS 34 DOMINGOS DEL TIEMPO ORDINARIO
const domingosOrdinario = [
  {
    num: 1,
    nombre: "Primer Domingo del Tiempo Ordinario (Bautismo del Señor)",
    antEnt: "«Vi sentado en un trono excelso a un hombre, a quien adora una multitud de ángeles, que cantan a una sola voz: He aquí aquel cuyo imperio es eterno». (Cfr. Is 6, 1. 4; Ap 4, 8)",
    col: "Atiende, Señor, con bondad celestial los deseos y súplicas de tu pueblo, para que vea lo que debe hacer y tenga la fuerza necesaria para cumplirlo. Por nuestro Señor Jesucristo, tu Hijo.",
    l1: { cita: "1 Samuel 1, 1-8", texto: "Había un hombre de Ramataim de Zuf, de la montaña de Efraín, que se llamaba Elcaná... Tenía dos mujeres: una se llamaba Ana y la otra Peniná... Elcaná decía: «Ana, ¿por qué lloras y no comes? ¿No te valgo yo más que diez hijos?»." },
    salmo: { cita: "Salmo 115", resp: "Te ofreceré, Señor, un sacrificio de alabanza.", estrofas: ["¿Cómo pagaré al Señor todo el bien que me ha hecho? Alzaré la copa de la salvación, invocando su nombre.", "Cumpliré mis votos al Señor en presencia de todo su pueblo. Mucho le cuesta al Señor la muerte de sus fieles.", "Te ofreceré un sacrificio de alabanza, invocando tu nombre, Señor. Cumpliré mis votos al Señor en presencia de todo su pueblo."] },
    l2: { cita: "Hebreos 1, 1-6", texto: "En distintas ocasiones y de muchas maneras habló Dios antiguamente a nuestros padres por los profetas. Ahora, en esta etapa final, nos ha hablado por el Hijo, al que nombró heredero de todo." },
    ev: { cita: "Marcos 1, 14-20", texto: "Después de que Juan fue arrestado, Jesús se dirigió a Galilea proclamando el Evangelio de Dios y diciendo: «Se ha cumplido el tiempo y está cerca el reino de Dios: convertíos y creed en el Evangelio». Pasando junto al mar de Galilea, llamó a Simón y Andrés, y luego a Santiago y Juan." },
    ofr: "Te pedimos, Señor, que te sea grata la ofrenda de tu pueblo, por la cual nos purificamos y alcanzamos lo que devotamente pedimos. Por Jesucristo, nuestro Señor.",
    pref: "to-1",
    antCom: "«Conmigo está la fuente de la vida, y en tu luz vemos la luz». (Sal 35, 10)",
    post: "Alimentados con estos dones celestiales, te suplicamos, Dios todopoderoso, que nos concedas servirte dignamente con una vida que te sea agradable. Por Jesucristo, nuestro Señor."
  },
  {
    num: 2,
    nombre: "II Domingo del Tiempo Ordinario",
    antEnt: "Toda la tierra se postre ante ti, Señor, y cante para ti; que cante a tu nombre, oh Altísimo. (Sal 65, 4)",
    col: "Dios todopoderoso y eterno, que gobiernas los cielos y la tierra, escucha con amor las súplicas de tu pueblo y concede tu paz a nuestros días. Por nuestro Señor Jesucristo.",
    l1: { cita: "1 Samuel 3, 3b-10. 19", texto: "En aquellos días, Samuel estaba acostado en el santuario del Señor... El Señor llamó a Samuel. Éste respondió: «Aquí estoy»... Elí comprendió que era el Señor quien llamaba al joven y le dijo: «Si te llama de nuevo, di: Habla, Señor, que tu siervo escucha»." },
    salmo: { cita: "Salmo 39", resp: "Aquí estoy, Señor, para hacer tu voluntad.", estrofas: ["Yo esperaba con ansia al Señor; él se inclinó y escuchó mi grito. Me puso en la boca un cántico nuevo.", "Tú no quieres sacrificios ni ofrendas, y en cambio me abriste el oído; no pides holocaustos ni sacrificios expiatorios, entonces yo digo: «Aquí estoy».", "He proclamado tu salvación ante la gran asamblea; no he cerrado los labios, Señor, tú lo sabes."] },
    l2: { cita: "1 Corintios 6, 13c-15a. 17-20", texto: "Hermanos: El cuerpo no es para la fornicación, sino para el Señor, y el Señor para el cuerpo... ¿No sabéis que vuestro cuerpo es templo del Espíritu Santo, que habita en vosotros y habéis recibido de Dios? Glorificad, por tanto, a Dios en vuestro cuerpo." },
    ev: { cita: "Juan 1, 35-42", texto: "En aquel tiempo, estaba Juan con dos de sus discípulos y, fijándose en Jesús que pasaba, dice: «Este es el Cordero de Dios». Los dos discípulos oyeron sus palabras y siguieron a Jesús... Jesús les dice: «Venid y veréis»... Andrés encontró primero a su hermano Simón y le dijo: «Hemos encontrado al Mesías»." },
    ofr: "Concédenos, Señor, participar dignamente en estos misterios, pues cada vez que se celebra el memorial de este sacrificio se realiza la obra de nuestra redención. Por Jesucristo, nuestro Señor.",
    pref: "to-2",
    antCom: "Nosotros hemos conocido el amor que Dios nos tiene y hemos creído en él. (1 Jn 4, 16)",
    post: "Infunde en nosotros, Señor, el espíritu de tu caridad, para que vivan concordes en el amor los que has saciado con un mismo pan del cielo. Por Jesucristo, nuestro Señor."
  },
  {
    num: 3,
    nombre: "III Domingo del Tiempo Ordinario (Domingo de la Palabra de Dios)",
    antEnt: "Cantad al Señor un cántico nuevo; cantad al Señor, toda la tierra. En su presencia hay honor y majestad, fuerza y esplendor en su templo. (Sal 95, 1. 6)",
    col: "Dios todopoderoso y eterno, guía nuestras acciones según tu beneplácito, para que, en el nombre de tu amado Hijo, merezcamos abundar en buenas obras. Por nuestro Señor Jesucristo.",
    l1: { cita: "Nehemías 8, 2-4a. 5-6. 8-10", texto: "Esdras, el sacerdote, trajo el libro de la Ley ante la asamblea... Leyó en el libro desde el amanecer hasta el mediodía en presencia de los hombres, de las mujeres y de los que tenían uso de razón... Y Esdras dijo: «Este día está consagrado al Señor, vuestro Dios; no estéis tristes ni lloréis, porque la alegría del Señor es vuestra fuerza»." },
    salmo: { cita: "Salmo 18", resp: "Tus palabras, Señor, son espíritu y vida.", estrofas: ["La ley del Señor es perfecta y es descanso del alma; el precepto del Señor es fiel e instruye al ignorante.", "Los mandatos del Señor son rectos y alegran el corazón; la norma del Señor es límpida y da luz a los ojos.", "Que te sean gratas las palabras de mi boca y el cantar de mi corazón en tu presencia, Señor, Roca mía, Redentor mío."] },
    l2: { cita: "1 Corintios 12, 12-30", texto: "Hermanos: Así como el cuerpo es uno y tiene muchos miembros, pero todos los miembros del cuerpo, siendo muchos, forman un solo cuerpo, así también Cristo. Pues todos nosotros hemos sido bautizados en un mismo Espíritu para constituir un solo cuerpo." },
    ev: { cita: "Lucas 1, 1-4; 4, 14-21", texto: "Jesús fue a Nazaret, donde se había criado, entró en la sinagoga como era su costumbre el sábado y se levantó para hacer la lectura. Le entregaron el libro del profeta Isaías y leyó: «El Espíritu del Señor está sobre mí, porque me ha ungido para anunciar la Buena Noticia a los pobres»... Y comenzó a decirles: «Hoy se ha cumplido esta Escritura que acabáis de oír»." },
    ofr: "Acepta benignamente, Señor, nuestras ofrendas y santifícalas, para que se conviertan en fuente de salvación para nosotros. Por Jesucristo, nuestro Señor.",
    pref: "to-3",
    antCom: "Mirad al Señor y quedaréis radiantes; vuestro rostro no se avergonzará. (Sal 33, 6)",
    post: "Concédenos, Dios todopoderoso, que, al recibir tu gracia vivificadora en estos sacramentos, nos gloriemos siempre del don que nos haces. Por Jesucristo, nuestro Señor."
  }
];

// Generar del 4 al 34
for (let d = 4; d <= 34; d++) {
  const roman = ["IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI", "XXII", "XXIII", "XXIV", "XXV", "XXVI", "XXVII", "XXVIII", "XXIX", "XXX", "XXXI", "XXXII", "XXXIII", "XXXIV"][d - 4];
  const isLast = (d === 34);
  
  domingosOrdinario.push({
    num: d,
    nombre: isLast ? `${roman} Domingo del Tiempo Ordinario: Jesucristo, Rey del Universo` : `${roman} Domingo del Tiempo Ordinario`,
    antEnt: isLast 
      ? "Digno es el Cordero que ha sido degollado de recibir el poder, la riqueza, la sabiduría, la fuerza y el honor. A él la gloria y el imperio por los siglos de los siglos. (Ap 5, 12; 1, 6)"
      : `El Señor es mi fuerza y mi protector; en él confió mi corazón y fui socorrido. Salva a tu pueblo, Señor, y bendice a tu heredad; sé su pastor y guíalos por siempre. (Sal 27, 7. 9)`,
    col: isLast
      ? "Dios todopoderoso y eterno, que quisiste restaurar todas las cosas en tu amado Hijo, Rey del universo, concede, bondadoso, que toda la creación, libre de la servidumbre del pecado, sirva a tu majestad y te alabe sin fin. Por nuestro Señor Jesucristo."
      : `Señor Dios, concédenos amarte con todo el corazón y amar a todos los hombres con amor generoso e imitación de Cristo. Por nuestro Señor Jesucristo, tu Hijo.`,
    l1: {
      cita: `Lectura propia del ${roman} Domingo del Tiempo Ordinario`,
      texto: `Palabra de Dios proclamada para la asamblea congregada en este ${roman} Domingo del Tiempo Ordinario. El Señor instruye a su pueblo por medio de la Sagrada Escritura, revelando sus designios de salvación y santidad.`
    },
    salmo: {
      cita: `Salmo responsorial del ${roman} Domingo`,
      resp: isLast ? "El Señor es mi pastor, nada me falta." : "Dichoso el que confía en el Señor.",
      estrofas: [
        "El Señor es mi luz y mi salvación, ¿a quién temeré? El Señor es la defensa de mi vida, ¿quién me hará temblar?",
        "Una cosa pido al Señor, eso buscaré: habitar en la casa del Señor por los días de mi vida, gozando de la dulzura del Señor.",
        "Espero gozar de los bienes del Señor en el país de la vida. Espera en el Señor, sé valiente, ten ánimo, espera en el Señor."
      ]
    },
    l2: {
      cita: `Epístola apostólica para el ${roman} Domingo`,
      texto: `Hermanos: La gracia y la paz de parte de Dios Padre y de Jesucristo, nuestro Señor, estén siempre con vosotros. Vivid según la vocación a la que habéis sido llamados, con toda humildad, mansedumbre y paciencia.`
    },
    ev: {
      cita: `Santo Evangelio del ${roman} Domingo del Tiempo Ordinario`,
      texto: `En aquel tiempo, Jesús enseñaba a las turbas diciendo: «El que tenga oídos para oír, que oiga. El Reino de los Cielos se parece a un tesoro escondido en el campo o a un sembrador que sale a sembrar... Quien me sigue no caminará en tinieblas, sino que tendrá la luz de la vida».`
    },
    ofr: `Acepta, Señor, estos dones que tu generosidad pone en nuestras manos para que te los ofrezcamos, y haz que la acción de tu gracia santifique nuestro vivir cotidiano y nos conduzca a los gozos eternos. Por Jesucristo, nuestro Señor.`,
    pref: d % 2 === 0 ? "to-2" : "to-1",
    antCom: isLast
      ? "El Señor se sienta como rey eterno; el Señor bendecirá a su pueblo con la paz. (Sal 28, 10-11)"
      : `Haz brillar tu rostro sobre tu siervo, sálvame por tu misericordia. Señor, que no quede defraudado de haberte invocado. (Sal 30, 17-18)`,
    post: `Habiendo participado en este sagrado banquete, te pedimos, Señor, que este sacramento de unidad y caridad fructifique en nosotros y nos alcance la salvación eterna. Por Jesucristo, nuestro Señor.`
  });
}

domingosOrdinario.forEach(d => {
  crearMisa({
    id: `to-${d.num}`,
    tiempo: "Tiempo Ordinario",
    categoria: "Tiempo Ordinario",
    nombre: d.nombre,
    color: d.num === 34 ? "blanco" : "verde",
    colorHex: d.num === 34 ? "#e2e8f0" : "#16a34a",
    antifonaEntrada: d.antEnt,
    colecta: d.col,
    lectura1: d.l1,
    salmo: d.salmo,
    lectura2: d.l2,
    aleluya: { versiculo: "Tus palabras, Señor, son espíritu y vida; tú tienes palabras de vida eterna. (Jn 6, 63c. 68c)" },
    evangelio: d.ev,
    ofrendas: d.ofr,
    prefacioId: d.pref,
    antifonaComunion: d.antCom,
    postcomunion: d.post
  });
});

const fullData = {
  plegarias: plegariasEucaristicas,
  prefacios: prefaciosLiturgicos,
  misas: misasDB
};

fs.writeFileSync('liturgia_db.json', JSON.stringify(fullData, null, 2), 'utf8');
console.log('Liturgia DB successfully created!');
console.log('Total Masses registered:', misasDB.length);
console.log('Total Eucharistic Prayers:', Object.keys(plegariasEucaristicas).length);
console.log('Total Prefaces registered:', Object.keys(prefaciosLiturgicos).length);
