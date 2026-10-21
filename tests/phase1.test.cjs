const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
const inline=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n');
function boot(saved,random=Math.random){
 const elements={}; let data=saved?JSON.stringify(saved):null;
 const context={console,Math:Object.assign(Object.create(Math),{random}),Date,Set,Number,Object,String,JSON,
  localStorage:{getItem:()=>data,setItem:(k,v)=>{data=v}},
  document:{getElementById:id=>elements[id]||(elements[id]={innerHTML:'',value:'',style:{},focus(){},classList:{remove(){},add(){},toggle(){}}})},
  alert:()=>{},confirm:()=>true,requestAnimationFrame:f=>f()};
 for(const id of ["answer","dad-passcode","help"])context.document.getElementById(id);
 context.window=context;vm.createContext(context);
 vm.runInContext(fs.readFileSync('questions.js','utf8'),context);
 vm.runInContext(inline,context);vm.runInContext(fs.readFileSync('game.js','utf8'),context);vm.runInContext(fs.readFileSync('achievements.js','utf8'),context);
 return {run:s=>vm.runInContext(s,context),elements,snapshot:()=>JSON.parse(data),context};
}
module.exports={boot};
if(require.main===module){
test('4,000 distinct questions, stable IDs and finite answers',()=>{
 const b=boot();const banks=b.context.BoffyQuestions.banks;
 assert.equal(new Set(banks.flat().map(p=>p.q)).size,4000);
 for(let c=0;c<4;c++){
  assert.equal(banks[c].length,1000);
  banks[c].forEach((p,i)=>{assert.equal(p.id,`${c}-${i}`);assert.ok(Number.isFinite(p.ans));});
 }
 const second=boot();assert.equal(JSON.stringify(banks),JSON.stringify(second.context.BoffyQuestions.banks));
});
test('all number-sense answers checked with independent arithmetic evaluation',()=>{
 const b=boot();for(const p of b.context.BoffyQuestions.banks[2]){
 const expression=p.q.replace(/ = \?$/,'').replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/²/g,'**2').replace(/³/g,'**3').replace(/\[/g,'(').replace(/\]/g,')');
 assert.equal(p.ans,vm.runInNewContext(expression),p.q);
 }
});
test('selection is randomized; pending question resumes after reload',()=>{
 const first=boot(null,()=>0),last=boot(null,()=>0.999999);
 first.run('choose(0)');last.run('choose(0)');
 assert.notEqual(first.run('n'),last.run('n'));
 const saved=last.snapshot(),reload=boot(saved,()=>0);
 reload.run('choose(0)');assert.equal(reload.run('n'),last.run('n'));
});
test('incorrect answers retry; correct answers never repeat through all 1,000 or reload',()=>{
 for(let c=0;c<4;c++){
 const b=boot(null,()=>0);b.run('choose('+c+')');
 b.elements.answer.value='-1';b.run('record()');assert.equal(b.run('completedIn(course)'),0);
 b.run("page='question';render()");assert.equal(b.run('n'),0);
 for(let i=0;i<1000;i++){
  assert.equal(b.run('n'),i);
  b.elements.answer.value=String(b.run('problem(course,n).ans'));b.run('record()');
  assert.equal(b.run('completedIn(course)'),i+1);
  b.run('record()');assert.equal(b.run('completedIn(course)'),i+1);
  b.run('next()');
 }
 assert.equal(b.run('page'),'complete');
 const reload=boot(b.snapshot());reload.run('choose('+c+')');assert.equal(reload.run('page'),'complete');
 reload.run('choose('+((c+1)%4)+')');assert.equal(reload.run('page'),'question');
 }
});
test('local persistence, Dad passcode, approvals, goal/reward and confirmed reset',()=>{
 const b=boot();b.run('choose(2)');b.elements.answer.value=String(b.run('problem(course,n).ans'));b.run('record();review()');
 assert.equal(b.run('page'),'dadUnlock');b.elements['dad-passcode'].value='0000';b.run('unlockDad()');assert.equal(b.run('page'),'dadUnlock');
 b.elements['dad-passcode'].value='7979';b.run('unlockDad()');assert.equal(b.run('page'),'review');
 b.run('approve(course+"-"+n)');assert.equal(b.snapshot().entries[b.run('course+"-"+n')].approved,true);
 b.run('goal={name:"Adventure",target:75,reward:"Special card"};save()');
 const reload=boot(b.snapshot());reload.run('review()');assert.equal(reload.run('page'),'dadUnlock');assert.equal(reload.run('Object.values(entries).filter(e=>e.approved).length'),1);
 b.context.confirm=()=>false;b.run('resetAllProgress()');assert.equal(Object.keys(b.snapshot().entries).length,1);
 b.context.confirm=()=>true;b.run('resetAllProgress()');assert.equal(Object.keys(b.snapshot().entries).length,0);assert.equal(b.snapshot().activeQuestion,null);assert.equal(b.snapshot().goal.target,75);
 b.run('nav()');assert.match(b.elements.app.innerHTML,/\/ 1000 completed/);b.run('choose(2)');assert.equal(b.run('page'),'question');
});
test('legacy duplicate prompts consolidate without losing approved reward credits',()=>{
 const old=boot();const entries={};for(let i=0;i<50;i++){const p=old.context.BoffyQuestions.legacy(1,i);entries['1-'+i]={course:1,n:i,answer:String(p.ans),correct:true,approved:true};}
 const b=boot({entries,goal:{name:'Old goal',target:50,reward:'Old reward'}});
 assert.equal(b.run('completedIn(1)'),20);b.run('goals()');assert.match(b.elements.app.innerHTML,/>50<\/div>/);
 const reload=boot(b.snapshot());reload.run('goals()');assert.match(reload.elements.app.innerHTML,/>50<\/div>/);
 for(let i=0;i<100;i++){reload.run('choose(1)');assert.equal(reload.run('Boolean(entries[course+"-"+n]?.correct)'),false);reload.run('next()');}
});
test('invalid input, corrupted storage, navigation and help remain functional',()=>{
 const b=boot({entries:{bad:{course:10,n:2000,answer:'x'}},goal:null});
 for(const page of ['welcome','courses','goals','rewards','friends']){b.run(`page='${page}';render()`);assert.ok(b.elements.app.innerHTML.length>100);}
 b.run('choose(3)');for(const value of ['', 'NaN','Infinity']){b.elements.answer.value=value;b.run('record()');assert.equal(b.run('page'),'question');}
 b.run('showHelp()');assert.match(b.elements.help.textContent,/Boffy/);
 b.context.localStorage.setItem=()=>{throw new Error('quota')};b.elements.answer.value=String(b.run('problem(course,n).ans'));b.run('record()');assert.equal(b.run('page'),'feedback');assert.equal(b.run('storageWarning'),true);
});

}
