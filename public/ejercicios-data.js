/* Datos de la sección de ejercicios de NutriFit */
window.AVISO = "Información general. Si tienes una lesión, una condición médica o hace mucho que no haces ejercicio, consulta a un profesional de la salud antes de empezar.";

window.GRUPOS = [
    { id: "pecho", n: "Pecho" }, { id: "espalda", n: "Espalda" }, { id: "hombro", n: "Hombro" },
    { id: "biceps", n: "Bíceps" }, { id: "triceps", n: "Tríceps" }, { id: "cuadriceps", n: "Cuádriceps" },
    { id: "femoral", n: "Femoral" }, { id: "gluteo", n: "Glúteo" }, { id: "abdomen", n: "Abdomen" }
];

// [grupo, nombre, equipo, descripción, ¿es por tiempo?]
window.EJ = [
    ["pecho", "Press de banca con barra", "Barra", "Acostado en el banco, baja la barra al centro del pecho con los codos a unos 45° del cuerpo y empuja hacia arriba sin despegar la espalda baja ni los glúteos."],
    ["pecho", "Press de pecho con mancuernas", "Mancuernas", "Acostado en el banco, baja las mancuernas a los lados del pecho y empuja hacia arriba juntándolas sin chocarlas."],
    ["pecho", "Press de pecho en máquina", "Máquina", "Sentado con la espalda pegada al respaldo, empuja las manijas al frente hasta casi extender los brazos y regresa lento."],
    ["pecho", "Flexiones de pecho", "Peso corporal", "En plancha con las manos al ancho de los hombros, baja el pecho al suelo con el cuerpo en línea recta y empuja. Si es difícil, apoya las rodillas."],
    ["espalda", "Jalón al pecho", "Polea", "Sentado, jala la barra hacia la parte alta del pecho llevando los codos hacia abajo y atrás; evita balancearte."],
    ["espalda", "Remo con mancuerna", "Mancuernas", "Con una mano y una rodilla apoyadas en el banco, jala la mancuerna hacia la cadera con la espalda recta."],
    ["espalda", "Remo en máquina", "Máquina", "Con el pecho apoyado, jala las manijas hacia tu cuerpo juntando los omóplatos y regresa controlado."],
    ["espalda", "Remo con banda elástica", "Banda", "Sentado con las piernas estiradas y la banda en los pies, jala hacia el abdomen con la espalda recta."],
    ["hombro", "Press de hombro con mancuernas", "Mancuernas", "Sentado con la espalda recta, empuja las mancuernas desde los hombros hacia arriba sin arquear la espalda."],
    ["hombro", "Elevaciones laterales", "Mancuernas", "De pie, sube las mancuernas a los lados hasta la altura de los hombros con los codos ligeramente flexionados y baja lento."],
    ["hombro", "Press de hombro en máquina", "Máquina", "Sentado, empuja las manijas hacia arriba hasta casi extender los brazos y baja con control."],
    ["hombro", "Face pull con polea", "Polea", "Con la cuerda a la altura de la cara, jala hacia ti separando las manos y apretando la parte trasera del hombro."],
    ["biceps", "Curl con barra", "Barra", "De pie, flexiona los codos para subir la barra sin balancear el cuerpo y baja lento."],
    ["biceps", "Curl con mancuernas", "Mancuernas", "Sube una mancuerna a la vez girando la palma hacia arriba; mantén los codos pegados al torso."],
    ["biceps", "Curl martillo", "Mancuernas", "Con las palmas mirándose, flexiona los codos subiendo las mancuernas sin mover los hombros."],
    ["biceps", "Curl en polea baja", "Polea", "De pie frente a la polea, flexiona los codos llevando la barra o cuerda hacia el pecho con los codos fijos."],
    ["triceps", "Extensión de tríceps en polea", "Polea", "Con los codos pegados al cuerpo, empuja la cuerda hacia abajo hasta extender los brazos y regresa lento."],
    ["triceps", "Fondos en banco", "Peso corporal", "Con las manos en el borde de un banco, baja flexionando los codos a unos 90° y empuja hacia arriba."],
    ["triceps", "Press francés con mancuerna", "Mancuernas", "Acostado, sostén una mancuerna con ambas manos arriba; baja detrás de la cabeza flexionando solo los codos y extiende."],
    ["triceps", "Patada de tríceps", "Mancuernas", "Con el torso inclinado y el codo pegado al cuerpo, extiende el brazo hacia atrás y regresa lento."],
    ["cuadriceps", "Sentadilla con barra", "Barra", "Con la barra sobre la espalda alta, baja flexionando rodillas y cadera con el pecho arriba y sube empujando el suelo."],
    ["cuadriceps", "Prensa de piernas", "Máquina", "Con los pies en la plataforma al ancho de los hombros, baja hasta unos 90° en las rodillas y empuja sin bloquearlas."],
    ["cuadriceps", "Sentadilla goblet", "Mancuernas", "Sostén una mancuerna junto al pecho, baja en sentadilla con la espalda recta y sube."],
    ["cuadriceps", "Zancadas", "Peso corporal", "Da un paso largo al frente, baja hasta que ambas rodillas se doblen cerca de 90° y regresa; alterna las piernas."],
    ["femoral", "Curl femoral en máquina", "Máquina", "Acostado o sentado, flexiona las rodillas llevando los talones hacia los glúteos y regresa lento."],
    ["femoral", "Peso muerto rumano con mancuernas", "Mancuernas", "Con las rodillas ligeramente flexionadas, lleva la cadera hacia atrás bajando las mancuernas cerca de las piernas y sube apretando los glúteos."],
    ["femoral", "Hiperextensiones", "Peso corporal", "En el banco de hiperextensiones, baja el torso con la espalda recta y sube hasta alinear el cuerpo sin arquearte de más."],
    ["femoral", "Curl femoral con banda", "Banda", "Acostado boca abajo con la banda en los tobillos, lleva los talones hacia los glúteos y regresa lento."],
    ["gluteo", "Puente de glúteo", "Peso corporal", "Acostado con las rodillas dobladas, sube la cadera apretando los glúteos y baja lento."],
    ["gluteo", "Hip thrust con barra", "Barra", "Con la espalda alta apoyada en un banco y la barra sobre la cadera, sube hasta alinear tronco y muslos y baja con control."],
    ["gluteo", "Patada de glúteo en polea", "Polea", "Con la tobillera en la polea, lleva la pierna hacia atrás con el torso firme y regresa sin balancearte."],
    ["gluteo", "Sentadilla búlgara", "Mancuernas", "Con un pie atrás sobre un banco, baja con la pierna de adelante y sube empujando con el talón."],
    ["abdomen", "Plancha", "Peso corporal", "Apoyado en antebrazos y puntas de los pies, mantén el cuerpo en línea recta apretando abdomen y glúteos.", true],
    ["abdomen", "Crunch abdominal", "Peso corporal", "Acostado con las rodillas dobladas, sube los hombros del suelo contrayendo el abdomen sin jalar el cuello."],
    ["abdomen", "Elevación de piernas", "Peso corporal", "Acostado, sube las piernas casi rectas hasta la vertical y baja lento sin arquear la espalda baja."],
    ["abdomen", "Crunch en polea", "Polea", "De rodillas frente a la polea, flexiona el tronco llevando los codos hacia las rodillas con el abdomen."]
].map(function (a, i) { return { id: i, g: a[0], n: a[1], e: a[2], d: a[3], t: !!a[4] }; });

