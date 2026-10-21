/* Phase 1: deterministic, append-only question IDs. Keep existing order stable. */
(function (root) {
'use strict';
const banks = [[], [], [], []];
const seen = banks.map(() => new Set());
function add(c, q, ans, unit = '') {
  if (banks[c].length >= 1000 || seen[c].has(q)) return;
  if (!Number.isFinite(ans)) throw new Error('Invalid answer');
  seen[c].add(q);
  banks[c].push(Object.freeze({id: c + '-' + banks[c].length, q, ans, unit}));
}
// Preserve the original prompts so saved answers can be migrated by question text.
function legacy(c, i) {
  const a=3+i%8,b=2+(i*3)%7,d=2+(i*5)%6;
  if(c===0)return {q:`A rectangular prism measures ${a} cm × ${b} cm × ${d} cm. Find its total surface area.`,ans:2*(a*b+a*d+b*d),unit:'cm²'};
  if(c===1){const x=1+i%5,y=x+2+i%4,m=2+i%4;return {q:`What number belongs in the blank? ${x}/${y} = ${x*m}/___`,ans:y*m,unit:''};}
  if(c===2)return {q:`${a} + ${b} × (${d} + 2) = ?`,ans:a+b*(d+2),unit:''};
  return {q:`Wesley has ${a} packs with ${b} cards in each pack. He gives ${d} cards to a friend. How many cards remain?`,ans:a*b-d,unit:'cards'};
}
for(let c=0;c<4;c++)for(let i=0;i<50;i++){const p=legacy(c,i);add(c,p.q,p.ans,p.unit);}
const gcd=(a,b)=>b?gcd(b,a%b):a;
// Interleave ten skills per category; operands give distinct mathematical problems.
for(let i=0;banks.some(b=>b.length<1000);i++) {
  const a=4+i%11,b=3+Math.floor(i/11)%10,h=2+Math.floor(i/110),k=i+2;
  const geometry=[
    [`Find the surface area of a closed rectangular box ${a} cm long, ${b} cm wide, and ${h+3} cm high.`,2*(a*b+a*(h+3)+b*(h+3)),'cm²'],
    [`A cube has edges of ${k} cm. What is its total surface area?`,6*k*k,'cm²'],
    [`Find the volume of a rectangular prism ${a} cm × ${b} cm × ${h+4} cm.`,a*b*(h+4),'cm³'],
    [`A triangle has base ${k+4} cm and perpendicular height 8 cm. Find its area.`,4*(k+4),'cm²'],
    [`A parallelogram has base ${k+3} cm and perpendicular height 7 cm. Find its area.`,7*(k+3),'cm²'],
    [`An open-top box is ${a} cm long, ${b} cm wide, and ${h+5} cm high. Find the area of material for the bottom and four sides.`,a*b+2*(a+b)*(h+5),'cm²'],
    [`A triangular prism has right-triangle ends with sides 3, 4, and 5 cm and a length of ${k} cm. Find its total surface area.`,12+12*k,'cm²'],
    [`A trapezoid has parallel bases ${k} cm and ${k+6} cm and perpendicular height 4 cm. Find its area.`,4*k+12,'cm²'],
    [`A rectangular prism has a base area of ${k*3} cm² and height 5 cm. Find its volume.`,k*15,'cm³'],
    [`A prism is ${a} cm long, ${b} cm wide, and ${h+6} cm high. Its net has two faces of each size. Find the net's total area.`,2*(a*b+a*(h+6)+b*(h+6)),'cm²']
  ];
  const numerator=k,denominator=k+3,factor=2+i%7,g=gcd(numerator,denominator);
  const fractions=[
    [`Fill in the missing numerator: ${numerator}/${denominator} = ___/${denominator*factor}.`,numerator*factor,''],
    [`Fill in the missing denominator: ${numerator}/${denominator} = ${numerator*factor}/___.`,denominator*factor,''],
    [`Simplify ${numerator*factor}/${denominator*factor} fully. What is the numerator?`,numerator/g,''],
    [`Simplify ${numerator*factor}/${denominator*factor} fully. What is the denominator?`,denominator/g,''],
    [`Find ${factor}/${factor+3} of ${k*(factor+3)}.`,factor*k,''],
    [`Write ${k} and 2/5 as an improper fraction. What is its numerator?`,5*k+2,''],
    [`Write ${7*k+3}/7 as a mixed number. What is its whole-number part?`,k,''],
    [`Calculate ${k}/8 + ${k+2}/8. Give the numerator with denominator 8 (do not simplify).`,2*k+2,''],
    [`Calculate ${k+5}/9 − ${k}/9. Give the numerator with denominator 9 (do not simplify).`,5,''],
    [`Calculate ${k}/3 ÷ 1/3.`,k,'']
  ];
  const numbers=[
    [`${k} + 6 × (9 − 4) = ?`,k+30,''],
    [`(${k} + 8) × 3 − 7 = ?`,3*(k+8)-7,''],
    [`${k*6} ÷ 3 × 2 + 5 = ?`,4*k+5,''],
    [`${k} + 4² × 3 = ?`,k+48,''],
    [`5 × (${k} + 6) − 2² = ?`,5*(k+6)-4,''],
    [`${k+30} − 18 ÷ 3 + 2 × 4 = ?`,k+32,''],
    [`[${k*4} + (12 − 4)] ÷ 4 = ?`,k+2,''],
    [`${k} − 7 × 3 = ?`,k-21,''],
    [`${k} + 2³ × (10 − 6) = ?`,k+32,''],
    [`(${k*5} + 15) ÷ (8 − 3) = ?`,k+3,'']
  ];
  const words=[
    [`Wesley buys ${k} notebooks for $3 each and pays with $${k*3+20}. How many dollars in change should he receive?`,20,'dollars'],
    [`A trail is ${k*4} km long. Boffy hikes 3/4 of it. How many kilometers does he hike?`,3*k,'km'],
    [`A recipe uses 2 cups of oats for 5 servings. How many cups are needed for ${k*5} servings?`,2*k,'cups'],
    [`Rocky cycles ${k*6} km in 3 hours at a steady speed. What is his speed in kilometers per hour?`,2*k,'km/h'],
    [`A game costs $${k*10}. It is discounted by 20%. What is its sale price in dollars?`,8*k,'dollars'],
    [`Chilly has ${k*12} beads. She uses 1/3 of them, then gives away 5 beads. How many remain?`,8*k-5,'beads'],
    [`Sunny records four daily reading times: ${k}, ${k+2}, ${k+4}, and ${k+6} minutes. What is the mean time?`,k+3,'minutes'],
    [`Zippy buys ${k} packs of 8 cards and shares all cards equally among 4 friends. How many cards does each friend get?`,2*k,'cards'],
    [`The morning temperature is −${k}°C. It rises by ${k+9} degrees. What is the afternoon temperature in °C?`,9,'°C'],
    [`A garden is ${k+4} m long and 6 m wide. A fence surrounds it with a 2 m opening. How many meters of fencing are needed?`,2*(k+10)-2,'m']
  ];
  [geometry,fractions,numbers,words].forEach((templates,c)=>templates.forEach(p=>add(c,...p)));
}
root.BoffyQuestions=Object.freeze({size:1000,banks:Object.freeze(banks.map(Object.freeze)),legacy});
})(typeof window==='undefined'?globalThis:window);
