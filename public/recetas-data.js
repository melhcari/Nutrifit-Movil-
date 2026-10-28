/* Datos de recetas de NutriFit. Cada receta pertenece a una sola categoría. Valores nutricionales aproximados por porción. */
window.CATEGORIAS = [
 {
  "id": "diabetica",
  "nombre": "Diabética",
  "desc": "Pocos azúcares añadidos y carbohidratos moderados. Esta información es general y no sustituye la indicación de tu médico o nutriólogo.",
  "nota": "Cuenta tus carbohidratos según tu plan."
 },
 {
  "id": "vegana",
  "nombre": "Vegana",
  "desc": "Sin carne, pescado, huevo, lácteos ni miel."
 },
 {
  "id": "vegetariana",
  "nombre": "Vegetariana",
  "desc": "Sin carne ni pescado; pueden incluir huevo y lácteos."
 },
 {
  "id": "celiaca",
  "nombre": "Celíaca",
  "desc": "Sin ingredientes con gluten. Revisa que los productos procesados digan «sin gluten».",
  "nota": "Revisa que los productos procesados (especias, caldos, salsas) digan «sin gluten» y evita la contaminación cruzada en la cocina."
 },
 {
  "id": "alta-proteina",
  "nombre": "Alta en proteína",
  "desc": "25 g de proteína o más por porción."
 },
 {
  "id": "baja-grasa",
  "nombre": "Baja en grasa",
  "desc": "8 g de grasa o menos por porción."
 },
 {
  "id": "keto",
  "nombre": "Keto",
  "desc": "Bajas en carbohidratos y con grasas saludables."
 },
 {
  "id": "mediterranea",
  "nombre": "Mediterránea",
  "desc": "Aceite de oliva, verduras, legumbres y pescado."
 }
];
window.RECETAS = [
 {
  "id": 0,
  "titulo": "Pechuga de Pollo a la Mostaza",
  "desc": "Pechuga de pollo jugosa marinada con mostaza Dijon, ajo y hierbas. Perfecta para una cena alta en proteína.",
  "tags": [
   "Bajo en grasa",
   "Alto en proteína"
  ],
  "categorias": [
   "alta-proteina"
  ],
  "ingredientes": [
   "2 pechugas de pollo (200g)",
   "3 cucharadas de mostaza Dijon",
   "2 dientes de ajo picados",
   "1 cucharada de aceite de oliva",
   "Sal y pimienta al gusto",
   "Perejil fresco (opcional)"
  ],
  "pasos": [
   "Mezcla la mostaza con ajo picado y sal en un bowl",
   "Calienta el aceite en una sartén a fuego medio-alto",
   "Coloca las pechugas y dóralo por ambos lados (5 min cada lado)",
   "Baja el fuego y aplica la mezcla de mostaza sobre el pollo",
   "Cocina 8-10 minutos más hasta que esté cocido internamente",
   "Deja reposar 2 minutos y sirve con verduras asadas"
  ],
  "nutricion": {
   "calorias": "260 cal",
   "proteina": "35g",
   "carbos": "3g",
   "grasas": "9g"
  },
  "fotoGoogle": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPuLghfZ8ZDQou6xYTcT0KoZjniB_LifHEvq4GQ9d0bQ&s=10"
 },
 {
  "id": 1,
  "titulo": "Salmón al Horno con Limón",
  "desc": "Filete de salmón horneado con limón fresco, aceite de oliva y especias. Rico en ácidos grasos omega-3.",
  "tags": [
   "Omega-3",
   "Grasas saludables"
  ],
  "categorias": [
   "mediterranea"
  ],
  "ingredientes": [
   "1 filete de salmón (150g)",
   "1 limón cortado en rodajas",
   "2 cucharadas de aceite de oliva",
   "Sal y pimienta al gusto",
   "Eneldo fresco",
   "Verduras (espárragos, zanahorias)"
  ],
  "pasos": [
   "Precalienta el horno a 200°C",
   "Coloca el salmón en papel aluminio o bandeja de horno",
   "Rocía con aceite de oliva y sazona con sal y pimienta",
   "Coloca rodajas de limón sobre el salmón",
   "Agrega eneldo fresco y verduras alrededor",
   "Hornea durante 15-20 minutos hasta que se desmenuce fácilmente"
  ],
  "nutricion": {
   "calorias": "320 cal",
   "proteina": "32g",
   "carbos": "0g",
   "grasas": "18g"
  },
  "fotoGoogle": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSi8A2yjUkSax_jPRy76-NKDQhG__S4CBPRedZyl2LwFQ&s=10"
 },
 {
  "id": 2,
  "titulo": "Omelette de Espinaca y Queso",
  "desc": "Huevos frescos rellenos de espinaca orgánica y queso bajo en grasa. Desayuno perfecto para definir.",
  "tags": [
   "Desayuno",
   "Alto en proteína"
  ],
  "categorias": [
   "keto"
  ],
  "ingredientes": [
   "3 huevos medianos",
   "2 tazas de espinaca fresca (o 100g)",
   "1/4 taza de queso bajo en grasa",
   "1 cucharada de aceite o spray",
   "Cebolla picada (opcional)",
   "Sal y pimienta al gusto"
  ],
  "pasos": [
   "Calienta el aceite en una sartén antiadherente a fuego medio",
   "Saltea la espinaca durante 1-2 minutos y retira",
   "Bate los huevos con sal y pimienta",
   "Vierte los huevos en la sartén y espera a que comiencen a cuajar",
   "Cuando esté semi-cocido, agrega la espinaca y queso en el centro",
   "Dobla el omelette por la mitad y sirve inmediatamente"
  ],
  "nutricion": {
   "calorias": "250 cal",
   "proteina": "18g",
   "carbos": "3g",
   "grasas": "17g"
  },
  "fotoGoogle": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTQ24B0G7qbMbEXBliXRw-mIutyRFTsH-WWM8WADoRRw&s=10"
 },
 {
  "id": 3,
  "titulo": "Pechuga Rellena de Brócoli",
  "desc": "Pechuga de pollo rellena de brócoli al vapor y queso blanco. Una opción baja en calorías y alta en nutrientes.",
  "tags": [
   "Superproteico",
   "Bajo en calorías"
  ],
  "categorias": [
   "baja-grasa"
  ],
  "ingredientes": [
   "1 pechuga de pollo",
   "150g brócoli al vapor",
   "Queso blanco",
   "Especias"
  ],
  "pasos": [
   "Haz una incisión en la pechuga",
   "Rellena con brócoli y queso",
   "Cocina a 180°C por 25 min",
   "Sirve caliente"
  ],
  "nutricion": {
   "calorias": "300 cal",
   "proteina": "38g",
   "carbos": "10g",
   "grasas": "8g"
  },
  "fotoGoogle": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKrRSwP1LQncB17v2Bds3_lj-ACeX5FSSWmiFKcROMjQ&s=10"
 },
 {
  "id": 4,
  "titulo": "Avena con Frutos Rojos",
  "desc": "Avena integral cocida con leche desnatada, frutos rojos frescos y un toque de miel. Desayuno energético.",
  "tags": [
   "Alto en fibra",
   "Carbos complejos"
  ],
  "categorias": [
   "vegetariana"
  ],
  "ingredientes": [
   "1 taza avena integral",
   "2 tazas leche desnatada",
   "Frutos rojos frescos",
   "Miel al gusto"
  ],
  "pasos": [
   "Hierve la leche",
   "Agrega la avena",
   "Cocina 5 minutos",
   "Sirve con frutos rojos y miel"
  ],
  "nutricion": {
   "calorias": "220 cal",
   "proteina": "8g",
   "carbos": "45g",
   "grasas": "3g"
  },
  "fotoGoogle": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRW575quD47ajz44YzCg8Y_FPm7WHNzT7uAWPlm9xSsHg&s=10"
 },
 {
  "id": 5,
  "titulo": "Ensalada Proteica de Pollo",
  "desc": "Pechuga de pollo desmenuzada con lechuga fresca, tomate, pepino y aderezo de limón. Almuerzo ligero y saciante.",
  "tags": [
   "Ligero",
   "Almuerzo"
  ],
  "categorias": [
   "diabetica"
  ],
  "ingredientes": [
   "150g pechuga de pollo cocida",
   "Lechuga fresca",
   "Tomate",
   "Pepino",
   "Aderezo limón"
  ],
  "pasos": [
   "Cocina y desmenuza el pollo",
   "Pica las verduras",
   "Mezcla todo en un bowl",
   "Agrega el aderezo"
  ],
  "nutricion": {
   "calorias": "280 cal",
   "proteina": "30g",
   "carbos": "15g",
   "grasas": "5g"
  },
  "fotoGoogle": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRW5neNbA0X4yT4HiuxOKtbgDrHCFNuyA9qACmKquWEbg&s=10"
 },
 {
  "id": 6,
  "titulo": "Filete de Pescado a la Parrilla",
  "desc": "Filete de pescado blanco a la parrilla con verduras asadas. Ultra ligero y perfecto para fase de definición.",
  "tags": [
   "Ultra ligero",
   "Bajo en grasa"
  ],
  "categorias": [
   "celiaca"
  ],
  "ingredientes": [
   "1 filete pescado blanco",
   "Sal, pimienta",
   "Limón",
   "Aceite oliva spray",
   "Verduras"
  ],
  "pasos": [
   "Calienta la parrilla",
   "Sazona el pescado",
   "Cocina 4 min cada lado",
   "Acompaña con verduras"
  ],
  "nutricion": {
   "calorias": "200 cal",
   "proteina": "30g",
   "carbos": "5g",
   "grasas": "4g"
  },
  "fotoGoogle": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCYTD0t_xtODmjPHEd3-cac9qO2JCcIu9qAiAWDuMVUA&s=10"
 },
 {
  "id": 7,
  "titulo": "Yogur Griego con Granola",
  "desc": "Yogur griego sin azúcar con granola casera, miel y almendras. Snack proteico perfecto entre comidas.",
  "tags": [
   "Snack",
   "Probióticos"
  ],
  "categorias": [
   "vegetariana"
  ],
  "ingredientes": [
   "200g yogur griego",
   "30g granola casera",
   "10 almendras",
   "Miel"
  ],
  "pasos": [
   "Vierte el yogur en un bowl",
   "Agrega la granola",
   "Añade almendras",
   "Rocía con miel"
  ],
  "nutricion": {
   "calorias": "190 cal",
   "proteina": "15g",
   "carbos": "25g",
   "grasas": "6g"
  },
  "fotoGoogle": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcH94lxW2SaTU9viWQJ8f5UdIiIw2hcqx7NDfB9O8BNg&s=10"
 },
 {
  "id": 8,
  "titulo": "Arroz Integral con Pollo",
  "desc": "Arroz integral con pechuga de pollo magra y mix de verduras. Comida balanceada para aumento muscular.",
  "tags": [
   "Balanceado",
   "Gain muscular"
  ],
  "categorias": [
   "baja-grasa"
  ],
  "ingredientes": [
   "1 taza arroz integral",
   "150g pechuga pollo",
   "Mix de verduras",
   "Sal, pimienta"
  ],
  "pasos": [
   "Cocina el arroz",
   "Cocina la pechuga",
   "Saltea las verduras",
   "Mezcla todo"
  ],
  "nutricion": {
   "calorias": "380 cal",
   "proteina": "28g",
   "carbos": "50g",
   "grasas": "8g"
  },
  "fotoGoogle": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFJdcL1qC0E_Qd0gapP7DlS1nx7aenEX_gNh3NZLyN4A&s=10"
 },
 {
  "id": 9,
  "titulo": "Sopa de Lentejas y Pollo",
  "desc": "Sopa casera de lentejas rojas con pollo desmenuzado, vegetales y caldo de pollo bajo en sodio. Reconfortante.",
  "tags": [
   "Proteína vegetal",
   "Fibra"
  ],
  "categorias": [
   "mediterranea"
  ],
  "ingredientes": [
   "150g lentejas rojas",
   "100g pollo desmenuzado",
   "Vegetales variados",
   "Caldo pollo bajo sodio"
  ],
  "pasos": [
   "Hierve el caldo",
   "Agrega lentejas y pollo",
   "Cocina 20 minutos",
   "Añade verduras y sirve"
  ],
  "nutricion": {
   "calorias": "240 cal",
   "proteina": "22g",
   "carbos": "30g",
   "grasas": "4g"
  },
  "fotoGoogle": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn_At-oXe5ynaj6qjIbDkYYzQIJVABu55iSUvi8hJUng&s=10"
 },
 {
  "id": 10,
  "titulo": "Pechuga de Pavo con Champiñones",
  "desc": "Filete de pavo tierno con setas frescas salteadas en vino blanco. Bajo en grasa y muy versátil.",
  "tags": [
   "Ultra magro",
   "Alto en proteína"
  ],
  "categorias": [
   "alta-proteina"
  ],
  "ingredientes": [
   "150g pechuga pavo",
   "200g champiñones",
   "Vino blanco",
   "Aceite oliva"
  ],
  "pasos": [
   "Cocina el pavo",
   "Saltea los champiñones",
   "Agrega vino blanco",
   "Reduce y sirve"
  ],
  "nutricion": {
   "calorias": "260 cal",
   "proteina": "36g",
   "carbos": "8g",
   "grasas": "7g"
  },
  "fotoGoogle": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbyaClF_hH-gdx-rVnOiXEry6hPLfULu_PhpsUxP3fsA&s=10"
 },
 {
  "id": 11,
  "titulo": "Tofu a la Parrilla con Verduras",
  "desc": "Tofu firme marinado en salsa de soja y jengibre. Perfecta opción vegana y baja en calorías.",
  "tags": [
   "Vegano",
   "Bajo en calorías"
  ],
  "categorias": [
   "vegana"
  ],
  "ingredientes": [
   "200g tofu firme",
   "Salsa soja",
   "Jengibre",
   "Verduras mixtas"
  ],
  "pasos": [
   "Marina el tofu",
   "Cocina en parrilla caliente",
   "Voltea cuidadosamente",
   "Acompaña con verduras"
  ],
  "nutricion": {
   "calorias": "180 cal",
   "proteina": "20g",
   "carbos": "12g",
   "grasas": "6g"
  },
  "fotoGoogle": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4VZ1PCP84WPMtsEY8Eaic7GCid1uEVzMCS_n2cGf97w&s=10"
 },
 {
  "id": 12,
  "titulo": "Tilapia al Vapor con Brócoli",
  "desc": "Filete de tilapia cocido al vapor con limón y brócoli. Súper ligero y fácil de digerir.",
  "tags": [
   "Ligero",
   "Fácil digestión"
  ],
  "categorias": [
   "baja-grasa"
  ],
  "ingredientes": [
   "150g filete tilapia",
   "200g brócoli",
   "Limón",
   "Sal, pimienta"
  ],
  "pasos": [
   "Prepara una vaporera",
   "Coloca el pescado y brócoli",
   "Cocina 12 minutos",
   "Sirve con limón"
  ],
  "nutricion": {
   "calorias": "210 cal",
   "proteina": "28g",
   "carbos": "15g",
   "grasas": "3g"
  },
  "fotoGoogle": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8Ro4qOGVQmp1ak9ItZCxXTGSBv4kGHgvnSAMXCml2A&s=10"
 },
 {
  "id": 13,
  "titulo": "Batido Proteico Post-Entreno",
  "desc": "Smoothie con proteína en polvo, plátano y leche desnatada. Recuperación rápida después del entrenamiento.",
  "tags": [
   "Post-entreno",
   "Rápido"
  ],
  "categorias": [
   "vegetariana"
  ],
  "ingredientes": [
   "30g proteína en polvo",
   "1 plátano",
   "200ml leche desnatada",
   "Hielo"
  ],
  "pasos": [
   "Vierte la leche",
   "Agrega proteína y plátano",
   "Añade hielo",
   "Licúa bien"
  ],
  "nutricion": {
   "calorias": "240 cal",
   "proteina": "30g",
   "carbos": "30g",
   "grasas": "2g"
  },
  "fotoGoogle": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ1Avxxj0ppldKWZyx5wpeQit3kGKLuj2foUKc9gGUIA&s=10"
 },
 {
  "id": 14,
  "titulo": "Tallarín de Calabacín con Pesto",
  "desc": "Noodles de calabacín crudo con pesto casero y pollo. Baja en carbos y muy sabrosa.",
  "tags": [
   "Baja en carbos",
   "Keto-friendly"
  ],
  "categorias": [
   "keto"
  ],
  "ingredientes": [
   "2 calabacines",
   "Pollo cocido",
   "Pesto casero",
   "Tomate seco"
  ],
  "pasos": [
   "Crea fideos de calabacín",
   "Saltea con pollo",
   "Agrega pesto",
   "Sirve inmediatamente"
  ],
  "nutricion": {
   "calorias": "180 cal",
   "proteina": "15g",
   "carbos": "12g",
   "grasas": "8g"
  },
  "fotoGoogle": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQStlkUQ9xlqeS875iJWzaip19AwGKGKI91jif9w_oEmQ&s=100"
 },
 {
  "id": 15,
  "titulo": "Filete de Res Magra a la Parrilla",
  "desc": "Filete magro asado a la parrilla con sal y pimienta. Proteína de origen animal premium.",
  "tags": [
   "Proteína premium",
   "Alto en hierro"
  ],
  "categorias": [
   "alta-proteina"
  ],
  "ingredientes": [
   "150g filete magro",
   "Sal",
   "Pimienta",
   "Aceite oliva"
  ],
  "pasos": [
   "Calienta parrilla fuerte",
   "Sazona el filete",
   "Cocina 3 min por lado",
   "Descansa y sirve"
  ],
  "nutricion": {
   "calorias": "310 cal",
   "proteina": "42g",
   "carbos": "0g",
   "grasas": "15g"
  },
  "fotoGoogle": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-Wdy40B_2RNyv6OSBZQBByhWp01msLJPC0JTkys85aA&s=10"
 },
 {
  "id": 16,
  "titulo": "Tortilla de Claras de Huevo",
  "desc": "Tortilla hecha solo con claras, sin yemas. Ultra baja en calorías y grasas.",
  "tags": [
   "Ultrabajo en grasa",
   "Definición"
  ],
  "categorias": [
   "baja-grasa"
  ],
  "ingredientes": [
   "4 claras de huevo",
   "Spray aceite",
   "Cebollino",
   "Pimienta"
  ],
  "pasos": [
   "Bate las claras",
   "Cocina en sartén antiadherente",
   "Añade cebollino",
   "Dobla y sirve"
  ],
  "nutricion": {
   "calorias": "120 cal",
   "proteina": "25g",
   "carbos": "1g",
   "grasas": "0.5g"
  },
  "fotoGoogle": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz4x11CQkRIroLGZDrNyuWkpKkKPf-nheF5AXq_wj7Mw&s=10"
 },
 {
  "id": 17,
  "titulo": "Atún en Lata con Ensalada",
  "desc": "Atún natural sin aceite mezclado con ensalada fresca. Rápido, práctico y nutritivo.",
  "tags": [
   "Práctico",
   "Omega-3"
  ],
  "categorias": [
   "mediterranea"
  ],
  "ingredientes": [
   "150g atún en lata",
   "Lechuga variada",
   "Tomate",
   "Cebolla roja",
   "Limón"
  ],
  "pasos": [
   "Abre la lata de atún",
   "Pica las verduras",
   "Mezcla en bowl",
   "Agrega jugo limón"
  ],
  "nutricion": {
   "calorias": "200 cal",
   "proteina": "28g",
   "carbos": "8g",
   "grasas": "2g"
  },
  "fotoGoogle": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_LiqdZb-YaHwbhAvVq5gpW3MesiUPUfTmjrx78cBqtg&s=10"
 },
 {
  "id": 18,
  "titulo": "Pechuga de Pollo en Salsa Tomate",
  "desc": "Pechuga cocida en salsa tomate casera con hierbas italianas. Deliciosa y saludable.",
  "tags": [
   "Salsa casera",
   "Italiano"
  ],
  "categorias": [
   "alta-proteina"
  ],
  "ingredientes": [
   "150g pechuga pollo",
   "Salsa tomate casera",
   "Ajo, cebolla",
   "Hierbas italianas"
  ],
  "pasos": [
   "Prepara la salsa",
   "Cocina el pollo",
   "Simmer en salsa",
   "Sirve con verduras"
  ],
  "nutricion": {
   "calorias": "270 cal",
   "proteina": "34g",
   "carbos": "12g",
   "grasas": "6g"
  },
  "fotoGoogle": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFDHzz9w22Pi8nFYJKflEjH_mk7zH-TbguqmO9gNUg0g&s=10"
 },
 {
  "id": 19,
  "titulo": "Smoothie Bowl Proteico",
  "desc": "Bowl cremoso con proteína en polvo, yogur griego y toppings. Desayuno delicioso y balanceado.",
  "tags": [
   "Desayuno",
   "Delicioso"
  ],
  "categorias": [
   "vegetariana"
  ],
  "ingredientes": [
   "200g yogur griego",
   "30g proteína polvo",
   "Frutas variadas",
   "Granola, nueces"
  ],
  "pasos": [
   "Licúa yogur con proteína",
   "Vierte en bowl",
   "Agrega frutas encima",
   "Decora con granola"
  ],
  "nutricion": {
   "calorias": "280 cal",
   "proteina": "22g",
   "carbos": "35g",
   "grasas": "6g"
  },
  "fotoGoogle": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaHsOANHYS-VzS43RhGLYwO0RQ6ngQErU4743g9akjpg&s=10"
 },
 {
  "id": 20,
  "titulo": "Bowl de Quinoa y Frijoles Negros",
  "desc": "Quinoa con frijoles negros, aguacate, tomate y cilantro. Completo, saciante y 100% vegetal.",
  "tags": [
   "Vegano",
   "Fibra"
  ],
  "categorias": [
   "vegana"
  ],
  "ingredientes": [
   "1/2 taza de quinoa cocida",
   "1/2 taza de frijoles negros cocidos",
   "1/2 aguacate pequeño",
   "1 tomate picado",
   "Cilantro y jugo de limón",
   "Sal y pimienta al gusto"
  ],
  "pasos": [
   "Cuece la quinoa en agua (15 min) y déjala entibiar",
   "Escurre y enjuaga los frijoles",
   "Arma el bowl con la quinoa y los frijoles",
   "Agrega el tomate, el aguacate en cubos y el cilantro",
   "Aliña con limón, sal y pimienta"
  ],
  "nutricion": {
   "calorias": "330 cal",
   "proteina": "13g",
   "carbos": "46g",
   "grasas": "12g"
  }
 },
 {
  "id": 21,
  "titulo": "Curry de Garbanzos y Espinaca",
  "desc": "Garbanzos y espinaca en una salsa suave de tomate, especias y leche de coco light.",
  "tags": [
   "Vegano",
   "Proteína vegetal"
  ],
  "categorias": [
   "vegana"
  ],
  "ingredientes": [
   "1 taza de garbanzos cocidos",
   "2 tazas de espinaca fresca",
   "1/2 cebolla y 2 dientes de ajo",
   "1 cucharadita de curry en polvo",
   "1/2 taza de tomate triturado",
   "1/4 taza de leche de coco light"
  ],
  "pasos": [
   "Sofríe la cebolla y el ajo con el curry durante 3 minutos",
   "Agrega el tomate y cocina 5 minutos",
   "Añade los garbanzos y la leche de coco",
   "Cocina 8 minutos a fuego bajo",
   "Incorpora la espinaca hasta que se suavice y sirve"
  ],
  "nutricion": {
   "calorias": "380 cal",
   "proteina": "16g",
   "carbos": "52g",
   "grasas": "12g"
  }
 },
 {
  "id": 22,
  "titulo": "Ensalada Griega con Garbanzos",
  "desc": "Pepino, tomate, aceitunas y queso feta con garbanzos y aceite de oliva.",
  "tags": [
   "Mediterránea",
   "Vegetariana"
  ],
  "categorias": [
   "mediterranea"
  ],
  "ingredientes": [
   "1/2 taza de garbanzos cocidos",
   "1 pepino y 1 tomate en cubos",
   "30 g de queso feta",
   "6 aceitunas negras",
   "1 cucharada de aceite de oliva",
   "Cebolla morada y orégano"
  ],
  "pasos": [
   "Corta las verduras en cubos",
   "Mézclalas con los garbanzos y las aceitunas",
   "Agrega el feta desmenuzado",
   "Aliña con aceite de oliva, orégano y sal",
   "Sirve fría"
  ],
  "nutricion": {
   "calorias": "370 cal",
   "proteina": "12g",
   "carbos": "30g",
   "grasas": "24g"
  }
 },
 {
  "id": 23,
  "titulo": "Hummus con Crudités",
  "desc": "Hummus cremoso de garbanzo con bastones de zanahoria, pepino y apio.",
  "tags": [
   "Vegano",
   "Snack"
  ],
  "categorias": [
   "vegana"
  ],
  "ingredientes": [
   "1/4 taza de hummus",
   "1 zanahoria",
   "1/2 pepino",
   "2 tallos de apio",
   "Un chorrito de limón"
  ],
  "pasos": [
   "Lava y corta las verduras en bastones",
   "Sirve el hummus en un plato pequeño",
   "Exprime un poco de limón encima",
   "Acompaña con las verduras"
  ],
  "nutricion": {
   "calorias": "150 cal",
   "proteina": "6g",
   "carbos": "18g",
   "grasas": "6g"
  }
 },
 {
  "id": 24,
  "titulo": "Aguacate Relleno de Atún",
  "desc": "Medio aguacate relleno de atún natural, yogur griego y limón.",
  "tags": [
   "Keto",
   "Omega-3"
  ],
  "categorias": [
   "keto"
  ],
  "ingredientes": [
   "1/2 aguacate",
   "1 lata pequeña de atún en agua (80 g)",
   "1 cucharada de yogur griego natural",
   "Jugo de limón",
   "Sal, pimienta y cebollín"
  ],
  "pasos": [
   "Escurre el atún",
   "Mézclalo con el yogur, el limón, la sal y la pimienta",
   "Retira un poco de pulpa del aguacate para hacer más espacio",
   "Rellena el aguacate con la mezcla",
   "Espolvorea cebollín y sirve"
  ],
  "nutricion": {
   "calorias": "280 cal",
   "proteina": "22g",
   "carbos": "9g",
   "grasas": "17g"
  }
 },
 {
  "id": 25,
  "titulo": "Ensalada de Lentejas y Verduras",
  "desc": "Lentejas con pepino, tomate, cebolla morada y perejil, aliñadas con limón y aceite de oliva.",
  "tags": [
   "Vegano",
   "Fibra"
  ],
  "categorias": [
   "vegana"
  ],
  "ingredientes": [
   "3/4 taza de lentejas cocidas",
   "1 pepino y 1 tomate en cubos",
   "1/4 de cebolla morada",
   "Perejil picado",
   "1 cucharadita de aceite de oliva y jugo de limón"
  ],
  "pasos": [
   "Cuece las lentejas hasta que estén tiernas y déjalas enfriar",
   "Pica las verduras en cubos pequeños",
   "Mezcla todo en un bowl",
   "Aliña con aceite, limón, sal y pimienta"
  ],
  "nutricion": {
   "calorias": "240 cal",
   "proteina": "14g",
   "carbos": "32g",
   "grasas": "5g"
  }
 },
 {
  "id": 26,
  "titulo": "Gazpacho Andaluz",
  "desc": "Sopa fría de tomate, pepino y pimiento. Refrescante y ligera.",
  "tags": [
   "Vegano",
   "Refrescante"
  ],
  "categorias": [
   "mediterranea"
  ],
  "ingredientes": [
   "3 jitomates maduros",
   "1/2 pepino",
   "1/2 pimiento rojo",
   "1 diente de ajo",
   "1 cucharada de aceite de oliva y un chorrito de vinagre"
  ],
  "pasos": [
   "Lava y trocea las verduras",
   "Licúa todo con el aceite, el vinagre y sal hasta que quede suave",
   "Refrigera al menos 1 hora",
   "Sirve bien frío"
  ],
  "nutricion": {
   "calorias": "170 cal",
   "proteina": "3g",
   "carbos": "14g",
   "grasas": "12g"
  }
 },
 {
  "id": 27,
  "titulo": "Ratatouille al Horno",
  "desc": "Berenjena, calabacín, jitomate y pimiento horneados con ajo y tomillo.",
  "tags": [
   "Vegano",
   "Verduras"
  ],
  "categorias": [
   "diabetica"
  ],
  "ingredientes": [
   "1 berenjena pequeña",
   "1 calabacín",
   "2 jitomates",
   "1/2 pimiento",
   "1 cucharada de aceite de oliva, ajo y tomillo"
  ],
  "pasos": [
   "Precalienta el horno a 190 °C",
   "Corta las verduras en rodajas finas",
   "Acomódalas en un refractario con ajo, tomillo, aceite y sal",
   "Hornea 35 minutos hasta que estén suaves"
  ],
  "nutricion": {
   "calorias": "160 cal",
   "proteina": "3g",
   "carbos": "18g",
   "grasas": "8g"
  }
 },
 {
  "id": 28,
  "titulo": "Falafel al Horno con Ensalada",
  "desc": "Croquetas de garbanzo con hierbas, horneadas y servidas con ensalada fresca.",
  "tags": [
   "Vegano",
   "Proteína vegetal"
  ],
  "categorias": [
   "vegana"
  ],
  "ingredientes": [
   "3/4 taza de garbanzos cocidos",
   "2 cucharadas de harina de garbanzo",
   "Perejil, ajo y comino",
   "1 cucharadita de aceite",
   "Lechuga, pepino y jitomate"
  ],
  "pasos": [
   "Procesa los garbanzos con el perejil, el ajo, el comino y la harina",
   "Forma 4 bolitas aplanadas",
   "Hornea a 200 °C durante 20 minutos, volteando a la mitad",
   "Sirve con la ensalada y limón"
  ],
  "nutricion": {
   "calorias": "280 cal",
   "proteina": "13g",
   "carbos": "40g",
   "grasas": "7g"
  }
 },
 {
  "id": 29,
  "titulo": "Pimientos Rellenos de Arroz y Frijoles",
  "desc": "Pimientos horneados rellenos de arroz integral, frijoles y verduras.",
  "tags": [
   "Vegano",
   "Saciante"
  ],
  "categorias": [
   "vegana"
  ],
  "ingredientes": [
   "2 pimientos morrones",
   "1/2 taza de arroz integral cocido",
   "1/2 taza de frijoles cocidos",
   "1/4 de cebolla y 1 jitomate",
   "Comino y cilantro"
  ],
  "pasos": [
   "Corta la tapa de los pimientos y retira las semillas",
   "Mezcla el arroz con los frijoles, la cebolla, el jitomate y el comino",
   "Rellena los pimientos",
   "Hornea a 180 °C durante 30 minutos"
  ],
  "nutricion": {
   "calorias": "310 cal",
   "proteina": "11g",
   "carbos": "52g",
   "grasas": "6g"
  }
 },
 {
  "id": 30,
  "titulo": "Sopa de Verduras y Frijoles",
  "desc": "Sopa casera de verduras con frijoles, ligera y reconfortante.",
  "tags": [
   "Vegano",
   "Ligera"
  ],
  "categorias": [
   "celiaca"
  ],
  "ingredientes": [
   "1/2 taza de frijoles cocidos",
   "1 zanahoria y 1 calabacín",
   "1 jitomate y 1/4 de cebolla",
   "2 tazas de caldo de verduras sin gluten",
   "Ajo, sal y pimienta"
  ],
  "pasos": [
   "Sofríe la cebolla y el ajo en una olla",
   "Agrega las verduras picadas y el caldo",
   "Cocina 15 minutos",
   "Añade los frijoles, calienta 5 minutos más y sirve"
  ],
  "nutricion": {
   "calorias": "210 cal",
   "proteina": "10g",
   "carbos": "34g",
   "grasas": "3g"
  }
 },
 {
  "id": 31,
  "titulo": "Tacos de Coliflor Asada",
  "desc": "Coliflor asada con comino sobre tortillas de maíz, aguacate y cilantro.",
  "tags": [
   "Vegano",
   "Tacos"
  ],
  "categorias": [
   "vegana"
  ],
  "ingredientes": [
   "200 g de coliflor en floretes",
   "3 tortillas de maíz",
   "1/4 de aguacate",
   "Comino, limón y cilantro",
   "1 cucharadita de aceite"
  ],
  "pasos": [
   "Mezcla la coliflor con el aceite, el comino y sal",
   "Hornea a 200 °C durante 25 minutos",
   "Calienta las tortillas",
   "Arma los tacos con la coliflor, el aguacate, el cilantro y limón"
  ],
  "nutricion": {
   "calorias": "270 cal",
   "proteina": "8g",
   "carbos": "44g",
   "grasas": "7g"
  }
 },
 {
  "id": 32,
  "titulo": "Tofu Revuelto con Espinaca",
  "desc": "Tofu desmenuzado con espinaca y cúrcuma. Un desayuno vegetal alto en proteína.",
  "tags": [
   "Vegano",
   "Keto"
  ],
  "categorias": [
   "diabetica"
  ],
  "ingredientes": [
   "150 g de tofu firme",
   "2 tazas de espinaca",
   "1/4 de cebolla",
   "1/4 de cucharadita de cúrcuma",
   "1 cucharadita de aceite"
  ],
  "pasos": [
   "Desmenuza el tofu con las manos",
   "Sofríe la cebolla en el aceite",
   "Agrega el tofu y la cúrcuma y cocina 5 minutos",
   "Incorpora la espinaca hasta que se suavice",
   "Sazona con sal y pimienta"
  ],
  "nutricion": {
   "calorias": "190 cal",
   "proteina": "17g",
   "carbos": "6g",
   "grasas": "11g"
  }
 },
 {
  "id": 33,
  "titulo": "Avena Nocturna con Plátano y Canela",
  "desc": "Avena remojada en leche de almendra con plátano, chía y canela. Se prepara la noche anterior.",
  "tags": [
   "Vegano",
   "Desayuno"
  ],
  "categorias": [
   "vegetariana"
  ],
  "ingredientes": [
   "1/2 taza de avena",
   "3/4 taza de leche de almendra sin azúcar",
   "1/2 plátano",
   "1 cucharadita de chía",
   "Canela al gusto"
  ],
  "pasos": [
   "Mezcla la avena, la leche, la chía y la canela en un frasco",
   "Refrigera toda la noche",
   "Por la mañana agrega el plátano en rodajas",
   "Come fría o calienta unos segundos"
  ],
  "nutricion": {
   "calorias": "250 cal",
   "proteina": "7g",
   "carbos": "44g",
   "grasas": "6g"
  }
 },
 {
  "id": 34,
  "titulo": "Bowl de Garbanzos y Verduras Asadas",
  "desc": "Garbanzos con calabacín y pimiento asados, con comino y limón.",
  "tags": [
   "Vegano",
   "Mediterránea"
  ],
  "categorias": [
   "vegana"
  ],
  "ingredientes": [
   "3/4 taza de garbanzos cocidos",
   "1 calabacín",
   "1 pimiento",
   "1 cucharadita de aceite de oliva",
   "Comino, ajo en polvo y limón"
  ],
  "pasos": [
   "Corta las verduras en cubos",
   "Mézclalas con los garbanzos, el aceite y las especias",
   "Hornea a 200 °C durante 25 minutos",
   "Sirve con jugo de limón"
  ],
  "nutricion": {
   "calorias": "270 cal",
   "proteina": "12g",
   "carbos": "38g",
   "grasas": "7g"
  }
 },
 {
  "id": 35,
  "titulo": "Ensalada de Quinoa y Aguacate",
  "desc": "Quinoa fría con aguacate, pepino y jitomate, aliñada con limón.",
  "tags": [
   "Vegano",
   "Fresca"
  ],
  "categorias": [
   "vegana"
  ],
  "ingredientes": [
   "1/2 taza de quinoa cocida",
   "1/2 aguacate pequeño",
   "1/2 pepino y 1 jitomate",
   "Cilantro",
   "Jugo de limón, sal y pimienta"
  ],
  "pasos": [
   "Cuece la quinoa y deja que se enfríe",
   "Pica el pepino, el jitomate y el aguacate",
   "Mezcla todo con el cilantro",
   "Aliña con limón, sal y pimienta"
  ],
  "nutricion": {
   "calorias": "310 cal",
   "proteina": "8g",
   "carbos": "34g",
   "grasas": "15g"
  }
 },
 {
  "id": 36,
  "titulo": "Pollo al Limón con Aceitunas",
  "desc": "Pechuga dorada con limón, ajo y aceitunas. Baja en carbohidratos y muy jugosa.",
  "tags": [
   "Keto",
   "Mediterránea"
  ],
  "categorias": [
   "mediterranea"
  ],
  "ingredientes": [
   "150 g de pechuga de pollo",
   "1 cucharada de aceite de oliva",
   "Jugo y ralladura de 1/2 limón",
   "6 aceitunas verdes",
   "2 dientes de ajo y orégano"
  ],
  "pasos": [
   "Sazona el pollo con sal, pimienta y orégano",
   "Dóralo en el aceite 5 minutos por lado",
   "Agrega el ajo, el limón y las aceitunas",
   "Tapa y cocina 8 minutos más a fuego bajo",
   "Deja reposar 2 minutos y sirve"
  ],
  "nutricion": {
   "calorias": "300 cal",
   "proteina": "32g",
   "carbos": "3g",
   "grasas": "17g"
  }
 },
 {
  "id": 37,
  "titulo": "Salmón con Espárragos a la Mantequilla",
  "desc": "Salmón a la plancha con espárragos salteados en mantequilla y limón.",
  "tags": [
   "Keto",
   "Omega-3"
  ],
  "categorias": [
   "keto"
  ],
  "ingredientes": [
   "150 g de filete de salmón",
   "150 g de espárragos",
   "1 cucharadita de mantequilla",
   "Limón",
   "Sal y pimienta"
  ],
  "pasos": [
   "Sazona el salmón con sal y pimienta",
   "Cocínalo a la plancha 4 minutos por lado",
   "Saltea los espárragos en la mantequilla 5 minutos",
   "Sirve con limón"
  ],
  "nutricion": {
   "calorias": "380 cal",
   "proteina": "37g",
   "carbos": "6g",
   "grasas": "23g"
  }
 },
 {
  "id": 38,
  "titulo": "Ensalada César con Pollo",
  "desc": "Lechuga romana con pollo a la plancha, parmesano y aderezo cremoso de yogur y limón, sin crutones.",
  "tags": [
   "Keto",
   "Alta en proteína"
  ],
  "categorias": [
   "alta-proteina"
  ],
  "ingredientes": [
   "100 g de pechuga de pollo",
   "2 tazas de lechuga romana",
   "15 g de queso parmesano",
   "2 cucharadas de yogur griego natural",
   "Jugo de limón, ajo y 1 cucharadita de aceite"
  ],
  "pasos": [
   "Cocina el pollo a la plancha y córtalo en tiras",
   "Mezcla el yogur, el limón, el ajo y el aceite para el aderezo",
   "Parte la lechuga y combínala con el aderezo",
   "Agrega el pollo y el parmesano"
  ],
  "nutricion": {
   "calorias": "270 cal",
   "proteina": "30g",
   "carbos": "6g",
   "grasas": "14g"
  }
 },
 {
  "id": 39,
  "titulo": "Huevos Revueltos con Aguacate y Jitomate",
  "desc": "Huevos suaves con aguacate fresco y jitomate. Desayuno keto rápido.",
  "tags": [
   "Keto",
   "Desayuno"
  ],
  "categorias": [
   "keto"
  ],
  "ingredientes": [
   "3 huevos",
   "1/2 aguacate pequeño",
   "1 jitomate",
   "1 cucharadita de mantequilla",
   "Sal, pimienta y cebollín"
  ],
  "pasos": [
   "Bate los huevos con sal y pimienta",
   "Cocínalos en la mantequilla a fuego bajo, moviendo suavemente",
   "Pica el jitomate y el aguacate",
   "Sirve los huevos con el jitomate y el aguacate encima"
  ],
  "nutricion": {
   "calorias": "330 cal",
   "proteina": "20g",
   "carbos": "9g",
   "grasas": "24g"
  }
 },
 {
  "id": 40,
  "titulo": "Albóndigas de Res en Salsa de Jitomate",
  "desc": "Albóndigas sin pan rallado, cocidas en salsa de jitomate casera.",
  "tags": [
   "Keto",
   "Alta en proteína"
  ],
  "categorias": [
   "keto"
  ],
  "ingredientes": [
   "150 g de carne molida de res magra",
   "1 huevo",
   "2 jitomates licuados",
   "1/4 de cebolla y 1 diente de ajo",
   "Orégano, sal y pimienta"
  ],
  "pasos": [
   "Mezcla la carne con el huevo, el ajo picado, sal y orégano",
   "Forma 6 albóndigas",
   "Sofríe la cebolla y agrega el jitomate licuado",
   "Cocina las albóndigas en la salsa 20 minutos a fuego bajo"
  ],
  "nutricion": {
   "calorias": "330 cal",
   "proteina": "30g",
   "carbos": "8g",
   "grasas": "20g"
  }
 },
 {
  "id": 41,
  "titulo": "Champiñones Rellenos de Queso y Espinaca",
  "desc": "Champiñones grandes rellenos de espinaca y queso panela, gratinados al horno.",
  "tags": [
   "Keto",
   "Vegetariano"
  ],
  "categorias": [
   "vegetariana"
  ],
  "ingredientes": [
   "4 champiñones grandes",
   "1 taza de espinaca",
   "40 g de queso panela",
   "1 diente de ajo",
   "1 cucharadita de aceite de oliva"
  ],
  "pasos": [
   "Quita los tallos de los champiñones y pícalos",
   "Saltea los tallos con el ajo y la espinaca",
   "Mezcla con el queso desmenuzado",
   "Rellena los champiñones y hornea a 200 °C durante 15 minutos"
  ],
  "nutricion": {
   "calorias": "200 cal",
   "proteina": "14g",
   "carbos": "8g",
   "grasas": "12g"
  }
 },
 {
  "id": 42,
  "titulo": "Camarones al Ajillo con Calabacín",
  "desc": "Camarones salteados con ajo sobre espagueti de calabacín.",
  "tags": [
   "Keto",
   "Mariscos"
  ],
  "categorias": [
   "keto"
  ],
  "ingredientes": [
   "150 g de camarones limpios",
   "1 calabacín en espiral",
   "2 cucharaditas de aceite de oliva",
   "3 dientes de ajo",
   "Perejil y jugo de limón"
  ],
  "pasos": [
   "Calienta el aceite y sofríe el ajo 1 minuto",
   "Agrega los camarones y cocina 3 minutos por lado",
   "Añade el calabacín y saltea 2 minutos",
   "Termina con perejil y limón"
  ],
  "nutricion": {
   "calorias": "250 cal",
   "proteina": "30g",
   "carbos": "7g",
   "grasas": "11g"
  }
 },
 {
  "id": 43,
  "titulo": "Coliflor Gratinada con Queso",
  "desc": "Coliflor al horno cubierta de queso mozzarella derretido.",
  "tags": [
   "Keto",
   "Vegetariano"
  ],
  "categorias": [
   "vegetariana"
  ],
  "ingredientes": [
   "250 g de coliflor en floretes",
   "40 g de queso mozzarella",
   "1 cucharadita de mantequilla",
   "Ajo en polvo, sal y pimienta"
  ],
  "pasos": [
   "Cuece la coliflor al vapor 8 minutos",
   "Acomódala en un refractario con la mantequilla y las especias",
   "Cubre con el queso",
   "Gratina en el horno a 200 °C durante 10 minutos"
  ],
  "nutricion": {
   "calorias": "200 cal",
   "proteina": "13g",
   "carbos": "12g",
   "grasas": "11g"
  }
 },
 {
  "id": 44,
  "titulo": "Pollo a la Parrilla con Ensalada de Aguacate",
  "desc": "Pechuga a la parrilla con una ensalada cremosa de aguacate, lechuga y limón.",
  "tags": [
   "Keto",
   "Alta en proteína"
  ],
  "categorias": [
   "alta-proteina"
  ],
  "ingredientes": [
   "150 g de pechuga de pollo",
   "1/2 aguacate pequeño",
   "2 tazas de lechuga",
   "Jugo de limón",
   "Sal, pimienta y paprika"
  ],
  "pasos": [
   "Sazona el pollo con paprika, sal y pimienta",
   "Cocínalo en la parrilla 6 minutos por lado",
   "Mezcla la lechuga con el aguacate en cubos y el limón",
   "Sirve el pollo sobre la ensalada"
  ],
  "nutricion": {
   "calorias": "290 cal",
   "proteina": "33g",
   "carbos": "8g",
   "grasas": "15g"
  }
 },
 {
  "id": 45,
  "titulo": "Enchiladas Verdes de Pollo",
  "desc": "Tortillas de maíz rellenas de pollo y bañadas en salsa verde casera.",
  "tags": [
   "Sin gluten",
   "Mexicana"
  ],
  "categorias": [
   "celiaca"
  ],
  "ingredientes": [
   "3 tortillas de maíz",
   "120 g de pollo cocido deshebrado",
   "1/2 taza de salsa verde",
   "1 cucharada de yogur natural",
   "Cebolla y cilantro"
  ],
  "pasos": [
   "Calienta la salsa verde",
   "Pasa las tortillas por la salsa y rellénalas con el pollo",
   "Enróllalas y báñalas con más salsa",
   "Sirve con cebolla, cilantro y yogur"
  ],
  "nutricion": {
   "calorias": "320 cal",
   "proteina": "28g",
   "carbos": "30g",
   "grasas": "9g"
  }
 },
 {
  "id": 46,
  "titulo": "Caldo Tlalpeño",
  "desc": "Caldo ligero de pollo con garbanzos, zanahoria y un toque de chipotle.",
  "tags": [
   "Sin gluten",
   "Caldo"
  ],
  "categorias": [
   "celiaca"
  ],
  "ingredientes": [
   "120 g de pollo deshebrado",
   "1/3 taza de garbanzos cocidos",
   "1 zanahoria",
   "1 chile chipotle",
   "2 tazas de caldo de pollo sin gluten"
  ],
  "pasos": [
   "Hierve el caldo con la zanahoria 10 minutos",
   "Agrega el chipotle y los garbanzos",
   "Añade el pollo y cocina 5 minutos",
   "Sirve caliente con limón"
  ],
  "nutricion": {
   "calorias": "260 cal",
   "proteina": "26g",
   "carbos": "20g",
   "grasas": "8g"
  }
 },
 {
  "id": 47,
  "titulo": "Arroz con Verduras y Huevo",
  "desc": "Arroz salteado con chícharos, zanahoria y huevo revuelto.",
  "tags": [
   "Sin gluten",
   "Arroz"
  ],
  "categorias": [
   "celiaca"
  ],
  "ingredientes": [
   "1/2 taza de arroz cocido",
   "1 huevo",
   "1/4 taza de chícharos",
   "1 zanahoria picada",
   "1 cucharadita de aceite"
  ],
  "pasos": [
   "Saltea las verduras en el aceite",
   "Agrega el arroz y mezcla",
   "Haz un hueco, cuaja el huevo revuelto e intégralo",
   "Sazona con sal y pimienta"
  ],
  "nutricion": {
   "calorias": "280 cal",
   "proteina": "11g",
   "carbos": "40g",
   "grasas": "9g"
  }
 },
 {
  "id": 48,
  "titulo": "Papas al Horno con Pollo y Romero",
  "desc": "Papas y pollo dorados al horno con ajo y romero.",
  "tags": [
   "Sin gluten",
   "Al horno"
  ],
  "categorias": [
   "celiaca"
  ],
  "ingredientes": [
   "200 g de papa en cubos",
   "120 g de pechuga de pollo",
   "1 cucharadita de aceite de oliva",
   "Romero y ajo",
   "Sal y pimienta"
  ],
  "pasos": [
   "Mezcla las papas y el pollo con el aceite y las hierbas",
   "Acomódalos en una charola",
   "Hornea a 200 °C durante 35 minutos, volteando a la mitad"
  ],
  "nutricion": {
   "calorias": "330 cal",
   "proteina": "29g",
   "carbos": "36g",
   "grasas": "8g"
  }
 },
 {
  "id": 49,
  "titulo": "Tostadas de Tinga de Pollo",
  "desc": "Tostadas de maíz horneadas con tinga de pollo, lechuga y cebolla.",
  "tags": [
   "Sin gluten",
   "Mexicana"
  ],
  "categorias": [
   "celiaca"
  ],
  "ingredientes": [
   "2 tostadas de maíz horneadas",
   "100 g de pollo deshebrado",
   "1/3 taza de salsa de jitomate con chipotle",
   "Lechuga y cebolla",
   "1 cucharada de yogur natural"
  ],
  "pasos": [
   "Cocina el pollo con la salsa 8 minutos",
   "Unta un poco de yogur en las tostadas",
   "Sirve la tinga encima",
   "Termina con lechuga y cebolla"
  ],
  "nutricion": {
   "calorias": "300 cal",
   "proteina": "24g",
   "carbos": "28g",
   "grasas": "9g"
  }
 },
 {
  "id": 50,
  "titulo": "Pescado Empapelado con Verduras",
  "desc": "Filete de pescado cocido en papel con calabacín, jitomate y limón.",
  "tags": [
   "Sin gluten",
   "Ligero"
  ],
  "categorias": [
   "celiaca"
  ],
  "ingredientes": [
   "150 g de filete de pescado blanco",
   "1/2 calabacín en rodajas",
   "1 jitomate en rodajas",
   "1 cucharadita de aceite de oliva",
   "Limón, ajo y perejil"
  ],
  "pasos": [
   "Coloca el pescado y las verduras sobre papel aluminio",
   "Agrega aceite, limón, ajo, sal y perejil",
   "Cierra el paquete",
   "Hornea a 190 °C durante 18 minutos"
  ],
  "nutricion": {
   "calorias": "220 cal",
   "proteina": "30g",
   "carbos": "8g",
   "grasas": "7g"
  }
 },
 {
  "id": 51,
  "titulo": "Polenta con Champiñones",
  "desc": "Polenta cremosa de maíz con champiñones salteados al ajo.",
  "tags": [
   "Sin gluten",
   "Vegetariana"
  ],
  "categorias": [
   "celiaca"
  ],
  "ingredientes": [
   "1/2 taza de polenta (harina de maíz)",
   "1 1/2 tazas de agua",
   "1 taza de champiñones",
   "1 diente de ajo",
   "15 g de queso parmesano"
  ],
  "pasos": [
   "Cuece la polenta en el agua, revolviendo, 10 minutos",
   "Saltea los champiñones con el ajo",
   "Sirve la polenta con los champiñones",
   "Espolvorea el parmesano"
  ],
  "nutricion": {
   "calorias": "250 cal",
   "proteina": "7g",
   "carbos": "36g",
   "grasas": "8g"
  }
 },
 {
  "id": 52,
  "titulo": "Pozole Verde de Pollo",
  "desc": "Pozole con maíz, pollo y salsa verde, con rábano y lechuga.",
  "tags": [
   "Sin gluten",
   "Mexicana"
  ],
  "categorias": [
   "celiaca"
  ],
  "ingredientes": [
   "1 taza de maíz pozolero cocido",
   "120 g de pollo deshebrado",
   "1/2 taza de salsa verde",
   "1 1/2 tazas de caldo de pollo sin gluten",
   "Rábano, lechuga y orégano"
  ],
  "pasos": [
   "Calienta el caldo con la salsa verde",
   "Agrega el maíz y el pollo",
   "Cocina 15 minutos",
   "Sirve con rábano, lechuga y orégano"
  ],
  "nutricion": {
   "calorias": "340 cal",
   "proteina": "30g",
   "carbos": "36g",
   "grasas": "7g"
  }
 },
 {
  "id": 53,
  "titulo": "Nopales con Huevo",
  "desc": "Nopales guisados con jitomate, cebolla y huevo.",
  "tags": [
   "Pocos carbohidratos",
   "Desayuno"
  ],
  "categorias": [
   "diabetica"
  ],
  "ingredientes": [
   "1 taza de nopales cocidos",
   "2 huevos",
   "1/4 de cebolla y 1 jitomate",
   "1 cucharadita de aceite",
   "Sal y cilantro"
  ],
  "pasos": [
   "Sofríe la cebolla y el jitomate en el aceite",
   "Agrega los nopales",
   "Añade los huevos batidos y revuelve hasta que cuajen",
   "Sirve con cilantro"
  ],
  "nutricion": {
   "calorias": "200 cal",
   "proteina": "14g",
   "carbos": "8g",
   "grasas": "11g"
  }
 },
 {
  "id": 54,
  "titulo": "Ensalada de Nopales con Panela",
  "desc": "Nopales frescos con queso panela, jitomate y limón.",
  "tags": [
   "Pocos carbohidratos",
   "Fresca"
  ],
  "categorias": [
   "diabetica"
  ],
  "ingredientes": [
   "1 taza de nopales cocidos",
   "40 g de queso panela",
   "1 jitomate y 1/4 de cebolla",
   "Cilantro y limón",
   "1 cucharadita de aceite de oliva"
  ],
  "pasos": [
   "Enfría los nopales",
   "Pica el jitomate y la cebolla",
   "Mezcla todo con el queso en cubos",
   "Aliña con limón, aceite y sal"
  ],
  "nutricion": {
   "calorias": "180 cal",
   "proteina": "12g",
   "carbos": "10g",
   "grasas": "10g"
  }
 },
 {
  "id": 55,
  "titulo": "Pescado a la Veracruzana Ligero",
  "desc": "Filete de pescado en salsa de jitomate con aceitunas.",
  "tags": [
   "Sin azúcar añadida",
   "Pescado"
  ],
  "categorias": [
   "diabetica"
  ],
  "ingredientes": [
   "150 g de filete de pescado",
   "2 jitomates",
   "6 aceitunas",
   "1 cucharadita de aceite de oliva",
   "Ajo, cebolla y laurel"
  ],
  "pasos": [
   "Sofríe el ajo y la cebolla en el aceite",
   "Agrega el jitomate y las aceitunas y cocina 8 minutos",
   "Coloca el pescado en la salsa",
   "Tapa y cocina 8 minutos"
  ],
  "nutricion": {
   "calorias": "220 cal",
   "proteina": "28g",
   "carbos": "9g",
   "grasas": "8g"
  }
 },
 {
  "id": 56,
  "titulo": "Pollo con Calabacitas",
  "desc": "Pechuga guisada con calabacitas, jitomate y cebolla.",
  "tags": [
   "Sin azúcar añadida",
   "Casero"
  ],
  "categorias": [
   "diabetica"
  ],
  "ingredientes": [
   "150 g de pechuga de pollo",
   "2 calabacitas en cubos",
   "1 jitomate",
   "1/4 de cebolla",
   "1 cucharadita de aceite"
  ],
  "pasos": [
   "Dora el pollo en el aceite y retíralo",
   "Sofríe la cebolla y el jitomate",
   "Agrega las calabacitas y el pollo",
   "Cocina tapado 10 minutos"
  ],
  "nutricion": {
   "calorias": "230 cal",
   "proteina": "30g",
   "carbos": "10g",
   "grasas": "8g"
  }
 },
 {
  "id": 57,
  "titulo": "Sopa de Pollo con Chayote",
  "desc": "Sopa ligera con pollo, chayote y calabacita en caldo bajo en sodio.",
  "tags": [
   "Ligera",
   "Caldo"
  ],
  "categorias": [
   "diabetica"
  ],
  "ingredientes": [
   "100 g de pollo deshebrado",
   "1 chayote",
   "1 calabacita",
   "2 tazas de caldo de pollo bajo en sodio",
   "Cilantro y limón"
  ],
  "pasos": [
   "Hierve el caldo con el chayote 10 minutos",
   "Agrega la calabacita y el pollo",
   "Cocina 8 minutos más",
   "Sirve con cilantro y limón"
  ],
  "nutricion": {
   "calorias": "190 cal",
   "proteina": "20g",
   "carbos": "14g",
   "grasas": "5g"
  }
 },
 {
  "id": 58,
  "titulo": "Chile Poblano Relleno de Panela",
  "desc": "Chiles asados rellenos de queso panela, horneados sin capear.",
  "tags": [
   "Pocos carbohidratos",
   "Mexicana"
  ],
  "categorias": [
   "diabetica"
  ],
  "ingredientes": [
   "2 chiles poblanos asados",
   "50 g de queso panela",
   "1/2 taza de salsa de jitomate",
   "1 cucharadita de aceite",
   "Cebolla y cilantro"
  ],
  "pasos": [
   "Pela los chiles y retira las semillas",
   "Rellénalos con el queso",
   "Hornea 10 minutos a 200 °C",
   "Sirve con la salsa caliente"
  ],
  "nutricion": {
   "calorias": "210 cal",
   "proteina": "14g",
   "carbos": "10g",
   "grasas": "12g"
  }
 },
 {
  "id": 59,
  "titulo": "Frijoles de la Olla con Pico de Gallo",
  "desc": "Frijoles caseros con pico de gallo fresco.",
  "tags": [
   "Alto en fibra",
   "Mexicana"
  ],
  "categorias": [
   "diabetica"
  ],
  "ingredientes": [
   "1/2 taza de frijoles de la olla",
   "1 jitomate",
   "1/4 de cebolla",
   "Cilantro y limón",
   "1 chile serrano (opcional)"
  ],
  "pasos": [
   "Calienta los frijoles con un poco de su caldo",
   "Pica el jitomate, la cebolla y el cilantro",
   "Mezcla con limón y sal para el pico de gallo",
   "Sirve los frijoles con el pico encima"
  ],
  "nutricion": {
   "calorias": "150 cal",
   "proteina": "8g",
   "carbos": "24g",
   "grasas": "3g"
  }
 },
 {
  "id": 60,
  "titulo": "Pavo Molido con Verduras al Wok",
  "desc": "Pavo salteado con verduras y un toque de soya.",
  "tags": [
   "Bajo en grasa",
   "Rápido"
  ],
  "categorias": [
   "baja-grasa"
  ],
  "ingredientes": [
   "120 g de pavo molido",
   "1 taza de verduras mixtas",
   "1 diente de ajo",
   "1 cucharada de salsa de soya baja en sodio",
   "1 cucharadita de aceite"
  ],
  "pasos": [
   "Sofríe el pavo con el ajo hasta que cambie de color",
   "Agrega las verduras y saltea 5 minutos",
   "Añade la salsa de soya",
   "Sirve caliente"
  ],
  "nutricion": {
   "calorias": "240 cal",
   "proteina": "28g",
   "carbos": "16g",
   "grasas": "6g"
  }
 },
 {
  "id": 61,
  "titulo": "Ceviche de Pescado con Pepino",
  "desc": "Pescado marinado en limón con pepino, cebolla morada y cilantro.",
  "tags": [
   "Bajo en grasa",
   "Fresco"
  ],
  "categorias": [
   "baja-grasa"
  ],
  "ingredientes": [
   "150 g de pescado blanco en cubos",
   "Jugo de 4 limones",
   "1/2 pepino",
   "1/4 de cebolla morada",
   "Cilantro y chile serrano"
  ],
  "pasos": [
   "Marina el pescado en el limón 15 minutos",
   "Pica el pepino, la cebolla y el cilantro",
   "Mezcla todo y sazona con sal",
   "Sirve frío"
  ],
  "nutricion": {
   "calorias": "170 cal",
   "proteina": "24g",
   "carbos": "8g",
   "grasas": "3g"
  }
 },
 {
  "id": 62,
  "titulo": "Sopa de Pollo con Verduras",
  "desc": "Sopa casera con pollo, zanahoria, papa y calabacita.",
  "tags": [
   "Bajo en grasa",
   "Caldo"
  ],
  "categorias": [
   "baja-grasa"
  ],
  "ingredientes": [
   "100 g de pollo deshebrado",
   "1 zanahoria y 1 papa pequeña",
   "1 calabacita",
   "2 tazas de caldo bajo en sodio",
   "Cilantro y limón"
  ],
  "pasos": [
   "Cuece la zanahoria y la papa en el caldo",
   "Agrega la calabacita y el pollo",
   "Cocina 10 minutos",
   "Sirve con cilantro y limón"
  ],
  "nutricion": {
   "calorias": "200 cal",
   "proteina": "22g",
   "carbos": "16g",
   "grasas": "4g"
  }
 },
 {
  "id": 63,
  "titulo": "Tacos de Pollo con Col",
  "desc": "Tacos de maíz con pollo a la plancha, col y pico de gallo.",
  "tags": [
   "Bajo en grasa",
   "Tacos"
  ],
  "categorias": [
   "baja-grasa"
  ],
  "ingredientes": [
   "3 tortillas de maíz",
   "100 g de pollo a la plancha",
   "1/2 taza de col rallada",
   "Pico de gallo",
   "Limón"
  ],
  "pasos": [
   "Cocina el pollo a la plancha y córtalo en tiras",
   "Calienta las tortillas",
   "Arma los tacos con el pollo y la col",
   "Termina con pico de gallo y limón"
  ],
  "nutricion": {
   "calorias": "290 cal",
   "proteina": "24g",
   "carbos": "36g",
   "grasas": "6g"
  }
 },
 {
  "id": 64,
  "titulo": "Pasta Integral con Pollo y Jitomate",
  "desc": "Pasta integral con pollo en salsa de jitomate casera y albahaca.",
  "tags": [
   "Bajo en grasa",
   "Pasta"
  ],
  "categorias": [
   "baja-grasa"
  ],
  "ingredientes": [
   "60 g de pasta integral (en seco)",
   "100 g de pechuga de pollo",
   "1 taza de salsa de jitomate casera",
   "Ajo y albahaca",
   "1 cucharadita de aceite de oliva"
  ],
  "pasos": [
   "Cuece la pasta al dente",
   "Dora el pollo en cubos con el ajo",
   "Agrega la salsa y cocina 5 minutos",
   "Mezcla con la pasta y sirve con albahaca"
  ],
  "nutricion": {
   "calorias": "360 cal",
   "proteina": "28g",
   "carbos": "50g",
   "grasas": "6g"
  }
 },
 {
  "id": 65,
  "titulo": "Camarones al Vapor con Brócoli",
  "desc": "Camarones y brócoli al vapor con limón y ajo.",
  "tags": [
   "Bajo en grasa",
   "Mariscos"
  ],
  "categorias": [
   "baja-grasa"
  ],
  "ingredientes": [
   "150 g de camarones limpios",
   "1 taza de brócoli",
   "Jugo de limón",
   "1 diente de ajo",
   "Sal y pimienta"
  ],
  "pasos": [
   "Prepara una vaporera",
   "Cuece el brócoli 4 minutos",
   "Agrega los camarones y cocina 4 minutos más",
   "Sirve con limón y ajo picado"
  ],
  "nutricion": {
   "calorias": "180 cal",
   "proteina": "26g",
   "carbos": "10g",
   "grasas": "3g"
  }
 },
 {
  "id": 66,
  "titulo": "Bowl de Pollo, Arroz y Frijoles",
  "desc": "Bowl completo con pollo, arroz integral, frijoles y aguacate.",
  "tags": [
   "Alta en proteína",
   "Bowl"
  ],
  "categorias": [
   "alta-proteina"
  ],
  "ingredientes": [
   "150 g de pechuga de pollo",
   "1/2 taza de arroz integral cocido",
   "1/2 taza de frijoles cocidos",
   "1/2 aguacate pequeño",
   "Pico de gallo"
  ],
  "pasos": [
   "Cocina el pollo a la plancha y córtalo en tiras",
   "Calienta el arroz y los frijoles",
   "Arma el bowl y agrega el aguacate",
   "Termina con pico de gallo"
  ],
  "nutricion": {
   "calorias": "450 cal",
   "proteina": "40g",
   "carbos": "45g",
   "grasas": "12g"
  }
 },
 {
  "id": 67,
  "titulo": "Hamburguesa de Pavo sin Pan",
  "desc": "Hamburguesa de pavo envuelta en lechuga con jitomate y mostaza.",
  "tags": [
   "Alta en proteína",
   "Sin pan"
  ],
  "categorias": [
   "alta-proteina"
  ],
  "ingredientes": [
   "150 g de pavo molido",
   "1 huevo",
   "Cebolla y ajo en polvo",
   "Hojas de lechuga grandes",
   "Jitomate y mostaza"
  ],
  "pasos": [
   "Mezcla el pavo con el huevo, la cebolla y el ajo",
   "Forma una hamburguesa y cocínala 5 minutos por lado",
   "Sírvela envuelta en lechuga",
   "Agrega jitomate y mostaza"
  ],
  "nutricion": {
   "calorias": "300 cal",
   "proteina": "34g",
   "carbos": "8g",
   "grasas": "14g"
  }
 },
 {
  "id": 68,
  "titulo": "Atún Sellado con Ajonjolí",
  "desc": "Filete de atún sellado con ajonjolí y verduras salteadas.",
  "tags": [
   "Alta en proteína",
   "Pescado"
  ],
  "categorias": [
   "alta-proteina"
  ],
  "ingredientes": [
   "150 g de filete de atún",
   "1 cucharada de ajonjolí",
   "1 cucharadita de aceite",
   "1 taza de verduras salteadas",
   "Limón"
  ],
  "pasos": [
   "Seca el atún y cúbrelo con ajonjolí",
   "Séllalo 1 minuto por lado en sartén caliente",
   "Corta en rebanadas",
   "Sirve con las verduras y limón"
  ],
  "nutricion": {
   "calorias": "310 cal",
   "proteina": "38g",
   "carbos": "8g",
   "grasas": "13g"
  }
 },
 {
  "id": 69,
  "titulo": "Revuelto de Claras con Requesón",
  "desc": "Claras revueltas con requesón y espinaca.",
  "tags": [
   "Alta en proteína",
   "Desayuno"
  ],
  "categorias": [
   "alta-proteina"
  ],
  "ingredientes": [
   "5 claras de huevo",
   "1/4 de taza de requesón",
   "1 taza de espinaca",
   "1 cucharadita de aceite",
   "Sal y pimienta"
  ],
  "pasos": [
   "Saltea la espinaca en el aceite",
   "Agrega las claras y revuelve",
   "Incorpora el requesón",
   "Cocina hasta que cuaje"
  ],
  "nutricion": {
   "calorias": "230 cal",
   "proteina": "30g",
   "carbos": "6g",
   "grasas": "9g"
  }
 },
 {
  "id": 70,
  "titulo": "Quesadillas de Champiñones y Espinaca",
  "desc": "Tortillas integrales con queso, champiñones y espinaca doradas en comal.",
  "tags": [
   "Vegetariana",
   "Quesadilla"
  ],
  "categorias": [
   "vegetariana"
  ],
  "ingredientes": [
   "2 tortillas de harina integral",
   "1 taza de champiñones",
   "1 taza de espinaca",
   "40 g de queso Oaxaca",
   "1 cucharadita de aceite"
  ],
  "pasos": [
   "Saltea los champiñones y la espinaca",
   "Rellena las tortillas con el queso y las verduras",
   "Dóralas en un comal 2 minutos por lado"
  ],
  "nutricion": {
   "calorias": "330 cal",
   "proteina": "15g",
   "carbos": "34g",
   "grasas": "15g"
  }
 },
 {
  "id": 71,
  "titulo": "Lasaña de Berenjena",
  "desc": "Capas de berenjena asada con salsa de jitomate y quesos.",
  "tags": [
   "Vegetariana",
   "Al horno"
  ],
  "categorias": [
   "vegetariana"
  ],
  "ingredientes": [
   "1 berenjena en láminas",
   "1/2 taza de salsa de jitomate",
   "60 g de queso mozzarella",
   "1/4 taza de requesón",
   "Albahaca"
  ],
  "pasos": [
   "Asa las láminas de berenjena",
   "Alterna capas de berenjena, salsa y quesos en un refractario",
   "Hornea a 190 °C durante 25 minutos",
   "Decora con albahaca"
  ],
  "nutricion": {
   "calorias": "280 cal",
   "proteina": "14g",
   "carbos": "18g",
   "grasas": "16g"
  }
 },
 {
  "id": 72,
  "titulo": "Pancakes de Avena y Plátano",
  "desc": "Pancakes de avena con plátano y huevo, sin harina refinada.",
  "tags": [
   "Vegetariana",
   "Desayuno"
  ],
  "categorias": [
   "vegetariana"
  ],
  "ingredientes": [
   "1/2 taza de avena molida",
   "1 plátano maduro",
   "1 huevo",
   "1/4 de cucharadita de polvo para hornear",
   "Canela y fruta fresca"
  ],
  "pasos": [
   "Aplasta el plátano y mézclalo con el huevo",
   "Agrega la avena, el polvo para hornear y la canela",
   "Cocina porciones en un sartén antiadherente 2 minutos por lado",
   "Sirve con fruta"
  ],
  "nutricion": {
   "calorias": "300 cal",
   "proteina": "12g",
   "carbos": "42g",
   "grasas": "9g"
  }
 },
 {
  "id": 73,
  "titulo": "Pescado al Horno con Jitomate y Aceitunas",
  "desc": "Pescado blanco horneado con jitomate, aceitunas y orégano.",
  "tags": [
   "Mediterránea",
   "Pescado"
  ],
  "categorias": [
   "mediterranea"
  ],
  "ingredientes": [
   "150 g de filete de pescado blanco",
   "2 jitomates en rodajas",
   "6 aceitunas",
   "1 cucharada de aceite de oliva",
   "Orégano y ajo"
  ],
  "pasos": [
   "Acomoda el jitomate en un refractario con el ajo",
   "Coloca el pescado encima con las aceitunas",
   "Rocía con aceite y orégano",
   "Hornea a 190 °C durante 18 minutos"
  ],
  "nutricion": {
   "calorias": "280 cal",
   "proteina": "30g",
   "carbos": "8g",
   "grasas": "14g"
  }
 },
 {
  "id": 74,
  "titulo": "Tabulé de Quinoa",
  "desc": "Ensalada fresca de quinoa, perejil, jitomate y pepino con limón.",
  "tags": [
   "Mediterránea",
   "Vegano"
  ],
  "categorias": [
   "mediterranea"
  ],
  "ingredientes": [
   "1/2 taza de quinoa cocida",
   "1 jitomate y 1/2 pepino",
   "1 taza de perejil picado",
   "Jugo de limón",
   "1 cucharada de aceite de oliva"
  ],
  "pasos": [
   "Cuece la quinoa y deja que se enfríe",
   "Pica las verduras y el perejil",
   "Mezcla todo con el limón y el aceite",
   "Refrigera 15 minutos y sirve"
  ],
  "nutricion": {
   "calorias": "260 cal",
   "proteina": "8g",
   "carbos": "34g",
   "grasas": "10g"
  }
 },
 {
  "id": 75,
  "titulo": "Shakshuka",
  "desc": "Huevos cocidos en salsa de jitomate con pimiento y comino.",
  "tags": [
   "Mediterránea",
   "Huevo"
  ],
  "categorias": [
   "mediterranea"
  ],
  "ingredientes": [
   "2 huevos",
   "1 taza de salsa de jitomate",
   "1/2 pimiento",
   "1/4 de cebolla",
   "Comino y perejil"
  ],
  "pasos": [
   "Sofríe la cebolla y el pimiento",
   "Agrega la salsa y el comino y cocina 8 minutos",
   "Haz dos huecos y rompe los huevos",
   "Tapa 5 minutos hasta que cuajen"
  ],
  "nutricion": {
   "calorias": "270 cal",
   "proteina": "16g",
   "carbos": "14g",
   "grasas": "16g"
  }
 },
 {
  "id": 76,
  "titulo": "Brochetas de Pollo con Tzatziki",
  "desc": "Brochetas de pollo y verduras con salsa de yogur, pepino y ajo.",
  "tags": [
   "Mediterránea",
   "A la parrilla"
  ],
  "categorias": [
   "mediterranea"
  ],
  "ingredientes": [
   "150 g de pechuga de pollo en cubos",
   "1/3 de taza de yogur griego natural",
   "1/2 pepino rallado",
   "Ajo, limón y orégano",
   "Pimiento y cebolla para las brochetas"
  ],
  "pasos": [
   "Marina el pollo con limón, ajo y orégano",
   "Arma las brochetas con las verduras y ásalas 12 minutos",
   "Mezcla el yogur con el pepino, ajo y sal",
   "Sirve con el tzatziki"
  ],
  "nutricion": {
   "calorias": "300 cal",
   "proteina": "34g",
   "carbos": "8g",
   "grasas": "14g"
  }
 },
 {
  "id": 77,
  "titulo": "Rollitos de Lechuga con Pollo",
  "desc": "Hojas de lechuga rellenas de pollo, yogur y aguacate.",
  "tags": [
   "Keto",
   "Ligero"
  ],
  "categorias": [
   "keto"
  ],
  "ingredientes": [
   "4 hojas de lechuga romana",
   "120 g de pollo desmenuzado",
   "1/4 de aguacate",
   "2 cucharadas de yogur griego",
   "Limón y cilantro"
  ],
  "pasos": [
   "Mezcla el pollo con el yogur, limón y sal",
   "Coloca la mezcla sobre las hojas",
   "Agrega el aguacate y el cilantro",
   "Enrolla y sirve"
  ],
  "nutricion": {
   "calorias": "240 cal",
   "proteina": "28g",
   "carbos": "4g",
   "grasas": "12g"
  }
 },
 {
  "id": 78,
  "titulo": "Bistec de Res con Mantequilla de Hierbas",
  "desc": "Bistec jugoso con mantequilla de ajo y perejil, y brócoli al vapor.",
  "tags": [
   "Keto",
   "Alta en proteína"
  ],
  "categorias": [
   "keto"
  ],
  "ingredientes": [
   "150 g de bistec de res",
   "1 cucharadita de mantequilla con perejil y ajo",
   "1 taza de brócoli al vapor",
   "Sal y pimienta"
  ],
  "pasos": [
   "Sazona el bistec",
   "Cocínalo en sartén muy caliente 3 minutos por lado",
   "Colócale la mantequilla encima mientras reposa",
   "Sirve con el brócoli"
  ],
  "nutricion": {
   "calorias": "420 cal",
   "proteina": "38g",
   "carbos": "8g",
   "grasas": "26g"
  }
 },
 {
  "id": 79,
  "titulo": "Frittata de Espinaca y Feta",
  "desc": "Frittata esponjosa de huevo con espinaca y queso feta.",
  "tags": [
   "Keto",
   "Vegetariana"
  ],
  "categorias": [
   "keto"
  ],
  "ingredientes": [
   "3 huevos",
   "1 taza de espinaca",
   "30 g de queso feta",
   "1 cucharadita de aceite de oliva",
   "Sal y pimienta"
  ],
  "pasos": [
   "Saltea la espinaca en el aceite",
   "Bate los huevos y viértelos en la sartén",
   "Agrega el feta",
   "Cocina tapado a fuego bajo 8 minutos"
  ],
  "nutricion": {
   "calorias": "310 cal",
   "proteina": "22g",
   "carbos": "5g",
   "grasas": "23g"
  }
 }
];