// min = minutos según el nivel (principiante, intermedio, avanzado)
window.CARDIO = [
    ["Caminata rápida", "Camina a paso ligero, con el que puedas hablar pero no cantar. Mantén la postura erguida y mueve los brazos.", [25, 35, 45]],
    ["Trote suave", "Trota a un ritmo en el que puedas conversar. Si eres principiante, alterna 1 minuto trotando y 2 caminando.", [20, 30, 40]],
    ["Bicicleta", "Pedalea a ritmo constante con resistencia moderada y el asiento a la altura de tu cadera.", [25, 35, 45]],
    ["Saltar la cuerda", "Salta con rebotes pequeños sobre la punta de los pies y los codos pegados al cuerpo. Alterna 1 minuto de saltos con 1 de descanso.", [10, 15, 20]],
    ["Intervalos (HIIT básico)", "Alterna 30 segundos de esfuerzo fuerte (trote rápido, bicicleta o saltos) con 60 segundos de recuperación suave.", [15, 20, 25]]
].map(function (a, i) { return { id: 100 + i, g: "cardio", n: a[0], e: "Cardio", d: a[1], min: a[2] }; });

window.OBJETIVOS = [
    { id: "cardio", n: "Cardio", d: "Ejercicio que eleva tu ritmo cardiaco durante varios minutos, como caminar rápido, trotar o andar en bicicleta. Mejora tu resistencia y la salud de tu corazón, y gasta calorías." },
    { id: "masa", n: "Masa muscular", d: "Entrenar con pesas y cargas más pesadas, con pocas repeticiones, para que tus músculos crezcan y se hagan más fuertes. Necesita comer suficiente proteína y descansar bien." },
    { id: "tonificar", n: "Tonificar", d: "Trabajar con cargas moderadas y más repeticiones para fortalecer los músculos. No es un tipo distinto de músculo: con una alimentación adecuada, se ve un cuerpo más firme y definido." }
];

window.NIVELES = [
    { id: "principiante", n: "Principiante", d: "Apenas empiezas o llevas menos de 6 meses entrenando." },
    { id: "intermedio", n: "Intermedio", d: "Entrenas con constancia desde hace entre 6 meses y 2 años." },
    { id: "avanzado", n: "Avanzado", d: "Llevas más de 2 años entrenando y dominas la técnica de los ejercicios básicos." }
];

window.QUE_ES = [
    ["Calentamiento", "Antes de empezar dedica 5 a 10 minutos a subir tu temperatura: caminata rápida o bicicleta suave, movilidad de hombros, cadera y rodillas, y 1 o 2 series ligeras del primer ejercicio. Prepara tus articulaciones y músculos y reduce el riesgo de lesión."],
    ["Series y repeticiones (por ejemplo 4×12)", "Una repetición es un movimiento completo. Una serie es un grupo de repeticiones seguidas. «4×12» significa 4 series de 12 repeticiones: haces 12, descansas y lo repites 4 veces. Elige un peso con el que las últimas repeticiones cuesten, pero con buena técnica."],
    ["Descanso entre series", "Es el tiempo que esperas entre una serie y la siguiente. Con descansos más largos recuperas fuerza para la siguiente serie; con descansos cortos trabajas más la resistencia. Tu rutina ya trae el descanso según tu nivel."],
    ["Cómo evitar lesiones", "Prioriza la técnica sobre el peso y sube la carga poco a poco. Respira (exhala al hacer fuerza), evita los rebotes y usa calzado cómodo. Deja al menos 48 horas antes de volver a entrenar con intensidad el mismo músculo. El cansancio y el ardor muscular son normales, pero un dolor agudo en una articulación es una señal para parar."],
    ["Progresión", "Para seguir mejorando, aumenta poco a poco: un poco más de peso, una repetición más o un descanso ligeramente menor. Hazlo cuando completes todas las series con buena técnica."],
    ["Enfriamiento y estiramientos", "Al terminar, camina de 3 a 5 minutos y estira suavemente los músculos trabajados, sin dolor, de 20 a 30 segundos cada uno."]
];
