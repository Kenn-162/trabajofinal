# Pabellón modular SENATI · Visor 3D Futurista — Campus Sede Independencia

Visor 3D interactivo (three.js r128, **100 % autocontenido en `vendor/`**) del **pabellón de aulas prefabricadas** (dos pisos, 16 aulas por piso, 4 laboratorios de cómputo, **corredor central amplio de 4.2 m**) **dentro del campus real de la Sede Independencia de SENATI** (Av. Alfredo Mendiola 3520/3540, Panamericana Norte Km 15.2, Lima): pirámide histórica con letrero, Auditorio, Comedor, Parque con obelisco, **Jardín de la Escuela de Mecánica de Mantenimiento** (césped continuo, sendero de tierra en curva con espiral, dátiles, palmeras reales de tronco blanco, magnolia, busto sobre pedestal blanco y brocha gorda, como en las fotos reales), Cancha de fútbol, Loza deportiva, Playa de estacionamiento con pérgolas fotovoltaicas, Escuela de Mecánica de Mantenimiento (fachada con letrero, banner SENATI MANTENIMIENTO y vallas publicitarias apoyadas en el parapeto), **Centro de Formación N°2** (bloque hermano del Mecánica con franja de ventanas luminosa, doble marquesina azul, letras SENATI y sendero de tierra conectado al jardín), Escuela de Artes Gráficas y las Torres A/B/C. Motor visual cinematográfico: ACES tone mapping, PBR con reflejos PMREM, bloom sutil, cielo procedural día/noche, bruma andina y **Modo Fotografía profesional** (nitidez editorial, profundidad de campo tipo cámara, grano de película y captura en **PNG 4K**). Recorrer el campus en 1ª persona **sin atravesar muros** (colisión contra edificios).

![Antes](docs/antes-dia.png) ![Después](docs/despues-dia.png)

## Cómo abrirlo
Doble clic en `index.html` — no necesita internet (three.js y los controles vienen en `vendor/`). Si prefieres un servidor local: `python3 -m http.server 8080`.

## El campus (según el plano oficial de la sede)
Disposición basada en el mapa oficial del campus y en las fotos reales (referencia: fotos del sitio + información pública de SENATI):

- **Panamericana Norte** y **portal de INGRESO SENATI** (columnas azules, caseta de guardianía, pluma y dos banderas — SENATI y Perú — ondeando).
- **Playa de estacionamiento** con **pérgolas fotovoltaicas** (4 módulos), autos, líneas de estacionamiento, guarda-medallón "S" de seguridad vial y postes rojos de doble brazo.
- **AUDITORIO**: muro de ladrillo oxblood con pórtico azul, 4 columnas blancas, gran **banner "SEMANA DE INNOVACIONES TECNOLÓGICAS MECATRÓNICA AUTOMOTRIZ"**, zigzag de trusas en el borde de azotea y la cruz del muro posterior (como en la foto real).
- **COMEDOR**: bloque azul con letras COMEDOR, vidrio con sillas blancas y tubos amarillos de protección, baranda de azotea, tanques y A/C.
- **PARQUE** (réplica según las fotos): **senderos de tierra en “S” con bifurcación en Y** alrededor del **obelisco blanco con busto de bronce** (cama de tierra y anillo de arbustos), magnolia gigante, **dátiles silvestres** de copa erizada, **palmeras reales de base pintada de blanco**, arbustos verde-amarillento grandes, setos oscuros y bancas.
- **CANCHA DE FÚTBOL** (oeste, entre pirámide y aulas) con jugadores azul vs blanco y referí, y **LOZA DEPORTIVA** (volley) de cemento gris.
- **PIRÁMIDE** (oeste): basamento largo color tierra, **torre troncopiramidal** de 8 pisos con ranuras horizontales de ventanas y **aletas verticales** de concreto, **núcleo central** que sobresale con capitel, **caja de concreto blanco** colgada de la fachada, **receso azul profundo**, panel-truss gigante en la azotea (**aleta reticulada**), gran letrero azul **SENATI** apoyado sobre la azotea mirando al campus y **balizas rojas de aviación** parpadeantes — composición según las fotos reales de la sede.
- **ESCUELA DE MECÁNICA DE MANTENIMIENTO** (este): edificio blanco largo con fachada SENATI completa (texto + hexágono + ventanas en ambas caras largas), letras "ESCUELA DE MECÁNICA DE MANTENIMIENTO", banner vertical luminoso SENATI MANTENIMIENTO, parapeto, tanques y A/C, cerco vivo.
- **ESCUELA DE ARTES GRÁFICAS** (sur): bloque de 4 pisos con mural azul **GRÁFICAS** monumental (como el "ESTUDIANDO DISEÑO GRÁFICO" de las fotos) y parapeto azul.
- **TORRE A / TORRE B / TORRE C** (sur, beyond la vía): torres de vidrio negro con **estructura diagrid** (referencia: edificio Torre 1 de la sede, imagen-8) y hexágono SENATI azul.
- **Skyline** tras la Panamericana (losas grises y 2 torres residenciales tipo Comas) y **cordillera andina** con Torres de alta tensión en la cresta.
- El pabellón (tu proyecto) ocupa el lugar de las **Aulas Prefabricadas · Estudios Generales ETI** del plano, con el anexo azul "ESTUDIOS GENERALES" al oeste y la zona pintada "ZONA DE SEGURIDAD" al sur.

