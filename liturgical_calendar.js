// Calendario litúrgico: dada una fecha, indica qué celebración del catálogo
// corresponde. Cubre solo lo que el catálogo tiene (domingos, Semana Santa,
// Navidad y solemnidades del Señor); no incluye ferias ni fiestas de santos.
//
// Sigue las Normas Universales sobre el Año Litúrgico con lo que rige en Chile:
// Epifanía el domingo entre el 2 y el 8 de enero, Ascensión el VII Domingo de
// Pascua y Corpus Christi el domingo después de la Santísima Trinidad.
//
// Este archivo se incrusta tal cual en misal.html (build_complete_app.js) y
// también se carga con require() en test_calendar.js.

var LiturgicalCalendar = (function () {
  var DAY = 86400000;

  function ymd(y, m, d) { return Date.UTC(y, m - 1, d); }
  function addDays(t, n) { return t + n * DAY; }
  function weekday(t) { return new Date(t).getUTCDay(); } // 0 = domingo
  function diffDays(a, b) { return Math.round((a - b) / DAY); }
  function fromLocalDate(date) { return ymd(date.getFullYear(), date.getMonth() + 1, date.getDate()); }
  function toLocalDate(t) { var d = new Date(t); return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()); }

  // Domingo de Pascua (cómputo gregoriano, algoritmo anónimo de Meeus/Jones/Butcher)
  function easter(y) {
    var a = y % 19, b = Math.floor(y / 100), c = y % 100;
    var d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
    var g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
    var i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
    var m = Math.floor((a + 11 * h + 22 * l) / 451);
    var month = Math.floor((h + l - 7 * m + 114) / 31);
    var day = ((h + l - 7 * m + 114) % 31) + 1;
    return ymd(y, month, day);
  }

  // I Domingo de Adviento: cuatro domingos antes de Navidad
  function firstAdvent(y) {
    var christmas = ymd(y, 12, 25);
    var back = weekday(christmas) || 7; // si Navidad cae en domingo, el IV de Adviento es el 18
    return addDays(christmas, -back - 21);
  }

  // Epifanía en Chile: domingo entre el 2 y el 8 de enero
  function epiphany(y) {
    var jan2 = ymd(y, 1, 2);
    return addDays(jan2, (7 - weekday(jan2)) % 7);
  }

  // Bautismo del Señor: domingo después de la Epifanía; si la Epifanía cae
  // el 7 o el 8 de enero, el lunes siguiente.
  function baptism(y) {
    var ep = epiphany(y);
    var dayOfMonth = new Date(ep).getUTCDate();
    return addDays(ep, dayOfMonth >= 7 ? 1 : 7);
  }

  // Sagrada Familia: domingo dentro de la octava; si no lo hay, 30 de diciembre
  function holyFamily(y) {
    var christmas = ymd(y, 12, 25);
    if (weekday(christmas) === 0) return ymd(y, 12, 30);
    return addDays(christmas, 7 - weekday(christmas));
  }

  // Ciclo dominical del año litúrgico que contiene la fecha (A, B o C)
  function sundayCycle(t) {
    var y = new Date(t).getUTCFullYear();
    var endYear = t >= firstAdvent(y) ? y + 1 : y;
    return ['C', 'A', 'B'][endYear % 3];
  }

  // Fiestas del Señor y solemnidades del Calendario Romano General que, al
  // caer en domingo del Tiempo Ordinario, ocupan el lugar del domingo. Sus
  // misas no están en el catálogo, así que solo se avisa.
  var FEASTS_OVER_ORDINARY_SUNDAY = {
    '2-2': 'la Presentación del Señor',
    '6-24': 'la Natividad de San Juan Bautista',
    '6-29': 'San Pedro y San Pablo, Apóstoles',
    '8-6': 'la Transfiguración del Señor',
    '8-15': 'la Asunción de la Virgen María',
    '9-14': 'la Exaltación de la Santa Cruz',
    '11-1': 'Todos los Santos',
    '11-2': 'la Conmemoración de todos los Fieles Difuntos',
    '11-9': 'la Dedicación de la Basílica de Letrán'
  };

  function feastNote(month, dom) {
    var feast = FEASTS_OVER_ORDINARY_SUNDAY[month + '-' + dom];
    if (!feast) return '';
    return 'Este domingo coincide con ' + feast + ', que según el Calendario Romano General se celebra en lugar del domingo. Su misa no está en este catálogo; consulte el calendario de su diócesis.';
  }

  function result(id, alternativas, nota) {
    return { id: id, alternativas: alternativas || [], nota: nota || '' };
  }

  // Celebración del catálogo para un día concreto, o null si es una feria
  // que el catálogo no tiene.
  function celebrationFor(t) {
    var y = new Date(t).getUTCFullYear();
    var month = new Date(t).getUTCMonth() + 1;
    var dom = new Date(t).getUTCDate();
    var wd = weekday(t);
    var E = easter(y);
    var fromEaster = diffDays(t, E);
    var adv1 = firstAdvent(y);

    // Navidad
    if (month === 12 && dom === 24) {
      if (wd === 0) return result('adv-4', ['nav-vigilia', 'nav-noche'], 'Por la mañana, IV Domingo de Adviento; por la tarde, Misa de la Vigilia de Navidad.');
      return result('nav-vigilia', ['nav-noche'], 'Por la tarde, Misa de la Vigilia; por la noche, Misa de Nochebuena.');
    }
    if (month === 12 && dom === 25) return result('nav-dia', ['nav-noche', 'nav-aurora']);
    if (t === holyFamily(y)) return result('nav-sagrada-familia');
    if (month === 1 && dom === 1) return result('nav-maria-madre');
    if (t === epiphany(y)) return result('nav-epifania');
    if (t === baptism(y)) return result('nav-bautismo');

    // Adviento
    if (t >= adv1 && wd === 0) {
      var advWeek = diffDays(t, adv1) / 7 + 1;
      if (advWeek >= 1 && advWeek <= 4) return result('adv-' + advWeek);
    }

    // Cuaresma, Semana Santa y Pascua
    var fixedFromEaster = {
      '-46': result('cua-ceniza'),
      '-42': result('cua-1'), '-35': result('cua-2'), '-28': result('cua-3'),
      '-21': result('cua-4'), '-14': result('cua-5'), '-7': result('cua-ramos'),
      '-6': result('sem-lunes'), '-5': result('sem-martes'), '-4': result('sem-miercoles'),
      '-3': result('cua-jueves-santo', ['sem-crismal'], 'Por la mañana, Misa Crismal (donde no se haya anticipado); por la tarde, Misa en la Cena del Señor.'),
      '-2': result('pas-viernes-santo'),
      '-1': result('pas-sabado-santo', ['pas-vigilia'], 'Al anochecer, Solemne Vigilia Pascual.'),
      '0': result('pas-domingo', ['pas-vigilia']),
      '1': result('pas-lunes-octava'),
      '7': result('pas-2'), '14': result('pas-3'), '21': result('pas-4'),
      '28': result('pas-5'), '35': result('pas-6'), '42': result('pas-ascension'),
      '49': result('pas-pentecostes'), '56': result('to-trinidad'),
      '63': result('to-corpus'), '68': result('to-sagrado-corazon')
    };
    if (fixedFromEaster.hasOwnProperty(String(fromEaster))) return fixedFromEaster[String(fromEaster)];

    if (wd !== 0) return null;

    // Domingos del Tiempo Ordinario antes de Cuaresma
    var bap = baptism(y);
    var ash = addDays(E, -46);
    if (t > bap && t < ash) {
      var firstOT = addDays(bap, 7 - weekday(bap)); // primer domingo después del Bautismo = II
      return result('to-' + (2 + diffDays(t, firstOT) / 7), [], feastNote(month, dom));
    }

    // Domingos del Tiempo Ordinario después de Pentecostés, contados hacia atrás desde Cristo Rey
    var christKing = addDays(adv1, -7);
    if (fromEaster > 49 && t <= christKing) {
      return result('to-' + (34 - diffDays(christKing, t) / 7), [], feastNote(month, dom));
    }

    return null;
  }

  // Celebración de hoy o, si hoy no hay una en el catálogo, la próxima
  // (siempre aparece dentro de una semana porque todos los domingos están).
  function todayOrNext(date) {
    var start = fromLocalDate(date || new Date());
    for (var i = 0; i <= 7; i++) {
      var t = addDays(start, i);
      var c = celebrationFor(t);
      if (c) {
        c.fecha = toLocalDate(t);
        c.esHoy = i === 0;
        c.diasHasta = i;
        c.ciclo = sundayCycle(t);
        return c;
      }
    }
    return null;
  }

  return {
    easter: function (y) { return toLocalDate(easter(y)); },
    celebrationFor: function (date) { return celebrationFor(fromLocalDate(date)); },
    sundayCycle: function (date) { return sundayCycle(fromLocalDate(date)); },
    todayOrNext: todayOrNext
  };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = LiturgicalCalendar;
