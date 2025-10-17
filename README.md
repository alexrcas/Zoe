He estado explorando distintas opciones para desarrollar mi próxima app.

Mi primera intención fue usar Ionic, pero me encontré con bastantes problemas de configuración y el clásico dependency hell de npm.

React Native es la solución que tengo en mente a largo plazo, pero estoy siguiendo un curso bastante extenso y, aunque no parece difícil, tiene su curva de aprendizaje. En este momento quiero hacer un prototipo rápido —algo funcional en una tarde—, no esperar a terminar el curso.

Entonces recordé la app web que hice sobre música (MyGoldenRecord). Podría repetir el enfoque: una web que visualmente parezca una app móvil. Me atrae por su rapidez de desarrollo y facilidad de depuración, pero esta vez quiero que sea una app de verdad. Así que busqué una alternativa intermedia.

Ahí apareció el concepto de PWA (Progressive Web Application). Es básicamente una app web tradicional —como MyGoldenRecord—, pero con una configuración adicional que permite al navegador tratarla como una aplicación nativa. El usuario puede “instalarla”, y aunque no es una instalación al uso, el resultado es muy parecido: se ve como una app y puede incluso funcionar sin conexión. Me parece el equilibrio perfecto, así que decidí optar por esta tecnología.

El desarrollo sería muy sencillo: una página estática (un index.html con su CSS y JS), sin servidor ni complicaciones. La app sería completamente local, usando la cámara para escanear códigos de barras, consultar una API externa y guardar la información de forma local. El único servidor necesario sería el que sirviera el index.html inicial —hasta GitHub Pages serviría, al ser un recurso estático—.

Aun así, aunque técnicamente bastaría con un solo fichero HTML, preveo que la app crecerá un poco. Estoy acostumbrado a trabajar con tecnologías de servidor y echo en falta poder separar componentes y vistas, y contar con un layout decente.

Podría usar React o Vue, pero quiero algo aún más simple, sin tener que repasar frameworks que tengo algo oxidados. Quiero empezar ya. Buscando algo ligero encontré varias opciones:

- HTMX (que me recomendó J. Rumeu hace tiempo y sigue siendo muy interesante)
- Alpine.js
- Web Components puros, incluidos directamente en el estándar

Al estudiar esta última opción descubrí Lit, una pequeña librería de Google sin dependencias externas, minimalista y muy sencilla. Hace justo lo que necesito: añade un poco de azúcar sintáctico a los Web Components. Con unas pocas líneas puedo tener mi index.html dividido en varios ficheros y componentes, con el típico data binding reactivo entre la vista y el código, al estilo de Angular, Vue o React.

De cara a la app, mis mayores incertidumbres usando esta tecnología eran:

1. Almacenamiento local: localstorage funciona bien con pequeños fragmentos de información clave-valor, pero pretendo guardar un diario de comidas que se irá acumulando con las semanas y meses. Por suerte, existe IndexedDb, que es un almacenamiento local bastante más potente (incluso tiene transacciones) y si ofrece una capacidad y rendimiento considerables.

2. Escaneo del código de barras. Aunque cada vez es más sólido, el manejo de la cámara desde la API WEB puede ser problemático o pecar de ser algo pobre en configuración y rendimiento. Las primeras pruebas de escaneo salieron bastante mal, pero la API WEB permite configurar parámetros como la resolución (que por defecto es muy baja) y el zoom, que facilita el encuadre. Junto con un pequeño mecanismo de doble verificación (comprobar que se lee el mismo código 3 o 4 veces seguidas) se mejora muchísimo la funcionalidad y se consigue un escaneo rápido y con una tasa de acierto del 100%.


La aplicación parece estar yendo por buen camino. Aún así me chirría que los usuarios no sepan o no quieran usar la versión web y de alguna manera quiero forzar su uso como aplicación. Para ello contemplo dos alternativas:

1. ¿Es posible de alguna manera forzar la instalación de la web como PWA o al menos poner un botón que sirva de acceso directo para instalarla? Temo que muchos usuarios no sepan encontrar la opción de "instalar aplicación" (hasta a mí me costó encontrarla la primera vez). La respuesta es no: no se puede forzar o disparar directamente esta acción y es el usuario quien debe manualmente ejecutarla. En los sistemas Android (y solo en estos) sí existe una configuración que hace que cuando el usuario entre a la web le aparezca un modal ofreciéndole instalar la versión app. En este sentido, lo que sí se puede hacer y he probado con éxito es detectar si se está usando la versión web o la versión app y comportarse en consecuencia. Por ejemplo, al detectar que se está usando la versión web podría aparecer una landing page sin posibilidad de ir a otro sitio, con instrucciones sobre cómo instalar la versión app, que sí .
