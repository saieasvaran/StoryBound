(() => {
  'use strict';
  const cfg = window.STORYBOUND_CONFIG || {};
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  if (menuButton && mobileNav) {
    const closeMenu = () => {
      mobileNav.hidden = true;
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation menu');
    };
    menuButton.addEventListener('click', () => {
      if (mobileNav.hidden) {
        mobileNav.hidden = false;
        menuButton.setAttribute('aria-expanded', 'true');
        menuButton.setAttribute('aria-label', 'Close navigation menu');
      } else closeMenu();
    });
    mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closeMenu(); menuButton.focus(); }
    });
  }

  const teamGrid = document.querySelector('#team-grid');
  const teamNote = document.querySelector('#team-note');
  const members = Array.isArray(cfg.teamMembers) ? cfg.teamMembers.filter(m => m && m.name) : [];
  if (teamGrid) {
    if (!members.length) {
      const fallback = document.createElement('div');
      fallback.className = 'team-placeholder';
      const strong = document.createElement('strong');
      strong.textContent = 'The Storybound development team';
      fallback.append(strong, document.createTextNode('Team member names and responsibilities will appear here once they are approved for publication.'));
      teamGrid.appendChild(fallback);
    } else {
      members.forEach((member) => {
        const card = document.createElement('article');
        card.className = 'team-card';
        const avatar = document.createElement('div');
        avatar.className = 'team-avatar';
        if (member.photo && typeof member.photo === 'string') {
          const photo = document.createElement('img');
          photo.src = member.photo;
          photo.alt = `Photo of ${member.name}`;
          photo.loading = 'lazy';
          avatar.appendChild(photo);
        } else {
          avatar.setAttribute('aria-hidden', 'true');
          avatar.textContent = (member.initials || member.name.split(/\s+/).map(word => word[0]).slice(0,2).join('')).toUpperCase().slice(0,3);
        }
        const title = document.createElement('h3');
        title.textContent = member.name;
        card.append(avatar, title);
        if (member.role && member.role.trim()) {
          const role = document.createElement('p');
          role.textContent = member.role;
          card.appendChild(role);
        }
        teamGrid.appendChild(card);
      });
      if (teamNote) teamNote.hidden = members.every(member => Boolean(member.photo));
    }
  }

  const email = typeof cfg.contactEmail === 'string' ? cfg.contactEmail.trim() : '';
  const emailLink = document.querySelector('#team-email');
  const emailUnset = document.querySelector('#email-unset');
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && emailLink) {
    emailLink.href = 'mailto:' + email;
    emailLink.textContent = email;
    emailLink.hidden = false;
    if (emailUnset) emailUnset.hidden = true;
  }

  const socials = document.querySelector('#social-links');
  const socialNote = document.querySelector('#social-note');
  const socialItems = Array.isArray(cfg.socialLinks) ? cfg.socialLinks : [];
  let count = 0;
  socialItems.forEach(item => {
    if (!item || !item.label || !item.url) return;
    try {
      const url = new URL(item.url);
      if (url.protocol !== 'https:') return;
      const a = document.createElement('a');
      a.href=url.toString();a.textContent=item.label;a.rel='noopener noreferrer';a.target='_blank';
      socials.appendChild(a);count++;
    } catch { /* invalid URL deliberately omitted */ }
  });
  if (count && socialNote) socialNote.hidden = true;

  document.querySelector('#year').textContent = String(new Date().getFullYear());

  // Avoid claiming that local static previews have an active signup backend.
  const form = document.querySelector('#interest-form');
  const localNote = document.querySelector('#local-form-note');
  if (form && (window.location.protocol === 'file:' || ['localhost','127.0.0.1'].includes(window.location.hostname))) {
    if(localNote) localNote.hidden = false;
    form.addEventListener('submit', e => {
      e.preventDefault();
      if(localNote){localNote.hidden=false;localNote.focus?.();localNote.scrollIntoView({block:'nearest'});}
    });
  }

  // Subtle pointer-controlled 3D illusion around Lumi; idle float runs in CSS.
  // Do not apply cursor-driven movement on touch devices or for reduced-motion users.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionAllowed = () => finePointer.matches && !reducedMotion.matches;
  const lumiVisual = document.querySelector('.hero-visual-lumi');
  const lumiStage = document.querySelector('#hero-lumi-stage');
  if (lumiVisual && lumiStage) {
    lumiVisual.addEventListener('pointermove', (event) => {
      if (!motionAllowed()) return;
      const box = lumiVisual.getBoundingClientRect();
      const dx = (event.clientX - box.left) / box.width - .5;
      const dy = (event.clientY - box.top) / box.height - .5;
      lumiStage.style.setProperty('--lumi-rx', `${(-dy * 9).toFixed(2)}deg`);
      lumiStage.style.setProperty('--lumi-ry', `${(dx * 13).toFixed(2)}deg`);
    }, {passive: true});
    const resetLumi = () => {lumiStage.style.removeProperty('--lumi-rx');lumiStage.style.removeProperty('--lumi-ry');};
    lumiVisual.addEventListener('pointerleave', resetLumi);
    reducedMotion.addEventListener?.('change', resetLumi);
  }

  // The four "Little Details. Big Encouragement." panels respond to hover.
  // These are informational panels, not buttons or clickable promises.
  document.querySelectorAll('.benefits-grid .benefit').forEach((panel) => {
    panel.addEventListener('pointermove', (event) => {
      if (!motionAllowed()) return;
      const b = panel.getBoundingClientRect();
      const x = (event.clientX - b.left) / b.width;
      const y = (event.clientY - b.top) / b.height;
      panel.style.setProperty('--card-rx', `${((.5 - y) * 5).toFixed(2)}deg`);
      panel.style.setProperty('--card-ry', `${((x - .5) * 5).toFixed(2)}deg`);
      panel.style.setProperty('--shine-x', `${(x * 100).toFixed(0)}%`);
      panel.style.setProperty('--shine-y', `${(y * 100).toFixed(0)}%`);
    }, {passive: true});
    const clear = () => ['--card-rx','--card-ry','--shine-x','--shine-y'].forEach(k => panel.style.removeProperty(k));
    panel.addEventListener('pointerleave', clear);
    reducedMotion.addEventListener?.('change', clear);
  });

  // A restrained 3D tilt for the Why Storybound artwork on fine pointers only.
  // The image itself always uses its natural aspect ratio (no crop or zoom).
  const whyPictureFrame = document.querySelector('#about .image-mat');
  if (whyPictureFrame) {
    const resetWhyPicture = () => {
      whyPictureFrame.style.removeProperty('--why-rx');
      whyPictureFrame.style.removeProperty('--why-ry');
    };
    whyPictureFrame.addEventListener('pointermove', (event) => {
      if (!motionAllowed()) return;
      const rect = whyPictureFrame.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      whyPictureFrame.style.setProperty('--why-rx', `${(-y * 4).toFixed(2)}deg`);
      whyPictureFrame.style.setProperty('--why-ry', `${(x * 5).toFixed(2)}deg`);
    }, {passive:true});
    whyPictureFrame.addEventListener('pointerleave', resetWhyPicture);
    reducedMotion.addEventListener?.('change', resetWhyPicture);
  }

  // Respect reduced motion and show all content if IntersectionObserver is unavailable.
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('js-ready');
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if(entry.isIntersecting) {entry.target.classList.add('visible');observer.unobserve(entry.target);}
      }
    },{threshold:0.06,rootMargin:'0px 0px 40px 0px'});
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
})();
