/* Boffy action sprite. No libraries, storage changes, or game-logic hooks. */
(() => {
  'use strict';
  const app = document.getElementById('app');
  if (!app) return;
  const scriptBase = document.currentScript?.src || document.baseURI;
  const sheet = new Image();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Anticipation, two fist pumps, both arms up, then settle.
  const poses = [0,1,2,3,4,5,5,4,3,4,5,5,6,7,8,8,8,9,10,11,0];
  const holds = [150,90,120,75,75,100,130,75,75,75,100,130,85,100,120,150,150,120,100,100,150];
  const duration = holds.reduce((a,b) => a+b,0);
  let current = null;
  function enhance() {
    const slot = app.querySelector('.a08-mascot');
    if (current?.slot === slot) return;
    current?.stop();
    current = null;
    if (!slot) return;
    const mascot = slot.querySelector('img');
    if (!mascot) return;
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'boffy-touch';
    button.setAttribute('aria-label', 'Cheer with Boffy');
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 362;
    canvas.className = 'boffy-action'; canvas.setAttribute('aria-hidden','true');
    const ctx = canvas.getContext('2d');
    button.append(mascot, canvas); slot.append(button);
    const greeting = app.querySelector('.a08-sparkles');
    if (greeting) {
      greeting.classList.add('boffy-greeting'); greeting.removeAttribute('aria-hidden');
      greeting.setAttribute('role','status'); greeting.setAttribute('aria-live','polite');
      greeting.textContent = 'LET’S GO, WESLEY!';
    }
    let raf = 0, running = false, ready = false, last = -1, burst = false, cheers = 0;
    function draw(frame) {
      if (!ready || frame === last) return;
      last = frame;
      ctx.clearRect(0,0,362,362);
      ctx.drawImage(sheet,(frame%4)*362,Math.floor(frame/4)*362,362,362,0,0,362,362);
      canvas.dataset.frame = String(frame);
    }
    function stop() {
      clearTimeout(raf); running = false;
      button.classList.remove('is-cheering');
      button.querySelectorAll('.boffy-burst').forEach(n=>n.remove());
      draw(0);
    }
    function sparkle() {
      for (let i=0;i<10;i++) {
        const star=document.createElement('span'), a=i*Math.PI/5;
        star.className='boffy-burst'; star.setAttribute('aria-hidden','true'); star.textContent='✦';
        star.style.cssText=`--dx:${Math.cos(a)*100}px;--dy:${Math.sin(a)*75-15}px;--spin:${i*36}deg;--delay:0s`;
        button.append(star);
      }
    }
    function play() {
      if (running) return;
      if (greeting) greeting.textContent = ['LET’S GO, WESLEY!','YOU + BOFFY. YOU’VE GOT THIS!','ONE PROBLEM. ONE BIG WIN!'][cheers++%3];
      if (!ready || reduced.matches || document.hidden) return;
      running=true; burst=false; button.classList.add('is-cheering');
      const start=performance.now();
      function tick(now) {
        if (!button.isConnected) {stop();return;}
        let time=now-start,index=0;
        if(time>=duration){stop();return;}
        while(time>=holds[index])time-=holds[index++];
        draw(poses[index]);
        if(index>=14&&!burst){burst=true;sparkle();}
        raf=window.setTimeout(() => tick(performance.now()), Math.max(16, holds[index]-time));
      }
      tick(performance.now());
    }
    function load() {
      if (!button.isConnected || !ctx || !sheet.naturalWidth) return;
      ready=true; button.classList.add('has-action'); draw(0); play();
    }
    button.addEventListener('click',play);
    current={slot,stop,load};
    if(sheet.complete&&sheet.naturalWidth)load();
  }
  sheet.onload=()=>current?.load();
  sheet.src=new URL('assets/boffy-cheer.webp',scriptBase).href;
  new MutationObserver(enhance).observe(app,{childList:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)current?.stop();});
  reduced.addEventListener('change',()=>current?.stop());
  enhance();
})();