## Qué cambió respecto a la versión plana
| Motor visual | Antes | Ahora |
|---|---|---|
| Render | Lineal + sRGB directo | **ACES Filmic + GammaCorrection pass** |
| Iluminación | 1 sol + hemisférica | Sol cálido 2048px, hemisférica calibrada, **contraluz frío**, entorno **PMREM (reflejos reales)** |
| Bloom / post | — | **UnrealBloomPass** sutil (día 0.30 / noche 0.50) |
| Materiales | Colores planos | **PBR procedural**: yeso, zinc con costaneras, porcelanato, concreto con juntas |
| Entorno | Fog gris + cielo plano | **Campus Sede Independencia completo** (plano oficial) + cordillera andina + skyline y bruma |
| Noche | Bombillos amarillos | Estrellas, luna con halo, lámparas con resplandor, **torres diagrid iluminadas**, monitores cian, balizas parpadeantes |
| Ambiente extra | — | **Atardecer**: cielo dorado procedural, sol bajo aditivo, bruma cálida, ventanas semiemisivas |
| Vida | Diorama quieto | **Banderas SENATI y Perú ondeantes**, jugadores, estudiantes bajo el pórtico, autos, conos, césped con **franjas de corte** |
| UI | Plana | **HUD futurista**: oro SENATI + cian sobre navy, vidrio esmerilado, **insignia RENDER EN VIVO** |
| Profundidad | Sin DoF | **Bokeh DoF** estilo f/2.8 (foco dinámico: sigue la distancia de cámara al objetivo; más marcado al caminar) — se desactiva solo en GPU por software |
| Color de foto | — | **Pase de grado editorial**: curva S, saturación 1.14, split-toning (sombras teal / altas luces doradas), **grano de película animado** y **viñeta** |
| Resolución | 1x píxel | **Supermuestreo** (pixel ratio 1.75–2x) + **Capturar imagen (PNG · 4K)**: render apagado a **3840×2160** en GPU real (1920×1080 en GPU por software) |

## Calidad gráfica (Alta · Media · Baja)
Selector en el panel izquierdo (**Calidad gráfica**) con medidor de FPS en vivo. La elección se guarda en el navegador; también puedes abrir `index.html?calidad=alta|media|baja`. Si no hay elección guardada: GPU por software → Baja, pantalla táctil → Media, resto → Alta.

