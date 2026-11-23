/* Storybound tiny demo experiences – all client-side, no network, no saved gameplay data. */
(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const announce = (id, message, success = null) => {
    const node = byId(id);
    if (!node) return;
    node.textContent = message;
    node.classList.toggle('is-good', success === true);
    node.classList.toggle('is-try', success === false);
  };
  const voice = word => {
    if (!canSpeak) return false;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-GB';
    utterance.rate = 0.78;
    utterance.pitch = 1.05;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
    return true;
  };
  const makeButton = (text, className, onClick, opts = {}) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    button.className = className;
    if (opts.label) button.setAttribute('aria-label', opts.label);
    if (opts.disabled) button.disabled = true;
    button.addEventListener('click', onClick);
    return button;
  };
  const starText = (completed, total) => Array.from({length:total}, (_,i) => i < completed ? '★' : '☆').join(' ');

  // SOUND LAND: listen to a complete word, choose a missing prefix or suffix.
  const soundQuestions = [
    { word:'unhappy', puzzle:'__happy', options:['re','un','pre'], answer:'un', hint:'This short part means “not”.' },
    { word:'helpful', puzzle:'help__', options:['ful','ing','est'], answer:'ful', hint:'This ending means “full of”.' },
    { word:'replay', puzzle:'__play', options:['un','dis','re'], answer:'re', hint:'This part means “again”.' }
  ];
  let soundIndex = 0, soundDone = false;
  const soundRender = () => {
    soundDone = false;
    const q=soundQuestions[soundIndex];
    byId('sound-progress').textContent=`Challenge ${soundIndex+1} of ${soundQuestions.length}`;
    byId('sound-stars').textContent=starText(soundIndex,soundQuestions.length);
    byId('sound-word').textContent=q.puzzle;
    const choices=byId('sound-options'); choices.replaceChildren();
    q.options.forEach(answer => choices.appendChild(makeButton(answer,'demo-choice', () => {
      if(soundDone) return;
      if(answer===q.answer){
        soundDone=true;
        choices.querySelectorAll('button').forEach(button => {
          button.disabled=true;
          if(button.textContent===q.answer) button.classList.add('correct');
        });
        byId('sound-word').textContent=q.word;
        byId('sound-stars').textContent=starText(soundIndex+1,soundQuestions.length);
        announce('sound-feedback',soundIndex===soundQuestions.length-1 ? 'Wonderful! You earned all three stars! ✨' : `Brilliant! ${q.word} is right. ⭐`,true);
        byId('sound-next').hidden=soundIndex===soundQuestions.length-1;
        byId('sound-restart').hidden=soundIndex!==soundQuestions.length-1;
      }else{
        announce('sound-feedback','Good try! Listen again or use a hint.',false);
      }
    }, {label:`Choose ${answer} as the missing word part`})));
    byId('sound-next').hidden=true;
    byId('sound-restart').hidden=true;
    byId('sound-hint').hidden=false;
    announce('sound-feedback','Pick a missing word part to start.');
  };
  byId('sound-listen')?.addEventListener('click', () => {
    if(!voice(soundQuestions[soundIndex].word)) announce('sound-feedback','Audio is unavailable in this browser. Try a hint instead.');
  });
  byId('sound-hint')?.addEventListener('click', () => announce('sound-feedback',soundQuestions[soundIndex].hint));
  byId('sound-next')?.addEventListener('click', () => { if(soundDone && soundIndex<soundQuestions.length-1){soundIndex++;soundRender();} });
  byId('sound-restart')?.addEventListener('click', () => { soundIndex=0;soundRender(); });
  if(byId('sound-options')) soundRender();

  // MATCH LAND: visible written-word cards are spoken when clicked and match separate picture cards. 2 pairs per board.
  const matchRounds = [
    [{word:'cat',emoji:'🐱'},{word:'dog',emoji:'🐶'}],
    [{word:'sun',emoji:'☀️'},{word:'moon',emoji:'🌙'}]
  ];
  let matchIndex=0, selectedAudio=null, selectedPicture=null, matchComplete=new Set();
  let matchBoardData=[];
  const matchRender = () => {
    selectedAudio=null;selectedPicture=null;matchComplete=new Set();
    byId('match-progress').textContent=`Challenge ${matchIndex+1} of ${matchRounds.length}`;
    byId('match-stars').textContent='0 / 2 pairs';
    // Alternate word and picture cards across the board; text is always visible on word cards.
    const qs=matchRounds[matchIndex];
    matchBoardData = matchIndex===0 ? [
      {kind:'audio', pair:0,word:qs[0].word}, {kind:'picture',pair:1,word:qs[1].word,emoji:qs[1].emoji},
      {kind:'picture',pair:0,word:qs[0].word,emoji:qs[0].emoji}, {kind:'audio',pair:1,word:qs[1].word}
    ] : [
      {kind:'picture',pair:1,word:qs[1].word,emoji:qs[1].emoji},{kind:'audio',pair:0,word:qs[0].word},
      {kind:'audio',pair:1,word:qs[1].word},{kind:'picture',pair:0,word:qs[0].word,emoji:qs[0].emoji}
    ];
    byId('match-next').hidden=true;
    byId('match-restart').hidden=true;
    byId('match-hint').hidden=false;
    announce('match-feedback','Tap a written word to hear it spoken, then find its picture.');
    matchDraw();
  };
  const matchDraw=() => {
    const board=byId('match-board'); board.replaceChildren();
    matchBoardData.forEach((c,i) => {
      const done=matchComplete.has(c.pair);
      const isSelected=(c.kind==='audio' && selectedAudio===i)||(c.kind==='picture' && selectedPicture===i);
      const text=c.kind==='audio' ? `🔊\n${c.word.toUpperCase()}` : `${c.emoji}\nPicture`;
      const b=makeButton(text,'match-tile',()=>matchChoose(i), {label:c.kind==='audio' ? `Word card ${c.word.toUpperCase()}: tap to hear the word` : `Picture card showing ${c.word}`,disabled:done});
      b.classList.toggle('selected',isSelected);
      b.classList.toggle('matched',done);
      b.dataset.kind=c.kind;
      b.setAttribute('aria-pressed',isSelected?'true':'false');
      board.appendChild(b);
    });
  };
  const matchChoose=(i)=>{
    const c=matchBoardData[i];
    if(matchComplete.has(c.pair)) return;
    if(c.kind==='audio'){
      selectedAudio=i;
      if(!voice(c.word)) announce('match-feedback',`The word is ${c.word.toUpperCase()}. Speech is unavailable on this device; find the matching picture.`);
      else announce('match-feedback',`You chose ${c.word.toUpperCase()}. Listen, then tap the matching picture.`);
    }else{
      selectedPicture=i;
      if(selectedAudio===null) announce('match-feedback','Choose a written word first, then tap its matching picture.');
    }
    if(selectedAudio!==null && selectedPicture!==null){
      const sound=matchBoardData[selectedAudio];
      const picture=matchBoardData[selectedPicture];
      if(sound.pair===picture.pair){
        matchComplete.add(sound.pair);
        announce('match-feedback',`Wonderful! ${sound.word} is a match! ⭐`,true);
        byId('match-stars').textContent=`${matchComplete.size} / 2 pairs`;
        selectedAudio=null;selectedPicture=null;
        if(matchComplete.size===2){
          announce('match-feedback',matchIndex===matchRounds.length-1 ? 'You matched every pair! Amazing! ✨' : 'Both pairs found! Another round awaits. ⭐',true);
          byId('match-next').hidden=matchIndex===matchRounds.length-1;
          byId('match-restart').hidden=matchIndex!==matchRounds.length-1;
        }
      }else{
        announce('match-feedback','Not quite a match. Tap the word to hear it again and try a different picture.',false);
        selectedPicture=null;
      }
    }
    matchDraw();
  };
  const matchHints={cat:'Look for the animal that says meow.',dog:'Look for the animal that barks.',sun:'Look for the bright object in the daytime sky.',moon:'Look for the shape that shines in the night sky.'};
  byId('match-hint')?.addEventListener('click',()=>{
    if(selectedAudio===null) announce('match-feedback','Tap a word card first, then ask for a picture hint.');
    else announce('match-feedback',matchHints[matchBoardData[selectedAudio].word] || 'Find the picture that matches the word.');
  });
  byId('match-next')?.addEventListener('click',()=>{if(matchComplete.size===2 && matchIndex<matchRounds.length-1){matchIndex++;matchRender();}});
  byId('match-restart')?.addEventListener('click',()=>{matchIndex=0;matchRender();});
  if(byId('match-board')) matchRender();

  // SPELL LAND: build words by clicking shuffled letter tiles; selected letters are reversible.
  const spellQuestions=[
    {word:'sun', emoji:'☀️', tiles:['n','s','u'],hint:'It shines in the daytime. The first letter is S.'},
    {word:'cat', emoji:'🐱', tiles:['t','a','c'],hint:'This pet says “meow”. The first letter is C.'},
    {word:'book',emoji:'📖', tiles:['o','k','b','o'],hint:'You can read it. The first letter is B.'}
  ];
  let spellIndex=0, spellPicked=[], spellSolved=false;
  const spellRender=()=>{
    spellPicked=[];spellSolved=false;
    const q=spellQuestions[spellIndex];
    byId('spell-progress').textContent=`Challenge ${spellIndex+1} of ${spellQuestions.length}`;
    byId('spell-stars').textContent=starText(spellIndex,spellQuestions.length);
    byId('spell-emoji').textContent=q.emoji;
    byId('spell-next').hidden=true;byId('spell-restart').hidden=true;
    byId('spell-hint').hidden=false;byId('spell-clear').hidden=false;byId('spell-check').hidden=false;
    announce('spell-feedback','Tap the letters in the correct order.');
    spellDraw();
  };
  const spellDraw=()=>{
    const q=spellQuestions[spellIndex];
    const slots=byId('spell-slots'),tiles=byId('spell-tiles');slots.replaceChildren();tiles.replaceChildren();
    for(let i=0;i<q.word.length;i++){
      const picked=spellPicked[i];
      if(picked!==undefined){
        const b=makeButton(q.tiles[picked],'spell-slot filled',()=>{
          if(spellSolved) return;
          spellPicked.splice(i,1);spellDraw();
        },{label:`Remove letter ${q.tiles[picked]} from position ${i+1}`,disabled:spellSolved});
        slots.appendChild(b);
      }else{
        const slot=document.createElement('span');slot.className='spell-slot empty';slot.textContent='·';slot.setAttribute('aria-hidden','true');slots.appendChild(slot);
      }
    }
    q.tiles.forEach((letter,i)=>{
      const used=spellPicked.includes(i);
      const b=makeButton(letter,'spell-tile',()=>{if(!spellSolved&&spellPicked.length<q.word.length){spellPicked.push(i);spellDraw();}},{label:`Use letter ${letter}`,disabled:used||spellSolved});
      if(used) b.classList.add('tile-used');
      tiles.appendChild(b);
    });
  };
  byId('spell-listen')?.addEventListener('click',()=>{if(!voice(spellQuestions[spellIndex].word)) announce('spell-feedback','Audio is unavailable. Try the picture or hint.');});
  byId('spell-hint')?.addEventListener('click',()=>announce('spell-feedback',spellQuestions[spellIndex].hint));
  byId('spell-clear')?.addEventListener('click',()=>{if(!spellSolved){spellPicked=[];spellDraw();announce('spell-feedback','Cleared! Have another go.');}});
  byId('spell-check')?.addEventListener('click',()=>{
    if(spellSolved) return;
    const q=spellQuestions[spellIndex];
    const entered=spellPicked.map(i=>q.tiles[i]).join('');
    if(entered.length!==q.word.length){announce('spell-feedback','Choose all the letters first.',false);return;}
    if(entered===q.word){
      spellSolved=true;spellDraw();byId('spell-stars').textContent=starText(spellIndex+1,spellQuestions.length);
      announce('spell-feedback',spellIndex===spellQuestions.length-1 ? 'Fantastic spelling! You earned every star! ✨' : `You spelled ${q.word}! Great job! ⭐`,true);
      byId('spell-next').hidden=spellIndex===spellQuestions.length-1;
      byId('spell-restart').hidden=spellIndex!==spellQuestions.length-1;
      byId('spell-check').hidden=true;byId('spell-clear').hidden=true;
    }else announce('spell-feedback','Nearly! Change the letter order and try again.',false);
  });
  byId('spell-next')?.addEventListener('click',()=>{if(spellSolved&&spellIndex<spellQuestions.length-1){spellIndex++;spellRender();}});
  byId('spell-restart')?.addEventListener('click',()=>{spellIndex=0;spellRender();});
  if(byId('spell-tiles')) spellRender();

  // PARENT-ONLY CHAT PREVIEW – clearly NOT an AI backend, with prewritten educational guidance.
  const chatLog=byId('chat-demo-messages'),chatForm=byId('chat-demo-form'),chatInput=byId('chat-demo-input');
  const greeting='Hello! I’m Lumi’s parent-guide preview. Ask me about short spelling activities, encouragement or understanding progress. 🦉';
  const replies=[
    {test:/spell|letter|word|practi[sc]e|phon|homework/i,
     answer:'Try a 5-minute practice game: say a word aloud, show a picture, and let your child move letter tiles into order. Praise their effort and take a break when needed.'},
    {test:/frustrat|upset|stress|confiden|encourag|mistake|difficult|sad/i,
     answer:'Keep practice short and calm. Offer a choice of activity, celebrate small successes, and avoid pressure to finish quickly. A teacher or specialist can suggest individual adjustments.'},
    {test:/progress|dashboard|score|result|level|track/i,
     answer:'The planned dashboard would show levels played and skills practised, including where more help may be useful. These game results are not a diagnosis or a full measure of reading ability.'},
    {test:/dyslex|diagnos|test|assess|disabil/i,
     answer:'Dyslexia can affect reading and spelling in different ways. A game cannot diagnose it. For assessment questions, speak with a qualified professional or your child’s school.'},
    {test:/privacy|data|safe|personal|security/i,
     answer:'Our design aims to keep children’s gameplay data on their device and limit what is collected. This website demo does not send or save your chat questions.'},
    {test:/hello|hi|hey|lumi/i,
     answer:'Hello! You can ask about spelling practice, keeping learning fun, or how the planned progress dashboard works.'}
  ];
  const getReply=text=>{
    const match=replies.find(entry=>entry.test.test(text));
    return match ? match.answer : 'This little preview only covers a few sample topics. Try asking about spelling practice, encouraging a child, dyslexia or reading progress. The future assistant is planned to offer more general support.';
  };
  const addChatMessage=(text,isUser)=>{
    if(!chatLog) return;
    const el=document.createElement('div');el.className=`chat-bubble ${isUser?'parent-question':'bot-answer'}`;
    el.textContent=text;chatLog.appendChild(el);
    if(!reducedMotion) chatLog.scrollTo({top:chatLog.scrollHeight,behavior:'smooth'});
    else chatLog.scrollTop=chatLog.scrollHeight;
  };
  const submitChat=(text)=>{
    const cleaned=(text||'').trim().slice(0,220);
    if(!cleaned || !chatLog) return;
    addChatMessage(cleaned,true);
    addChatMessage(getReply(cleaned),false);
    if(chatInput) chatInput.value='';
  };
  chatForm?.addEventListener('submit',event=>{event.preventDefault();submitChat(chatInput.value);chatInput.focus();});
  document.querySelectorAll('[data-chat-prompt]').forEach(button=>button.addEventListener('click',()=>submitChat(button.dataset.chatPrompt)));
  byId('chat-demo-clear')?.addEventListener('click',()=>{
    chatLog.replaceChildren();addChatMessage(greeting,false);
    if(chatInput) chatInput.focus();
  });
})();
