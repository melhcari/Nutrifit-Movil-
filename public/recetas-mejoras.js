/*
 * Mejoras exclusivas del recetario NutriFit.
 * - Asigna una fotografía y una alternativa por receta.
 * - Amplía cada paso de preparación con instrucciones útiles.
 * - Genera consejos de cocina relevantes para los ingredientes de la receta.
 * No modifica la página principal, categorías, ingredientes ni valores nutricionales.
 */
(function () {
  "use strict";

  if (!Array.isArray(window.RECETAS)) {
    console.error("NutriFit: no se encontró window.RECETAS. Revisa el orden de los scripts.");
    return;
  }

  const REGLAS_FOTO = [
    { re: /ceviche/i, tag: "ceviche" },
    { re: /salm[oó]n/i, tag: "salmon" },
    { re: /camar[oó]n|mariscos|langostino/i, tag: "shrimp" },
    { re: /at[uú]n/i, tag: "tuna" },
    { re: /tilapia/i, tag: "tilapia" },
    { re: /pescado|filete de pescado/i, tag: "fish" },
    { re: /hummus/i, tag: "hummus" },
    { re: /panqu[eé]|pancake|hot cake|waffle/i, tag: "pancakes" },
    { re: /batido|smoothie|licuado/i, tag: "smoothie" },
    { re: /avena nocturna|avena con|avena integral|porridge/i, tag: "oatmeal" },
    { re: /yogur|yogurt|granola/i, tag: "yogurt bowl" },
    { re: /omelette|huevo|claras|reques[oó]n|shakshuka/i, tag: "eggs breakfast" },
    { re: /tacos?|tostadas?|enchiladas?|quesadilla|chilaquiles|molletes?|tortillas? de ma[ií]z/i, tag: "mexican food" },
    { re: /pasta|tallar[ií]n|espagueti|macarr[oó]n|fideo/i, tag: "pasta dish" },
    { re: /sopa|caldo|crema de|consom[eé]/i, tag: "healthy soup" },
    { re: /berenjena/i, tag: "eggplant dish" },
    { re: /champi[nñ][oó]n|setas|hongos/i, tag: "mushrooms" },
    { re: /pimientos? rellenos|pimiento morr[oó]n/i, tag: "stuffed peppers" },
    { re: /tofu/i, tag: "tofu bowl" },
    { re: /quinoa/i, tag: "quinoa bowl" },
    { re: /lentejas?/i, tag: "lentils" },
    { re: /garbanzos?|falafel|croquetas? de garbanzo/i, tag: "chickpeas" },
    { re: /frijoles?|frijol negro/i, tag: "beans" },
    { re: /arroz/i, tag: "rice bowl" },
    { re: /pavo/i, tag: "turkey meal" },
    { re: /pollo|pechuga de pollo/i, tag: "chicken meal" },
    { re: /res magra|filete de res|bistec|carne asada|alb[oó]ndigas/i, tag: "beef meal" },
    { re: /nopales?/i, tag: "nopales mexican food" },
    { re: /ensalada|lechuga|pepino|verduras frescas/i, tag: "fresh salad" },
    { re: /wrap|rollitos de lechuga|burrito/i, tag: "healthy wrap" },
    { re: /calabac[ií]n|zucchini|pesto/i, tag: "zucchini" },
    { re: /aguacate|avocado/i, tag: "avocado toast" },
    { re: /br[oó]coli/i, tag: "broccoli" },
    { re: /curry/i, tag: "vegetable curry" },
    { re: /fruta|fresa|pl[aá]tano|mango|frutos rojos/i, tag: "fresh fruit" },
    { re: /verduras|vegetales|vegetariana|vegano/i, tag: "vegetable dish" }
  ];

  function textoReceta(receta) {
    const ingredientes = Array.isArray(receta.ingredientes) ? receta.ingredientes : [];
    return [receta.titulo || "", receta.desc || "", ...ingredientes].join(" ").toLocaleLowerCase("es");
  }

  function etiquetaFoto(receta) {
    const texto = textoReceta(receta);
    const regla = REGLAS_FOTO.find((item) => item.re.test(texto));
    return regla ? regla.tag : "healthy healthy food";
  }

  function urlFoto(etiqueta, lock) {
    return "https://loremflickr.com/960/640/" + encodeURIComponent(etiqueta) + "?lock=" + lock;
  }

  function ampliarPaso(paso, receta) {
    const original = String(paso || "").trim();
    if (!original) return original;

    // Evita duplicar la ampliación en caso de que otro script haya procesado el texto.
    if (/Consejo de preparación:/i.test(original)) return original;

    const normal = original.toLocaleLowerCase("es");
    const texto = textoReceta(receta);
    let consejo = "";

    if (/precalienta/.test(normal)) {
      consejo = "Enciende el horno con anticipación y coloca la rejilla a media altura. Espera a que alcance la temperatura indicada antes de meter la preparación para favorecer una cocción uniforme.";
    } else if (/\b(lava|enjuaga|desinfecta)\b/.test(normal)) {
      consejo = "Lava frutas y verduras con agua potable corriente y sécalas con un utensilio limpio. No uses jabón en los alimentos y evita que los ingredientes listos para comer toquen superficies que hayan estado en contacto con alimentos crudos.";
    } else if (/\b(corta|pica|rebana|ralla|trocea|desmenuza)\b/.test(normal)) {
      consejo = "Procura que las piezas tengan un tamaño parecido para que se mezclen y se cocinen de forma pareja. Usa una tabla estable y un cuchillo adecuado, y reserva los trozos cortados en un recipiente limpio.";
    } else if (/\b(marina|marinar)\b/.test(normal)) {
      consejo = "Voltea o mezcla las piezas para cubrirlas por todos lados y deja que absorban el sabor. Si la marinada contiene carne, pollo o pescado crudos, mantén el recipiente tapado dentro del refrigerador y no reutilices esa marinada sin hervirla primero.";
    } else if (/\b(sofr[ií]e|saltea|dora)\b/.test(normal)) {
      consejo = "Deja que la sartén tome temperatura antes de añadir los ingredientes y evita llenarla demasiado; si quedan amontonados, soltarán agua en lugar de dorarse. Mueve de vez en cuando y baja el fuego si el ajo o las especias empiezan a quemarse.";
    } else if (/\b(hornea|gratina)\b/.test(normal)) {
      consejo = "Distribuye los ingredientes en una sola capa cuando sea posible y deja un poco de espacio entre las piezas. Empieza a revisar el punto cerca del tiempo indicado, porque el grosor de los alimentos y cada horno pueden cambiar la duración necesaria.";
    } else if (/\b(lic[uú]a|procesa|tritura)\b/.test(normal)) {
      consejo = "Empieza a velocidad baja y aumenta poco a poco. Si los ingredientes se quedan pegados a las paredes, detén el aparato antes de moverlos con una espátula; vuelve a encenderlo solo cuando todo esté colocado de forma segura.";
    } else if (/\b(refrigera|enfr[ií]a|deja reposar|reposar)\b/.test(normal)) {
      consejo = "Coloca la preparación en un recipiente limpio. Si necesita reposar o enfriarse durante más tiempo, tápala y refrigérala según corresponda; no dejes alimentos perecederos a temperatura ambiente por periodos prolongados.";
    } else if (/\b(escurre|cuela|retira|reserva)\b/.test(normal)) {
      consejo = "Elimina el exceso de líquido con cuidado para conservar la forma de los ingredientes. Si reservas algún ingrediente para añadirlo al final, mantenlo en un plato limpio y separado de los alimentos crudos.";
    } else if (/\b(forma|arma|rellena|enrolla|dobla|envuelve)\b/.test(normal)) {
      consejo = "Reparte el relleno de manera uniforme y deja libre un pequeño borde para poder cerrar cada pieza. Si la preparación se desarma, reduce un poco el relleno y coloca las piezas con el cierre hacia abajo.";
    } else if (/\b(mezcla|combina|integra|bate|revuelve)\b/.test(normal)) {
      consejo = "Usa un recipiente amplio y mezcla desde el fondo hacia arriba para repartir los ingredientes sin aplastarlos. Raspa las paredes del recipiente con una espátula limpia y detente cuando la mezcla se vea homogénea.";
    } else if (/\b(agrega|añade|incorpora|vierte|coloca)\b/.test(normal) && !/cocina|hornea|hierve|cuece|sofr[ií]e|saltea|dora/.test(normal)) {
      consejo = "Añade el ingrediente de manera uniforme y mezcla con suavidad cuando sea necesario. Si estás incorporando líquido o condimentos, empieza con una parte y ajusta poco a poco para no sobrecargar el sabor ni alterar la textura.";
    } else if (/\b(hierve|cuece|cocina|asa|sella|calienta|tapa|dora)\b/.test(normal)) {
      if (/pollo|pavo/.test(texto)) {
        consejo = "Gira las piezas cuando corresponda para que se cocinen de forma uniforme. Comprueba la parte más gruesa con un termómetro de alimentos: el pollo y el pavo deben alcanzar 74 °C en el centro antes de servirse.";
      } else if (/pescado|salm[oó]n|tilapia|at[uú]n|camar[oó]n|marisco/.test(texto)) {
        consejo = "Evita mover el pescado demasiado para que no se rompa y revisa la parte más gruesa. Como referencia de seguridad, el pescado debe alcanzar 63 °C; los mariscos deben quedar bien cocidos, con textura firme y aspecto opaco cuando corresponda.";
      } else if (/huevo|claras|omelette|tortilla de huevo/.test(texto)) {
        consejo = "Controla el fuego para que la parte exterior no se dore demasiado antes de que el centro esté listo. Para preparaciones con huevo, cocina hasta que quede cuajado; remueve suavemente si buscas una textura cremosa.";
      } else {
        consejo = "Mantén el fuego moderado y revisa la textura durante la cocción. Remueve o voltea cuando haga falta para que el alimento se cocine de manera uniforme y no se pegue; añade líquido poco a poco si la preparación se seca antes de tiempo.";
      }
    } else if (/\b(sirve|acompaña|decora|termina|presenta)\b/.test(normal)) {
      consejo = "Prueba el sazón antes de repartir las porciones y añade hierbas frescas o ingredientes crujientes al final, si ya forman parte de la receta. Sirve con utensilios limpios y conserva refrigeradas las porciones que no vayas a consumir pronto.";
    } else {
      consejo = "Revisa el aspecto, la textura y el sazón antes de continuar. Integra los ingredientes con cuidado, respeta las cantidades que aparecen en la receta y haz ajustes pequeños para conservar el equilibrio del platillo.";
    }

    return original.replace(/[\s.!?]+$/u, "") + "\nConsejo de preparación: " + consejo;
  }

  function crearConsejos(receta) {
    const texto = textoReceta(receta);
    const categorias = Array.isArray(receta.categorias) ? receta.categorias : [];
    let antes = "Lee todos los pasos antes de empezar y coloca los ingredientes medidos sobre la mesa. Prepara una tabla, utensilios y recipientes limpios para trabajar con más orden.";
    let coccion = "Prueba la preparación antes de servir y ajusta el sazón gradualmente. Respeta las cantidades de la lista de ingredientes; si haces sustituciones, el sabor y la textura pueden cambiar.";

    if (categorias.includes("celiaca")) {
      antes = "Revisa que los ingredientes envasados estén identificados como sin gluten. Limpia la superficie de trabajo y utiliza utensilios limpios para evitar el contacto con migas, harina u otros alimentos que contengan gluten.";
    } else if (categorias.includes("diabetica")) {
      antes = "Organiza los ingredientes y ten presente la porción que forma parte de tu plan alimentario. El contenido de carbohidratos puede variar según la marca, la cantidad y las sustituciones que utilices.";
    }

    if (/pollo|pavo/.test(texto)) {
      coccion = "Para seguridad alimentaria, comprueba con un termómetro que el centro de la parte más gruesa del pollo o pavo alcance 74 °C. Lava manos y utensilios después de manipular carne cruda y evita usar el mismo plato sin lavar para servir.";
    } else if (/pescado|salm[oó]n|tilapia|at[uú]n|camar[oó]n|marisco/.test(texto)) {
      coccion = "Evita sobrecocinar el pescado para conservar su textura, pero asegúrate de que alcance una cocción segura. Como referencia, el pescado debe llegar a 63 °C en su parte más gruesa; los mariscos deben quedar bien cocidos.";
    } else if (/huevo|claras|omelette|shakshuka/.test(texto)) {
      coccion = "Mantén el fuego medio o bajo cuando necesites una cocción suave y verifica que el huevo quede cuajado. Si preparas la receta para varias personas, sirve con utensilios limpios y refrigera pronto las porciones sobrantes.";
    } else if (/avena|arroz|quinoa|lenteja|garbanzo|frijol|pasta/i.test(texto)) {
      coccion = "Prueba la textura antes de terminar: los granos y las legumbres deben alcanzar el punto indicado sin deshacerse. Si necesitas agregar líquido durante la cocción, hazlo poco a poco para controlar la consistencia.";
    } else if (/ensalada|lechuga|espinaca|pepino|fruta|verdura|vegetal/i.test(texto)) {
      coccion = "Para mantener una textura fresca, seca bien las hojas y corta los ingredientes justo antes de servir cuando sea posible. Añade el aderezo al final si quieres que las verduras conserven mejor su consistencia crujiente.";
    }

    return { antes, coccion };
  }

  window.RECETAS.forEach((receta, indice) => {
    const texto = textoReceta(receta);
    const etiqueta = etiquetaFoto(receta);
    const idNum = Number.isFinite(Number(receta.id)) ? Number(receta.id) : indice;
    const lockBase = 64000 + idNum * 2;

    // Mantiene una URL estable y un lock diferente para cada receta y su alternativa.
    receta.fotoGoogle = urlFoto(etiqueta, lockBase);
    receta.fotoAlternativa = urlFoto(etiqueta, lockBase + 1);

    if (!receta._nutrifitPasosAmpliados && Array.isArray(receta.pasos)) {
      receta.pasos = receta.pasos.map((paso) => ampliarPaso(paso, receta));
      receta._nutrifitPasosAmpliados = true;
    }

    const consejos = crearConsejos(receta);
    receta.nutrifitAntesDeEmpezar = consejos.antes;
    receta.nutrifitConsejoFinal = consejos.coccion;
  });
})();
