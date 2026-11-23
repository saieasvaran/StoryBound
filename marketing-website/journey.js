/* Four-step Storybound adventure: an optional, self-contained marketing demo. */
(() => {
  'use strict';
  const root = document.querySelector('#journey-experience');
  if (!root) return;

  const tabs = [...root.querySelectorAll('[data-journey-step]')];
  const panels = [...root.querySelectorAll('[data-journey-panel]')];
  const track = root.querySelector('.journey-track');
  const back = root.querySelector('#journey-prev');
  const forward = root.querySelector('#journey-next');
  const status = root.querySelector('#journey-step-status');
  const titles = ['Meet Lumi', 'Choose a land', 'Play & learn', 'Unlock a story'];
  let active = 0;

  function chooseStep(index) {
    if (!Number.isInteger(index) || index < 0 || index >= panels.length) return;
    active = index;
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-pressed', String(selected));
    });
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
    track.style.setProperty('--journey-step', String(index));
    back.disabled = index === 0;
    forward.innerHTML = index === panels.length - 1
      ? 'Start again <span aria-hidden="true">↻</span>'
      : 'Next step <span aria-hidden="true">→</span>';
    status.textContent = `Step ${index + 1} of ${panels.length} · ${titles[index]}`;
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => chooseStep(i));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0
        : event.key === 'End' ? tabs.length - 1
        : (i + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      chooseStep(next);
      tabs[next].focus();
    });
  });
  back?.addEventListener('click', () => chooseStep(Math.max(0, active - 1)));
  forward?.addEventListener('click', () => chooseStep((active + 1) % tabs.length));

  // Castle previews: show one concise description at a time.
  const landDescriptions = {
    sound: '🔊 Sound Land: listen to clues and complete words.',
    match: '🃏 Match Land: hear written words and find their pictures.',
    spell: '🔠 Spell Land: rearrange letters to build words.'
  };
  const landCaption = root.querySelector('#journey-land-caption');
  const castleButtons = [...root.querySelectorAll('[data-journey-land]')];
  castleButtons.forEach(button => {
    button.addEventListener('click', () => {
      castleButtons.forEach(b => {
        const selected = b === button;
        b.classList.toggle('is-selected', selected);
        b.setAttribute('aria-pressed', String(selected));
      });
      if (landCaption) landCaption.textContent = landDescriptions[button.dataset.journeyLand] || '';
    });
  });

  // Small word-to-picture interaction, independent of the full three demos.
  const speakButton = root.querySelector('#journey-word-audio');
  const answerButtons = [...root.querySelectorAll('[data-journey-answer]')];
  const feedback = root.querySelector('#journey-mini-feedback');
  speakButton?.addEventListener('click', () => {
    if ('speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined') {
      const utterance = new SpeechSynthesisUtterance('cat');
      utterance.lang = 'en-GB';
      utterance.rate = 0.82;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      if (feedback) feedback.textContent = 'Listen carefully, then choose the picture.';
    } else if (feedback) {
      feedback.textContent = 'Audio is unavailable in this browser. The word is CAT.';
    }
  });
  answerButtons.forEach(button => {
    button.addEventListener('click', () => {
      const correct = button.dataset.journeyAnswer === 'cat';
      answerButtons.forEach(b => b.classList.remove('is-correct','is-incorrect'));
      button.classList.add(correct ? 'is-correct' : 'is-incorrect');
      if (feedback) feedback.textContent = correct ? '★ Brilliant! CAT matches the cat picture.' : 'Good try! Look for the picture of a cat.';
    });
  });

  // Demonstrative storybook unlock; no user data or storage.
  const book = root.querySelector('#journey-storybook');
  const bookButton = root.querySelector('#journey-book-toggle');
  const bookMessage = root.querySelector('#journey-book-message');
  bookButton?.addEventListener('click', () => {
    const isOpen = bookButton.getAttribute('aria-expanded') !== 'true';
    book?.classList.toggle('is-open', isOpen);
    bookButton.setAttribute('aria-expanded', String(isOpen));
    bookButton.innerHTML = isOpen
      ? 'Close the storybook <span aria-hidden="true">✧</span>'
      : 'Open the storybook <span aria-hidden="true">✧</span>';
    if (bookMessage) bookMessage.hidden = !isOpen;
  });
  chooseStep(0);
})();
