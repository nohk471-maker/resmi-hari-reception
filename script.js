const openInvitationButton = document.getElementById('openInvitation');
const landingSection = document.querySelector('.landing');
const invitationSection = document.querySelector('.invitation');
const invitationCard = document.getElementById('invitationCard');
const revealedElements = document.querySelectorAll('.reveal');
const page = document.getElementById('page');
const loader = document.getElementById('loader');
const scrollIndicator = document.querySelector('.scroll-indicator');
const navToggle = document.querySelector('.top-nav__toggle');
const navMenu = document.querySelector('.top-nav__menu');
const navLinks = document.querySelectorAll('.top-nav__link');
const progressItems = document.querySelectorAll('.progress-indicator__item');
const body = document.body;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Collect the navigation targets from the existing top navigation links so the
// buttons can follow the same sections automatically.
const sectionIds = Array.from(navLinks, (link) => link.getAttribute('data-target'))
  .filter(Boolean);
const sectionElements = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);
let activeSectionId = sectionIds[0] || '';

const revealOnce = () => {
  if (typeof IntersectionObserver === 'undefined' || !revealedElements.length) {
    revealedElements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealedElements.forEach((element) => revealObserver.observe(element));
};

const setActiveNavigationState = (sectionId = activeSectionId) => {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute('data-target') === sectionId;
    link.classList.toggle('is-active', isActive);
    link.setAttribute('aria-current', isActive ? 'page' : 'false');
  });

  progressItems.forEach((button) => {
    const isActive = button.getAttribute('data-target') === sectionId;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
};

const closeMobileMenu = () => {
  if (navMenu) {
    navMenu.classList.remove('is-open');
  }
  if (navToggle) {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.classList.remove('is-open');
  }
};

const scrollToSection = (targetId) => {
  const target = document.getElementById(targetId);
  if (!target) return;

  target.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
};

// Use an IntersectionObserver so the active section updates while the user
// scrolls naturally on both desktop and mobile.
const observeSections = () => {
  if (typeof IntersectionObserver === 'undefined' || !sectionElements.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visibleEntries.length) {
        const nextSectionId = visibleEntries[0].target.id;
        if (nextSectionId !== activeSectionId) {
          activeSectionId = nextSectionId;
          setActiveNavigationState(activeSectionId);
        }
      }
    },
    {
      threshold: [0.2, 0.45, 0.7],
      rootMargin: '-10% 0px -50% 0px',
    }
  );

  sectionElements.forEach((section) => observer.observe(section));
};

if (loader) {
  body.classList.add('is-locked');

  if (reduceMotion) {
    loader.classList.add('is-visible');
    window.setTimeout(() => {
      loader.classList.add('is-hidden');
      body.classList.remove('is-locked');
      loader.remove();
    }, 0);
  } else {
    window.setTimeout(() => {
      loader.classList.add('is-visible');
    }, 0);

    window.setTimeout(() => {
      loader.classList.add('is-hidden');
      body.classList.remove('is-locked');
    }, 1300);

    window.setTimeout(() => {
      loader.remove();
    }, 1800);
  }
}

if (openInvitationButton && landingSection && invitationSection && invitationCard) {
  openInvitationButton.addEventListener('click', (event) => {
    event.preventDefault();

    landingSection.classList.add('is-hidden');
    invitationSection.classList.add('is-visible');
    invitationSection.setAttribute('aria-hidden', 'false');
    invitationCard.classList.add('is-revealed');
    page.classList.add('is-open');

    const invitationTarget = document.getElementById('invitation');
    if (invitationTarget) {
      invitationTarget.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    if (scrollIndicator) {
      scrollIndicator.classList.add('is-hidden');
    }

    if (!reduceMotion) {
      revealedElements.forEach((element, index) => {
        window.setTimeout(() => {
          element.classList.add('is-visible');
        }, 140 * (index + 1));
      });
    } else {
      revealedElements.forEach((element) => element.classList.add('is-visible'));
    }
  });
}

revealOnce();

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    const nextExpanded = !isExpanded;
    navToggle.setAttribute('aria-expanded', String(nextExpanded));
    navMenu.classList.toggle('is-open', nextExpanded);
    navToggle.classList.toggle('is-open', nextExpanded);
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const targetId = link.getAttribute('data-target');
    if (targetId) {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        activeSectionId = targetId;
        setActiveNavigationState(activeSectionId);
      }
    }
    closeMobileMenu();
  });
});

progressItems.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    const targetId = button.getAttribute('data-target');
    if (targetId) {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        activeSectionId = targetId;
        setActiveNavigationState(activeSectionId);
      }
    }
    closeMobileMenu();
  });
});

observeSections();
setActiveNavigationState();
