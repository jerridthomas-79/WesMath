/* One-second correct-answer reward. Decorative only; never awards credit. */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let cleanup = () => {};
  window.BoffyCoins = { play() {
    cleanup();
    if (document.hidden) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'boffy-coin-celebration';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:2147483647;';
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = innerWidth, h = innerHeight, dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr);
    ctx.scale(dpr,dpr);
    const quiet = reduced.matches;
    const rand = (a,b) => a+Math.random()*(b-a);
    // Even the fastest upward coin falls entirely below the viewport by 0.94s.
    const maxUp = h*.65;
    const gravity = 2*(h/2+maxUp*.94+70)/(.94*.94);
    const coins = Array.from({length:48}, (_,i) => ({
      vx:rand(-w*.65,w*.65), vy:-rand(h*.12,maxUp),
      radius:rand(9,16), phase:rand(0,Math.PI*2), spin:rand(8,17),
      rotation:rand(-2,2), depth:i%3
    }));
    const sparks = Array.from({length:75}, () => {
      const a=rand(0,Math.PI*2), speed=rand(90,Math.min(w,h)*1.4);
      return {vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,size:rand(4,10),life:rand(.4,.8)};
    });
    let timer=0, end=0;
    const start=performance.now();
    function stop() {
      clearTimeout(timer); clearTimeout(end); canvas.remove();
      document.removeEventListener('visibilitychange',onVisibility);
      window.removeEventListener('resize',stop);
      reduced.removeEventListener('change',stop);
      if(cleanup===stop)cleanup=()=>{};
    }
    function onVisibility(){if(document.hidden)stop();}
    cleanup=stop;
    document.addEventListener('visibilitychange',onVisibility);
    window.addEventListener('resize',stop);
    reduced.addEventListener('change',stop);
    document.body.append(canvas);
    function star(x,y,size,alpha) {
      ctx.save();ctx.translate(x,y);ctx.globalAlpha=alpha;
      ctx.fillStyle='#fff9da';ctx.shadowColor='#ffe36b';ctx.shadowBlur=12;
      ctx.beginPath();
      ctx.moveTo(0,-size);ctx.lineTo(size*.24,-size*.24);ctx.lineTo(size,0);
      ctx.lineTo(size*.24,size*.24);ctx.lineTo(0,size);ctx.lineTo(-size*.24,size*.24);
      ctx.lineTo(-size,0);ctx.lineTo(-size*.24,-size*.24);ctx.closePath();ctx.fill();ctx.restore();
    }
    function draw() {
      const t=(performance.now()-start)/1000;
      if(t>=1){stop();return;}
      ctx.clearRect(0,0,w,h);
      // One warm flash, never repeated strobing; reduced motion gets a gentle glow.
      const flash=quiet ? .10*Math.sin(Math.PI*t) : .32*Math.max(0,1-t/.18);
      if(flash>0){ctx.fillStyle=`rgba(255,224,123,${flash})`;ctx.fillRect(0,0,w,h);}
      if(!quiet) {
        const glow=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,Math.min(w,h)*.5);
        glow.addColorStop(0,`rgba(255,249,201,${.7*Math.max(0,1-t/.3)})`);
        glow.addColorStop(1,'rgba(255,194,30,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
        for(const c of coins){
          const x=w/2+c.vx*t,y=h/2+c.vy*t+.5*gravity*t*t;
          if(y-c.radius>h||x+c.radius<0||x-c.radius>w)continue;
          ctx.save();ctx.translate(x,y);ctx.rotate(c.rotation*t);
          ctx.scale(Math.max(.15,Math.abs(Math.cos(c.phase+c.spin*t))),1);
          const gold=ctx.createLinearGradient(-c.radius,-c.radius,c.radius,c.radius);
          gold.addColorStop(0,'#fff7b0');gold.addColorStop(.32,'#ffe369');gold.addColorStop(.65,'#ffbd16');gold.addColorStop(1,'#b66a00');
          ctx.fillStyle=gold;ctx.strokeStyle='#a96b05';ctx.lineWidth=2;
          ctx.beginPath();ctx.arc(0,0,c.radius,0,Math.PI*2);ctx.fill();ctx.stroke();
          ctx.strokeStyle='#fff2a0';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,0,c.radius*.73,0,Math.PI*2);ctx.stroke();
          ctx.fillStyle='#b37708';ctx.font=`900 ${c.radius*1.25}px system-ui`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('★',0,1);
          ctx.restore();
          if(c.depth===0&&t<.55)star(x-c.radius*.5,y-c.radius*.6,5,Math.max(0,1-t/.55));
        }
        for(const s of sparks)if(t<s.life)star(w/2+s.vx*t,h/2+s.vy*t+gravity*.07*t*t,s.size*(1-t/s.life),1-t/s.life);
      }
      timer=window.setTimeout(draw,16);
    }
    end=window.setTimeout(stop,1000);
    draw();
  }};
})();
