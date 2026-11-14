// Four-page invitation. Original loader and decorative styling are preserved.
const body = document.body;
const loader = document.getElementById('loader');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const screens = ['welcome', 'family', 'invitation', 'venue'];
let currentScreen = 'welcome';

function showScreen(id) {
  if (!screens.includes(id)) return;
  const oldScreen = document.getElementById(currentScreen);
  const newScreen = document.getElementById(id);
  if (!newScreen) return;
  if (oldScreen && oldScreen !== newScreen) {
    oldScreen.classList.remove('is-current');
    oldScreen.setAttribute('aria-hidden', 'true');
    oldScreen.hidden = true;
  }
  newScreen.hidden = false;
  newScreen.classList.add('is-current');
  newScreen.setAttribute('aria-hidden', 'false');
  currentScreen = id;
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (id === 'invitation') {
    document.getElementById('invitationCard')?.classList.add('is-revealed');
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }
  if (id !== 'welcome') {
    const heading = newScreen.querySelector('h2');
    if (heading) { heading.setAttribute('tabindex','-1'); heading.focus({preventScroll:true}); }
  }
}

// Ensure the welcome screen is displayed on first load.
document.getElementById('welcome')?.classList.add('is-current');
document.getElementById('welcome')?.setAttribute('aria-hidden','false');
document.getElementById('openInvitation')?.addEventListener('click', () => showScreen('family'));
document.querySelectorAll('[data-go]').forEach(button => {
  button.addEventListener('click', () => showScreen(button.dataset.go));
});

if (loader) {
  body.classList.add('is-locked');
  loader.classList.add('is-visible');
  const hideLoader = () => {
    window.setTimeout(() => {
      loader.classList.add('is-hidden');
      body.classList.remove('is-locked');
      window.setTimeout(() => loader.remove(), reduceMotion ? 0 : 600);
    }, reduceMotion ? 150 : 1800);
  };
  if (document.readyState === 'complete') hideLoader();
  else window.addEventListener('load', hideLoader, {once:true});
}
