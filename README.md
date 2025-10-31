# Zoe

Zoe es un clon de la conocida MyFitnessPal. La idea es llevar la cuenta de las calorías y macronutrientes que se han ingerido al día para poder hacer un seguimiento de la dieta.

El flujo de la app es muy sencillo. Para cada día, se introducen alimentos bien mediante búsqueda o bien escaneando su código de barras y estos van quedando registrados en el diario de comidas, que muestra el cómputo de calorías y macronutrientes.

La app tiene potencial para evolucionar en funcionalidades y complejidad —recetas, funciones sociales, integración en la nube…—, pero el objetivo principal es centrarse en un producto mínimo viable: algo realista, funcional y utilizable en un plazo corto. Al ser usuario habitual de este tipo de aplicaciones, puedo evaluar de manera directa y realista cómo se comporta en el día a día.

Como en muchos de mis side-projects, que más que metas concretas son una excusa para experimentar y aprender, lo esencial no es la meta sino el camino. Durante el desarrollo no habrá una ruta estricta; iré haciendo y deshaciendo, añadiendo y quitando tecnologías o librerías y experimentando y recopilando sensaciones y aprendizajes.

### Demo

https://www.youtube.com/watch?v=behVYGXU0BQ

## Apuntes

Es posible crear una app nativa Android/iOs que únicamente sea un webview y poner ahí mi página estática. A fin de cuentas es lo que se hace en Ionic. Eso me permitiría la facilidad y velocidad de trabajar con una web pero tener una app real. En realidad, esto es justo lo que hacen Cordova/Capacitor. Compruebo con mucha facilidad que basta con incorporar Capacitor a mi proyecto con `npm install @capacitor/core @capacitor/cli` y ejecutar `npx cap add ios` para generar las aplicaciones nativas con el webview envolviendo mi web.

![](/docs/ios-sim.png)

Un detalle importante es que, al ejecutarse la app en un WebView nativo, ya no se accede a la cámara mediante la API web, sino mediante el plugin de cámara de Capacitor, cuya instalación es trivial vía npm. Sin Ionic de por medio, Capacitor no parece ser conflictivo ni presenta mayor problema que el de instalar y usar sus plugins.

Entonces, ¿qué aporta Ionic? Ionic aporta multitud de componentes visuales que imitan a los componentes nativos en cuanto a apariencia y comportamiento. Ahorra tiempo y esfuerzo en conseguir una interfaz gráfica bien diseñada y consistente entre dispositivos. Si bien esa sería la idea original, añade una capa de complejidad de dependencias, compatibilidad y ruido muy grande. Hay multitud de librerías CSS basadas en Tailwind o Bootstrap que ofrecen componentes con una apariencia muy agradable y bien terminada, como puede ser el caso de **FlyonUI** o **Beer CSS**