| | Alta | Media | Baja |
|---|---|---|---|
| Resolución interna | ×1.75–2 (supermuestreo) | ×1.25 | ×0.8 |
| Sombras del sol | 2048 px, cada cuadro | 1024 px, cada cuadro | 1024 px, se refrescan 4 veces/seg |
| Profundidad de campo (bokeh) | Sí | — | — |
| Bloom | Sí | Sí | — |
| Grano de película | 0.055 | 0.035 | — |
| Captura PNG | 4K (3840×2160) | Full HD (1920×1080) | HD (1280×720) |

En GPU por software, **Alta** se limita sola (sin DoF, ×1 y captura Full HD) para no bloquear el navegador. El código está en `js/08-calidad.js`.

## Controles
- **Vista general / Planta / Recorrer**: órbita, cenital o primera persona (WASD / flechas / Shift para correr; táctil: arrastra y pad en pantalla). **Recorrer incluye colisión contra todos los edificios** (pirámide, auditorio, comedor, artes gráficas, mecánica, anexo y Torres A/B/C): no se atraviesan muros.
- **Encuadre**: **Aérea** (dron sobre el campus), **Calle** (a pie, eje del INGRESO SENATI) y **Foto** (postal fachada + pirámide).
- **Ambiente**: **Día** / **Atardecer** / **Noche**.
- **Pisos**: mostrar/ocultar Piso 1, Piso 2 y Techo; **Separar pisos** para exploded view.
- **Colocar personas**: Alumno / Profesor / Persona / Limpieza; **Poblar aulas** llena todo; **E** elimina de a una; **Supr/Retroceso/Ctrl+Z** quita la última.
- **Ficha del proyecto** (panel derecho): datos técnicos, ocupación en vivo, atajos y **Capturar imagen (PNG · 4K)**.
- **Modo Fotografía profesional**: se aplica a los tres ambientes (Día / Atardecer / Noche). En GPU real: profundidad de campo + grano + supermuestreo + captura 4K. En GPU por software (SwiftShader/llvmpipe): el modo DoF se omite automáticamente y la captura rinde a 1920×1080 para mantener la fluidez — sin errores, sin bloqueos.

## Estructura
- `index.html`: panel HUD y carga de scripts.
- `css/styles.css`: piel HUD futurista. `css/pro.css`: ficha, modo eliminar y avisos.
- `js/01-escena.js` … `js/07-navegacion.js`: render (ACES/bloom/PMREM/**Bokeh DoF/pase de grado**/supermuestreo/**captura 4K**), materiales, edificio, **entorno = campus completo**, personas, colocación y navegación — en este orden.
- `js/04b-cerco-verde.js`: área verde y más autos en la playa de pérgolas + **cerco metálico azul perimetral** (paños de malla, portón de ingreso 3540, enredadera con flores lilas).
- `js/08-calidad.js`: selector de calidad Alta/Media/Baja (resolución, sombras, DoF, bloom, grano y captura).
- `js/features.js`: eliminar de a una, ficha del proyecto, ocupación y captura.
- `vendor/`: three.js r128 + OrbitControls + EffectComposer/UnrealBloomPass/GammaCorrectionShader/**BokehShader/BokehPass** (licenciados MIT por three.js).
- `docs/`: capturas antes/después **con grado fotográfico** verificadas en Chromium headless (día / atardecer / noche) + encuadres.

## Skill asociada
La metodología completa para repetir este upgrade en cualquier escena three.js está empaquetada como skill reutilizable en `/home/user/skills/disenador-3d-futurista/` (SKILL.md + referencias + scripts + assets). Cópiala a `~/.claude/skills/` (o al `.claude/skills/` de tu proyecto) y úsala cuando quieras "más calidad de imagen" o un "look futurista" sin partir de cero.


## Últimos cambios
- **Playa de pérgolas (oeste):** franja verde con árboles, isletas con césped entre filas y más autos.
- **Estacionamiento grande (norte):** ahora solo **motos lineales** (instanciadas, 1–2 por bahía).
- **Cerco metálico azul** en todo el perímetro del campus, con portón de ingreso abierto y cartel SENATI ① 3540.
