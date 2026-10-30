/*
 * MEJORAS DEL RECETARIO NUTRIFIT
 * - Asigna una fotografía según el tipo de receta.
 * - Utiliza identificadores diferentes para cada receta.
 * - Amplía los pasos de preparación.
 * - No modifica ingredientes, categorías ni información nutricional.
 */

(function () {
    "use strict";

    if (!Array.isArray(window.RECETAS)) {
        console.error(
            "NutriFit: no se encontró window.RECETAS. Revisa el orden de los scripts."
        );
        return;
    }

    // Etiquetas para buscar fotografías relacionadas con cada platillo.
    const REGLAS_FOTO = [
        { re: /pechuga.*mostaza|mostaza.*pollo/i, tag: "chicken" },
        { re: /salm[oó]n/i, tag: "salmon" },
        { re: /omelette.*espinaca|frittata.*espinaca/i, tag: "omelette" },
        { re: /pechuga.*rellena.*br[oó]coli/i, tag: "chicken" },
        { re: /avena.*frutos rojos|avena.*fresa/i, tag: "oatmeal" },
        { re: /ensalada.*c[eé]sar/i, tag: "salad" },
        { re: /ensalada.*pollo|pollo.*ensalada/i, tag: "chicken" },
        { re: /filete.*pescado.*parrilla|pescado.*parrilla/i, tag: "fish" },
        { re: /yogur.*granola|yogurt.*granola/i, tag: "yogurt" },
        { re: /arroz integral.*pollo|pollo.*arroz integral/i, tag: "chicken" },
        { re: /sopa.*lentejas.*pollo|lentejas.*pollo/i, tag: "lentils" },
        { re: /pavo.*champi[nñ][oó]n|champi[nñ][oó]n.*pavo/i, tag: "turkey" },
        { re: /tofu.*parrilla|tofu.*verduras/i, tag: "tofu" },
        { re: /tilapia/i, tag: "tilapia" },
        { re: /batido.*prote[ií]co|smoothie.*prote[ií]co/i, tag: "smoothie" },
        { re: /tallar[ií]n.*calabac[ií]n|fideos.*calabac[ií]n/i, tag: "zucchini" },
        { re: /filete de res|bistec|carne asada/i, tag: "steak" },
        { re: /tortilla de claras|claras de huevo/i, tag: "eggs" },
        { re: /at[uú]n/i, tag: "tuna" },
        { re: /pollo.*salsa.*tomate|pollo.*jitomate/i, tag: "chicken" },
        { re: /smoothie bowl/i, tag: "smoothie" },
        { re: /quinoa.*frijoles|frijoles.*quinoa/i, tag: "quinoa" },
        { re: /ceviche/i, tag: "ceviche" },
        { re: /camar[oó]n|langostino/i, tag: "shrimp" },
        { re: /tacos?/i, tag: "tacos" },
        { re: /tostadas?/i, tag: "tostadas" },
        { re: /enchiladas?/i, tag: "enchiladas" },
        { re: /chilaquiles/i, tag: "chilaquiles" },
        { re: /chile poblano|chiles rellenos/i, tag: "pepper" },
        { re: /frijoles?/i, tag: "beans" },
        { re: /nopales?/i, tag: "nopales" },
        { re: /alb[oó]ndigas/i, tag: "meatballs" },
        { re: /pavo/i, tag: "turkey" },
        { re: /res magra|carne molida|res con/i, tag: "beef" },
        { re: /pollo|pechuga/i, tag: "chicken" },
        { re: /pescado|merluza|bacalao/i, tag: "fish" },
        { re: /huevo|huevos|frittata|omelette/i, tag: "eggs" },
        { re: /panqu[eé]|pancake|hot cake|waffle/i, tag: "pancakes" },
        { re: /avena|porridge/i, tag: "oatmeal" },
        { re: /yogur|yogurt|granola/i, tag: "yogurt" },
        { re: /batido|smoothie|licuado/i, tag: "smoothie" },
        { re: /pasta|tallar[ií]n|espagueti|macarr[oó]n|fideo/i, tag: "pasta" },
        { re: /sopa|caldo|crema de|consom[eé]/i, tag: "soup" },
        { re: /berenjena/i, tag: "eggplant" },
        { re: /champi[nñ][oó]n|setas|hongos/i, tag: "mushrooms" },
        { re: /pimientos? rellenos|pimiento morr[oó]n/i, tag: "peppers" },
        { re: /tofu/i, tag: "tofu" },
        { re: /quinoa/i, tag: "quinoa" },
        { re: /lentejas?/i, tag: "lentils" },
        { re: /garbanzos?|falafel/i, tag: "chickpeas" },
        { re: /arroz/i, tag: "rice" },
        { re: /ensalada|lechuga|pepino/i, tag: "salad" },
        { re: /wrap|rollitos de lechuga|burrito/i, tag: "wrap" },
        { re: /calabac[ií]n|zucchini/i, tag: "zucchini" },
        { re: /aguacate|avocado/i, tag: "avocado" },
        { re: /br[oó]coli/i, tag: "broccoli" },
        { re: /curry/i, tag: "curry" },
        { re: /fruta|fresa|pl[aá]tano|mango|frutos rojos/i, tag: "fruit" },
        { re: /verduras|vegetales|vegetariana|vegano/i, tag: "vegetables" }
    ];

    function etiquetaFoto(receta) {
        const ingredientes = Array.isArray(receta.ingredientes)
            ? receta.ingredientes
            : [];

        const texto = [
            receta.titulo || "",
            receta.desc || "",
            ...ingredientes
        ].join(" ");

        const regla = REGLAS_FOTO.find(item => item.re.test(texto));

        return regla ? regla.tag : "food";
    }

    // Generador de fotografías con un identificador distinto por receta.
    function urlFoto(etiqueta, lock) {
        return (
            "https://loremflickr.com/960/640/" +
            encodeURIComponent(etiqueta) +
            "?lock=" +
            lock
        );
    }

    // Ampliación de las instrucciones de preparación.
    function detalleDelPaso(paso, receta) {
        const texto = String(paso || "").trim();
        const normal = texto.toLocaleLowerCase("es");
        const base = texto.replace(/[\s.!?]+$/u, "");

        const recetaTexto = [
            receta.titulo || "",
            receta.desc || "",
            ...(receta.ingredientes || [])
        ].join(" ").toLocaleLowerCase("es");

        let detalle;

        if (/precalienta/.test(normal)) {
            detalle = "Hazlo antes de introducir los ingredientes y espera a que el horno alcance la temperatura indicada para que la cocción sea uniforme.";
        }

        else if (/\b(lava|enjuaga|desinfecta)\b/.test(normal)) {
            detalle = "Limpia los ingredientes con agua potable y sécalos cuando corresponda. Utiliza una tabla y utensilios limpios para prepararlos.";
        }

        else if (/\b(corta|pica|rebana|ralla|trocea|desmenuza)\b/.test(normal)) {
            detalle = "Procura que las piezas tengan un tamaño parecido para que se mezclen y se cocinen de manera uniforme.";
        }

        else if (/\b(marina|marinar)\b/.test(normal)) {
            detalle = "Mezcla bien para cubrir todas las superficies y deja que tome sabor. Si el reposo será prolongado, mantenlo tapado dentro del refrigerador.";
        }

        else if (/\b(sofr[ií]e|saltea|dora)\b/.test(normal)) {
            detalle = "Usa fuego medio y mueve los ingredientes cada poco para que se cocinen por igual y se doren sin quemarse. Si el ajo se oscurece demasiado, baja el fuego.";
        }

        else if (/\b(hornea|gratina)\b/.test(normal)) {
            detalle = "Distribuye los ingredientes en una sola capa cuando sea posible y revisa el punto de cocción al final, porque el tiempo puede variar según el horno y el grosor.";
        }

        else if (/\b(lic[uú]a|procesa|tritura)\b/.test(normal)) {
            detalle = "Empieza a velocidad baja y aumenta gradualmente. Detén la máquina si necesitas bajar los ingredientes de las paredes del vaso y continúa hasta obtener la textura indicada.";
        }

        else if (/\b(refrigera|enfr[ií]a|deja reposar|reposar)\b/.test(normal)) {
            detalle = "Coloca la preparación en un recipiente limpio y, cuando corresponda, tápalo durante el reposo para conservar la humedad y evitar que absorba olores.";
        }

        else if (/\b(escurre|cuela|retira|reserva)\b/.test(normal)) {
            detalle = "Hazlo con cuidado para no deshacer los ingredientes y deja que el exceso de líquido se elimine antes de continuar con el siguiente paso.";
        }

        else if (/\b(forma|arma|rellena|enrolla|dobla|envuelve)\b/.test(normal)) {
            detalle = "Reparte el relleno de forma uniforme y evita poner demasiado para que puedas cerrar o acomodar cada porción sin que se desarme.";
        }

        else if (/\b(mezcla|combina|integra|bate|revuelve)\b/.test(normal)) {
            detalle = "Utiliza un recipiente amplio y mezcla hasta que los ingredientes queden repartidos de manera uniforme. Raspa las paredes del recipiente si se quedan restos.";
        }

        else if (
            /\b(agrega|añade|incorpora|vierte|coloca)\b/.test(normal) &&
            !/cocina|hornea|hierve|cuece|sofr[ií]e|saltea|dora/.test(normal)
        ) {
            detalle = "Distribuye el ingrediente por toda la preparación y mezcla con suavidad cuando sea necesario para que se integre sin deshacer los demás componentes.";
        }

        else if (/\b(hierve|cuece|cocina|asa|sella|calienta|tapa)\b/.test(normal)) {

            if (/pollo|pavo/.test(recetaTexto)) {
                detalle = "Mantén el fuego indicado y comprueba el centro de la pieza antes de servir; el pollo y el pavo deben alcanzar 74 °C de temperatura interna.";
            }

            else if (/pescado|salm[oó]n|tilapia|at[uú]n|camar[oó]n|marisco/.test(recetaTexto)) {
                detalle = "Respeta el tiempo como referencia y revisa la textura en la parte más gruesa; comprueba que el pescado y los mariscos estén bien cocidos.";
            }

            else if (/huevo|claras|omelette/.test(recetaTexto)) {
                detalle = "Controla el fuego para que la preparación se cocine de manera uniforme y retírala cuando el huevo esté completamente cuajado.";
            }

            else {
                detalle = "Mantén el fuego indicado y revisa la textura durante la cocción. Remueve o voltea cuando sea necesario para evitar que se pegue o se cocine de forma desigual.";
            }
        }

        else if (/\b(sirve|acompaña|decora|termina|presenta)\b/.test(normal)) {
            detalle = "Reparte en las porciones y añade los ingredientes de acabado al final para conservar su textura y aspecto. Ajusta el sazón al gusto antes de llevar a la mesa.";
        }

        else {
            detalle = "Comprueba que los ingredientes queden bien integrados y que la textura sea la esperada antes de pasar al siguiente paso.";
        }

        return base + ". " + detalle;
    }

    // Aplicar fotografías y mejorar las preparaciones.
    window.RECETAS.forEach((receta, indice) => {

        const etiqueta = etiquetaFoto(receta);

        const id = Number.isFinite(Number(receta.id))
            ? Number(receta.id)
            : indice;

        const lockBase = 910000 + id * 2;

        // Fotografía principal y fotografía alternativa.
        receta.fotoGoogle = urlFoto(etiqueta, lockBase);
        receta.fotoAlternativa = urlFoto(etiqueta, lockBase + 1);

        receta.fotoAlt =
            "Fotografía ilustrativa de " +
            (receta.titulo || "una receta saludable");

        // Ampliar los pasos originales sin modificar los ingredientes.
        if (
            !receta._nutrifitPasosAmpliados &&
            Array.isArray(receta.pasos)
        ) {
            receta.pasos = receta.pasos.map(paso =>
                detalleDelPaso(paso, receta)
            );

            receta._nutrifitPasosAmpliados = true;
        }
    });

})();
