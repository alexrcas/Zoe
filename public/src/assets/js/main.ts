import '../../pages/home-page';
import '../../pages/recents-page';
import '../../pages/profile-page';
import '../../pages/wizard-page';


navigator.serviceWorker.register('/sw.js', { scope: '/' })
  .then(() => console.log('Service Worker registrado correctamente'))
  .catch(err => console.error('Error registrando SW:', err));



const app = document.getElementById('app') as HTMLElement;

function renderPage() {
  const [routeName] = window.location.hash.replace('#', '').split('?');
  const route = routeName || 'home';
  app.innerHTML = `<${route}-page></${route}-page>`;
  updateNav(route);
}

function updateNav(activeRoute: string) {
  const links = document.querySelectorAll('nav a');
  links.forEach(link => {
    const isActive = link.getAttribute('href') === `#${activeRoute}`;
    link.classList.toggle('text-primary', isActive);
    link.classList.toggle('text-dark', !isActive);
  });
}

window.addEventListener('load', renderPage);
window.addEventListener('hashchange', renderPage);


const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  || (window.navigator as any).standalone  // iOS
  || document.referrer.startsWith('android-app://'); // Android WebAPK



/*
if (!isStandalone) {
  document.body.innerHTML = `
    <div class="landing-overlay">
        <div class="alert-info mx-4 mt-4">
            <h2>Instala la app para continuar</h2>
            <p>En el menú de tu navegador, selecciona 'Añadir a pantalla de inicio'.</p>
        </div>
    </div>
    
  `;
}
*/

/*
navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
        registration.unregister();
    }
});

 */