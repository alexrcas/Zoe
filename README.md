He estado explorando distintas opciones para desarrollar mi próxima app.

Mi primera intención fue usar Ionic, pero me encontré con bastantes problemas de configuración y el clásico dependency hell de npm.

React Native es la solución que tengo en mente a largo plazo, pero estoy siguiendo un curso bastante extenso y, aunque no parece difícil, tiene su curva de aprendizaje. En este momento quiero hacer un prototipo rápido —algo funcional en una tarde—, no esperar a terminar el curso.

Entonces recordé la app web que hice sobre música (MyGoldenRecord). Podría repetir el enfoque: una web que visualmente parezca una app móvil. Me atrae por su rapidez de desarrollo y facilidad de depuración, pero esta vez quiero que sea una app de verdad. Así que busqué una alternativa intermedia.

Ahí apareció el concepto de PWA (Progressive Web Application). Es básicamente una app web tradicional —como MyGoldenRecord—, pero con una configuración adicional que permite al navegador instalarla y que a efectos de apariencia se vea como una aplicación nativa. El usuario puede “instalarla”, y aunque no es una instalación al uso, el resultado es muy parecido: se ve como una app y puede incluso funcionar sin conexión. Me parece el equilibrio perfecto, así que decidí optar por esta tecnología.

El desarrollo sería muy sencillo: una página estática (un index.html con su CSS y JS), sin servidor ni complicaciones. La app sería completamente local, usando la cámara para escanear códigos de barras, consultar una API externa y guardar la información de forma local. El único servidor necesario sería el que sirviera el index.html inicial —hasta GitHub Pages serviría, al ser un recurso estático—.

Aun así, aunque técnicamente bastaría con un solo fichero HTML, preveo que la app crecerá un poco. Estoy acostumbrado a trabajar con tecnologías de servidor y echo en falta poder separar componentes y vistas, y contar con un layout decente.

Podría usar React o Vue, pero quiero algo aún más simple, sin tener que repasar frameworks que tengo algo oxidados. Quiero empezar ya. Buscando algo ligero encontré varias opciones:

- HTMX (que me recomendó J. Rumeu hace tiempo y se ve interesante)
- Alpine.js
- Web Components puros, incluidos directamente en el estándar

Al estudiar esta última opción descubrí Lit, una pequeña librería de Google sin dependencias externas, minimalista y muy sencilla. Hace justo lo que necesito: añade un poco de azúcar sintáctico a los Web Components. Con unas pocas líneas puedo tener mi index.html dividido en varios ficheros y componentes, con el típico data binding reactivo entre la vista y el código, al estilo de Angular, Vue o React.

De cara a la app, mis mayores incertidumbres usando esta tecnología eran:

1. El localStorage funciona bien para pequeños fragmentos de información clave-valor, pero mi intención es almacenar un diario de comidas que se irá acumulando a lo largo de semanas y meses. Por fortuna, existe IndexedDB, un sistema de almacenamiento local mucho más potente que soporta transacciones y ofrece capacidad y rendimiento considerables, lo que lo hace adecuado para el caso de uso.

2. Aunque la API web para la cámara es cada vez más robusta, puede resultar limitada en cuanto a configuración y rendimiento. Las primeras pruebas de escaneo no fueron satisfactorias. Sin embargo, ajustando parámetros como la resolución (que por defecto es baja) y el zoom, junto con un mecanismo de verificación doble (comprobar que el mismo código se lee varias veces seguidas), se consigue un escaneo rápido con una tasa de acierto casi infalible.


Me preocupa que los usuarios no sepan o no quieran usar la versión app frente a entrar simplemente a la web y de alguna manera quiero forzar su uso como aplicación. Para ello contemplo dos alternativas:

1. ¿Es posible de alguna manera forzar la instalación de la web como PWA o al menos poner un botón que sirva de acceso directo para instalarla? No es posible forzar la instalación de una PWA; es el usuario quien debe ejecutarla manualmente. En Android, sí existe un mecanismo especial que muestra un modal ofreciendo instalar la app cuando el usuario accede a la web.
Como alternativa, lo que sí es posible es detectar si se está usando la versión web o la PWA y mostrar en el primer caso una landing page con instrucciones claras sobre cómo instalar la app, bloqueando temporalmente el acceso a otras secciones para incentivar su instalación.

2. ¿Es posible crear una app nativa Android/iOs que únicamente sea un webview y poner ahí mi página estática? A fin de cuentas es lo que se hace en Ionic. Eso me permitiría la facilidad y velocidad de trabajar con una web pero tener una app real. En realidad, esto es justo lo que hacen Cordova/Capacitor. Compruebo con mucha facilidad que basta con incorporar Capacitor a mi proyecto con `npm install @capacitor/core @capacitor/cli` y ejecutar `npx cap add ios` para generar las aplicaciones nativas con el webview envolviendo mi web.

![](/docs/ios-sim.png)

Un detalle importante es que, al ejecutarse la app en un WebView nativo, ya no se accede a la cámara mediante la API web, sino mediante el plugin de cámara de Capacitor, cuya instalación es trivial vía npm. Sin Ionic de por medio, Capacitor no parece ser conflictivo ni presenta mayor problema que el de instalar y usar sus plugins.

Entonces, ¿qué aporta Ionic? Ionic aporta multitud de componentes visuales que imitan a los componentes nativos en cuanto a apariencia y comportamiento. Ahorra tiempo y esfuerzo en conseguir una interfaz gráfica bien diseñada y consistente entre dispositivos. Si bien esa sería la idea original, añade una capa de complejidad de dependencias, compatibilidad y ruido muy grande. Hay multitud de librerías CSS basadas en Tailwind o Bootstrap que ofrecen componentes con una apariencia muy agradable y bien terminada, como puede ser el caso de **FlyonUI** o **Beer CSS**

### Próximas pruebas / tareas

1. Continuar el desarrollo de la PWA y los casos de uso y funcionalidades previstos. Dado que soy usuario real de este tipo de aplicaciones y pretendo usarla en la vida real podré ver la viabilidad de esta tecnología. No soy muy optimista pero por ahora, al menos para prototipos, sí está claro que hay pocas cosas más fáciles y veloces, sobre todo si se tiene preparado una especie de proyecto en blanco con un layout básico de tabs o menú.

2. Probar **Beer CSS**. Me ha llamado la atención y me permitiría salirme de la ya muy machacada apariencia de Bootstrap. Puede que descubramos algo interesante.

3. Con la app terminada y probándola como PWA un tiempo, probar a empaquetarla en una app real con Capacitor y ver qué tal se comporta.

Otras ideas, problemáticas o experimentos que surjan por el camino irán siendo anotados en este documento.