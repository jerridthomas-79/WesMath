const {test}=require('node:test');
const assert=require('node:assert/strict');
const {boot}=require('./phase1.test.cjs');
function unlock(b){b.run('review()');b.elements['dad-passcode'].value='7979';b.run('unlockDad()')}
function seed(b,c,count,approved=false){b.run(`for(let i=0;i<${count};i++){entries['${c}-'+i]={course:${c},n:i,answer:String(problem(${c},i).ans),correct:true,approved:${approved}}};save()`)}
function setGoal(b,target,name='Challenge',reward='Boffy card'){
 for(const [id,value] of [['gn',name],['gt',String(target)],['gr',reward]])b.context.document.getElementById(id).value=value;
 b.run('saveGoal()');
}
test('goal crossing interrupts Dad review once; no duplicate credit or repeat on reload',()=>{
 const b=boot();seed(b,0,11);unlock(b);
 for(let i=0;i<9;i++)b.run(`approve('0-${i}')`);
 assert.equal(b.run('page'),'review');assert.equal(b.snapshot().achievements.milestones.length,0);
 b.run("approve('0-9')");assert.equal(b.run('page'),'celebration');
 assert.match(b.elements.app.innerHTML,/YOU DID IT, WESLEY!/);assert.match(b.elements.app.innerHTML,/GOAL ACHIEVED!/);assert.match(b.elements.app.innerHTML,/SHOW DAD HOW AWESOME YOU ARE/);
 assert.equal(b.snapshot().achievements.milestones[0].id,'goal:10');
 const count=b.run('Object.values(entries).filter(e=>e.approved).length');
 b.run("approve('0-9')");assert.equal(b.run('Object.values(entries).filter(e=>e.approved).length'),count);
 b.run("review();approve('0-10')");assert.equal(b.run('page'),'review');assert.equal(b.snapshot().achievements.milestones.length,1);
 const reload=boot(b.snapshot());assert.equal(reload.run('page'),'welcome');
 reload.run("revisitAchievement('goal:10')");assert.equal(reload.run('page'),'celebration');assert.equal(reload.snapshot().achievements.milestones.length,1);
 reload.run('achievementHome()');assert.equal(reload.run('page'),'welcome');
});
test('goal rename/reward edits, lowering and reverting do not celebrate; higher target can be earned',()=>{
 const b=boot();seed(b,0,25);unlock(b);
 for(let i=0;i<10;i++)b.run(`approve('0-${i}')`);
 setGoal(b,10,'New name','New reward');assert.equal(b.run('page'),'goals');assert.equal(b.snapshot().achievements.milestones.length,1);
 b.run("revisitAchievement('goal:10')");assert.match(b.elements.app.innerHTML,/1 Boffy card/);assert.doesNotMatch(b.elements.app.innerHTML,/New reward/);
 setGoal(b,5);assert.equal(b.run('page'),'goals');assert.equal(b.snapshot().achievements.milestones.length,2);
 setGoal(b,20,'Big challenge','Special reward');assert.equal(b.run('page'),'goals');
 b.run('review()');for(let i=10;i<20;i++)b.run(`approve('0-${i}')`);
 assert.equal(b.run('page'),'celebration');assert.match(b.elements.app.innerHTML,/Special reward/);
 setGoal(b,10);b.run("review();approve('0-20')");assert.equal(b.run('page'),'review');assert.equal(b.snapshot().achievements.milestones.length,3);
});
test('all four quests celebrate immediately on final answer without Dad approval, independently',()=>{
 const b=boot(null,()=>0);
 for(let c=0;c<4;c++){
  seed(b,c,999);b.run(`choose(${c})`);assert.equal(b.run('n'),999);
  b.elements.answer.value=String(b.run('problem(course,n).ans'));b.run('record()');
  assert.equal(b.run('page'),'celebration');assert.match(b.elements.app.innerHTML,/QUEST CHAMPION!/);
  assert.match(b.elements.app.innerHTML,new RegExp(['Geometry Quest','Fractions Force','Number Sense','Word Problem Trail'][c]));
  assert.equal(b.snapshot().achievements.milestones.length,c+1);
  b.run('record()');assert.equal(b.snapshot().achievements.milestones.length,c+1);
 }
 assert.equal(b.run('Object.values(entries).filter(e=>e.approved).length'),0);
 const reload=boot(b.snapshot());assert.equal(reload.run('page'),'welcome');
 for(let c=0;c<4;c++){reload.run(`choose(${c})`);assert.equal(reload.run('page'),'complete')}
 reload.run('viewAchievements()');assert.match(reload.elements.app.innerHTML,/Geometry Quest/);
});
test('cancel reset retains milestones; confirmed reset clears all history, entries and export state but preserves goal',()=>{
 const b=boot();seed(b,1,999);b.run('choose(1)');b.elements.answer.value=String(b.run('problem(course,n).ans'));b.run('record()');
 unlock(b);b.context.confirm=()=>false;b.run('resetAllProgress()');assert.equal(b.snapshot().achievements.milestones.length,1);
 setGoal(b,25,'Keep this','Keep reward');b.context.confirm=()=>true;b.run('resetAllProgress()');
 assert.equal(b.snapshot().version,2);assert.equal(b.snapshot().achievements.milestones.length,0);assert.equal(Object.keys(b.snapshot().entries).length,0);assert.equal(b.snapshot().goal.name,'Keep this');
 const reload=boot(b.snapshot());assert.equal(reload.snapshot().achievements.milestones.length,0);reload.run('viewAchievements()');assert.match(reload.elements.app.innerHTML,/first achievement/);
 seed(reload,0,25);unlock(reload);for(let i=0;i<25;i++)reload.run(`approve('0-${i}')`);assert.equal(reload.run('page'),'celebration');assert.equal(reload.snapshot().achievements.milestones[0].id,'goal:25');
});
test('pre-existing Phase 1 progress is retained without automatic celebrations',()=>{
 const initial=boot();seed(initial,2,1000,true);
 const old=initial.snapshot();delete old.achievements;
 const b=boot(old);assert.equal(b.run('page'),'welcome');assert.equal(Object.keys(b.snapshot().entries).length,1000);
 assert.equal(b.snapshot().achievements.milestones.length,2);assert.equal(b.snapshot().goal.target,10);
 b.run('viewAchievements()');assert.match(b.elements.app.innerHTML,/Number Sense/);
 unlock(b);b.run("approve('2-0')");assert.equal(b.run('page'),'review');assert.equal(b.snapshot().achievements.milestones.length,2);
});
test('locked approvals, wrong answers, ordinary saves and missing milestone IDs do not award anything',()=>{
 const b=boot();seed(b,0,10);b.run("approve('0-0')");assert.equal(b.run('page'),'dadUnlock');assert.equal(b.run('entries["0-0"].approved'),false);
 unlock(b);b.run("entries['0-10']={course:0,n:10,answer:'-1',correct:false,approved:false};approve('0-10')");assert.equal(b.run('entries["0-10"].approved'),false);
 b.run("save();revisitAchievement('goal:9999')");assert.equal(b.snapshot().achievements.milestones.length,0);
});
test('crossing beyond the goal threshold celebrates once without modifying answers or rewards',()=>{
 const b=boot();const before=JSON.stringify(b.snapshot().entries);
 b.run('BoffyAchievements.onApproval(8,12);save();render()');assert.equal(b.run('page'),'celebration');assert.equal(b.snapshot().achievements.milestones.length,1);assert.equal(JSON.stringify(b.snapshot().entries),before);
 b.run('achievementHome();BoffyAchievements.onApproval(12,13);save();render()');assert.equal(b.run('page'),'welcome');assert.equal(b.snapshot().achievements.milestones.length,1);
});
