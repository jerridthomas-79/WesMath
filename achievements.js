/* Phase 2 functionality. Phase 3 replaces only the dedicated crew-art slot. */
(function () {
'use strict';
const quests=['Geometry Quest','Fractions Force','Number Sense','Word Problem Trail'];
const crew=['rocky','chilly','boffy','sunny','zippy'];
const approvedCount=()=>Object.values(entries).filter(e=>e.correct&&e.approved).reduce((sum,e)=>sum+Math.max(1,e.legacyApprovedCredits||1),0);
const goalId=()=>`goal:${goal.target}`;
let selectedId=null,prepared=null,preparingId=null,objectURL=null,preparation=0;
// Only accept known milestone IDs and plain snapshots from the same v2 save.
const unique=new Set();
achievementHistory={milestones:achievementHistory.milestones.filter(m=>{
 if(!m||unique.has(m.id))return false;
 const validQuest=m.type==='quest'&&Number.isInteger(m.course)&&m.course>=0&&m.course<4&&m.id===`quest:${m.course}`;
 const validGoal=m.type==='goal'&&Number.isInteger(m.target)&&m.target>0&&m.id===`goal:${m.target}`&&typeof m.name==='string'&&typeof m.reward==='string';
 if(!validQuest&&!validGoal)return false;
 unique.add(m.id);return true;
}).map(m=>m.type==='quest'?{id:m.id,type:'quest',course:m.course}:{id:m.id,type:'goal',target:m.target,name:m.name,reward:m.reward})};
const find=id=>achievementHistory.milestones.find(m=>m.id===id);
function remember(m,automatic=false){
 if(find(m.id))return false;
 achievementHistory.milestones.push(m);
 if(automatic){selectedId=m.id;page='celebration'}
 return true;
}
function rememberGoal(automatic=false){return remember({id:goalId(),type:'goal',target:goal.target,name:goal.name,reward:goal.reward},automatic)}
function describe(m){
 return m.type==='quest'?{
  title:'QUEST CHAMPION!',label:quests[m.course],
  description:`Wesley, you correctly completed all 1,000 questions in ${quests[m.course]}!`,
  note:'Your quest is complete! Dad still reviews your written work for goal credit.'
 }:{
  title:'GOAL ACHIEVED!',label:m.name,
  description:`Wesley, you reached ${m.target} Dad-approved answers for ${m.name}! Your reward: ${m.reward}.`,
  note:'You earned this milestone! Ask Dad about your reward.'
 };
}
// Existing Phase 1 achievements become revisitable without a surprise on reload.
if(approvedCount()>=goal.target)rememberGoal();
for(let c=0;c<4;c++)if(completedIn(c)===1000)remember({id:`quest:${c}`,type:'quest',course:c});
save();
function clearPrepared(){
 preparation++;prepared=null;preparingId=null;
 if(objectURL){URL.revokeObjectURL(objectURL);objectURL=null}
}
window.BoffyAchievements={
 onApproval(before,after){if(before<goal.target&&after>=goal.target)rememberGoal(true)},
 onCorrect(c){if(completedIn(c)===1000)remember({id:`quest:${c}`,type:'quest',course:c},true)},
 onGoalChange(){if(approvedCount()>=goal.target)rememberGoal()},
 reset(){achievementHistory={milestones:[]};selectedId=null;clearPrepared()},
 describe
};
window.viewAchievements=function(){page='achievements';render()};
window.revisitAchievement=function(id){if(!find(id))return;selectedId=id;page='celebration';render()};
window.achievementHome=function(){page='welcome';render()};
function status(message){const el=document.getElementById('achievement-status');if(page==='celebration'&&el)el.textContent=message}
const asset=name=>`assets/${name==='boffy'?'boffy-a01':name+'-a02'}.png`;
function loadImage(src){return new Promise((resolve,reject)=>{
 const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('Character image could not be loaded'));image.src=src;
})}
// Fixed-resolution canvas export: independent of device pixel ratio and screen size.
function textBlock(ctx,text,{y,width=1400,size=60,min=28,height=240,color='#fff6d9',weight=800}){
 let lines=[];
 for(;;size--){
  ctx.font=`${weight} ${size}px system-ui, sans-serif`;
  lines=[''];
  // Split unusually long words too, so custom goal/reward text cannot clip.
  for(const word of String(text).split(/\s+/)){
   if(ctx.measureText(word).width>width){
    if(lines[lines.length-1])lines.push('');
    for(const letter of word){const last=lines.length-1;if(ctx.measureText(lines[last]+letter).width>width)lines.push(letter);else lines[last]+=letter}
    lines.push('');continue;
   }
   const last=lines.length-1,candidate=lines[last]?lines[last]+' '+word:word;
   if(ctx.measureText(candidate).width>width)lines.push(word);else lines[last]=candidate;
  }
  lines=lines.filter(Boolean);
  if((lines.length*size*1.25<=height&&lines.every(line=>ctx.measureText(line).width<=width))||size<=min)break;
 }
 ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='top';
 lines.forEach((line,i)=>ctx.fillText(line,800,y+i*size*1.25));
}
async function makePNG(m){
 const characters=await Promise.all(crew.map(name=>loadImage(asset(name))));
 const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=2000;
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Image creation is unavailable');
 const background=ctx.createLinearGradient(0,0,0,2000);background.addColorStop(0,'#123e56');background.addColorStop(1,'#041a32');ctx.fillStyle=background;ctx.fillRect(0,0,1600,2000);
 ctx.strokeStyle='#f3ca64';ctx.lineWidth=12;ctx.strokeRect(32,32,1536,1936);
 textBlock(ctx,'YOU DID IT, WESLEY!',{y:110,size:100,height:240,color:'#ffdb68'});
 textBlock(ctx,'Your whole sloth crew is celebrating!',{y:380,size:48,height:80});
 const boxes=[[65,620,330,540],[350,560,330,600],[610,465,390,750],[935,560,330,600],[1210,620,330,540]];
 characters.forEach((image,i)=>{
  const [x,y,w,h]=boxes[i],scale=Math.min(w/image.naturalWidth,h/image.naturalHeight),dw=image.naturalWidth*scale,dh=image.naturalHeight*scale;
  ctx.drawImage(image,x+(w-dw)/2,y+h-dh,dw,dh);
 });
 const info=describe(m);
 textBlock(ctx,info.title,{y:1270,size:78,height:110,color:'#ffdb68'});
 textBlock(ctx,info.description,{y:1410,size:54,min:28,height:260});
 ctx.fillStyle='#745027';ctx.fillRect(80,1740,1440,180);ctx.strokeStyle='#f3ca64';ctx.lineWidth=4;ctx.strokeRect(80,1740,1440,180);
 textBlock(ctx,'SHOW DAD HOW AWESOME YOU ARE',{y:1760,size:67,height:150,color:'#fff0aa'});
 return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Image could not be created')),'image/png'));
}
async function prepare(m){
 clearPrepared();preparingId=m.id;const token=preparation;
 const saveButton=document.getElementById('save-achievement');if(page==='celebration'&&saveButton)saveButton.disabled=true;
 // Unit tests exercise milestone logic; the real-browser suite tests canvas exports.
 if(typeof Image==='undefined')return;
 try{
  const blob=await makePNG(m);
  if(token!==preparation)return;
  prepared={id:m.id,file:new File([blob],`Wesley-${m.type==='quest'?'quest-'+(m.course+1):'goal-'+m.target}-achievement.png`,{type:'image/png'})};
  preparingId=null;
  if(page==='celebration'&&selectedId===m.id){const button=document.getElementById('save-achievement');if(button)button.disabled=false;status('Your PNG is ready. Tap Save to share it or download it.')}
 }catch(error){
  if(token!==preparation)return;
  preparingId=null;status('The image could not be prepared. Check your connection and tap Save to retry.');
  const button=document.getElementById('save-achievement');if(button)button.disabled=false;
 }
}
function fallback(file){
 if(objectURL)URL.revokeObjectURL(objectURL);
 objectURL=URL.createObjectURL(file);
 const links=document.getElementById('achievement-file-links');
 if(links){links.innerHTML=`<a href="${objectURL}" download="${file.name}">Download PNG</a> <a href="${objectURL}" target="_blank" rel="noopener">Open PNG</a>`;links.hidden=false}
 const anchor=document.createElement('a');anchor.href=objectURL;anchor.download=file.name;document.body.appendChild(anchor);anchor.click();anchor.remove();
 status('PNG ready. Download it or open it, then touch and hold to save.');
}
window.saveMyAchievement=function(){
 const m=find(selectedId);if(!m)return;
 if(!prepared||prepared.id!==m.id){status('Preparing your PNG. Tap Save again when it is ready.');prepare(m);return}
 const file=prepared.file;
 let canShare=false;
 try{canShare=!!(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]}))}catch(error){/* Use the PNG fallback. */}
 if(!canShare){fallback(file);return}
 // No await before share: this call stays directly within the user's tap gesture.
 const button=document.getElementById('save-achievement');button.disabled=true;
 try{
  Promise.resolve(navigator.share({files:[file],title:'YOU DID IT, WESLEY!',text:describe(m).title})).then(()=>status('Shared! You can keep or share your achievement again.'),error=>{
   if(page!=='celebration'||selectedId!==m.id)return;
   if(error.name==='AbortError')status('Sharing canceled. Your achievement is ready whenever you are.');
   else fallback(file);
  }).finally(()=>{if(page==='celebration'&&selectedId===m.id)button.disabled=false});
 }catch(error){button.disabled=false;if(error.name==='AbortError')status('Sharing canceled. Tap Save whenever you are ready.');else fallback(file)}
};
const baseRender=window.render;
window.render=function(){
 baseRender();
 app.classList.toggle('celebration-page',page==='celebration');
 if(page==='celebration'){
  const m=find(selectedId);if(!m){page='welcome';render();return}
  const info=describe(m),ready=prepared?.id===m.id;
  app.innerHTML=`<section class="panel achievement-screen" aria-labelledby="achievement-headline">
   <div class="achievement-heading"><h2 id="achievement-headline" tabindex="-1">YOU DID IT, WESLEY!</h2><p>Your whole sloth crew is celebrating!</p></div>
   <div class="achievement-hero-art" aria-label="Boffy, Rocky, Chilly, Sunny, and Zippy celebrating together" role="img" data-art-slot="phase3-group-illustration">${crew.map(name=>`<img src="${asset(name)}" alt="" class="achievement-crew-${name}" decoding="async">`).join('')}</div>
   <div class="achievement-details"><h3>${info.title}</h3><p>${esc(info.description)}</p><small>${info.note}</small></div>
   <strong class="achievement-shout wood">SHOW DAD HOW AWESOME YOU ARE</strong>
   <div class="achievement-actions"><button id="save-achievement" onclick="saveMyAchievement()" ${ready?'':'disabled'}>SAVE MY ACHIEVEMENT</button><button class="secondary" onclick="achievementHome()">RETURN HOME</button></div>
   <div class="achievement-save-info"><p id="achievement-status" role="status" aria-live="polite">${ready?'Your PNG is ready to share or download.':'Preparing your achievement PNG…'}</p><p>On supported iPhones, choose Save Image in the share sheet.</p><div id="achievement-file-links" hidden></div></div>
  </section>`;
  requestAnimationFrame(()=>{document.getElementById('achievement-headline')?.focus({preventScroll:true});app.scrollTop=0});
  if(!ready&&preparingId!==m.id)prepare(m);
  return;
 }
 if(page==='achievements'){
  app.innerHTML=`<section class="panel achievement-history"><h2>Wesley’s Achievements</h2><p>Revisit and save your celebrations any time.</p>${achievementHistory.milestones.length?achievementHistory.milestones.map(m=>{const info=describe(m);return `<button class="secondary achievement-history-item" onclick="revisitAchievement('${m.id}')"><strong>${info.title}</strong><span>${esc(info.label)}</span></button>`}).join(''):'<p>Complete a quest or reach a Dad-approved goal to earn your first achievement!</p>'}<button onclick="achievementHome()">RETURN HOME</button></section>`;
 }
 if(page==='goals'||page==='rewards')app.innerHTML+='<div class="achievement-revisit"><button class="secondary" onclick="viewAchievements()">🏆 View My Achievements</button></div>';
};
render();
})();
