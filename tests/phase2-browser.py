"""Integration checks with real approved art, Canvas PNG, and simulated native sharing."""
import os,threading
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright,expect
from PIL import Image
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),Quiet)
threading.Thread(target=server.serve_forever,daemon=True).start()
output=Path('/tmp/boffy-phase2-tests');output.mkdir(exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,accept_downloads=True)
    context.add_init_script('''window.pngText=[];window.pngImages=0;
      const write=CanvasRenderingContext2D.prototype.fillText;
      CanvasRenderingContext2D.prototype.fillText=function(text,...args){window.pngText.push(text);return write.call(this,text,...args)};
      const draw=CanvasRenderingContext2D.prototype.drawImage;
      CanvasRenderingContext2D.prototype.drawImage=function(...args){window.pngImages++;return draw.apply(this,args)};
    ''')
    context.route('https://fonts.googleapis.com/**',lambda route:route.abort())
    page=context.new_page();errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    url=f'http://127.0.0.1:{server.server_port}/index.html'
    page.goto(url)
    # Goal crossing from a real Dad Review approval.
    page.evaluate('''() => {for(let i=0;i<11;i++)entries['0-'+i]={course:0,n:i,answer:String(problem(0,i).ans),correct:true,approved:i<9};save();review()}''')
    page.locator('#dad-passcode').fill('7979');page.get_by_role('button',name='🔓 Unlock',exact=True).click()
    page.get_by_role('button',name='✓ Approve',exact=True).first.click()
    expect(page.locator('#achievement-headline')).to_have_text('YOU DID IT, WESLEY!')
    expect(page.locator('.achievement-details h3')).to_have_text('GOAL ACHIEVED!')
    expect(page.locator('#save-achievement')).to_be_enabled(timeout=15000)
    assert page.locator('.achievement-hero-art img').count()==5
    assert page.evaluate('pngImages')==5
    png_text=' '.join(page.evaluate('pngText'))
    for text in ['YOU DID IT, WESLEY!','Your whole sloth crew is celebrating!','GOAL ACHIEVED!','1 Boffy card','SHOW DAD HOW AWESOME YOU ARE']:assert text in png_text,text
    page.screenshot(path=str(output/'celebration-mobile.png'))
    # Real PNG download fallback.
    page.evaluate("Object.defineProperty(navigator,'canShare',{configurable:true,value:undefined})")
    with page.expect_download() as download:
        page.get_by_role('button',name='SAVE MY ACHIEVEMENT',exact=True).click()
    png_path=output/'goal-achievement.png';download.value.save_as(png_path)
    with Image.open(png_path) as png:
        assert png.format=='PNG' and png.size==(1600,2000)
        assert len(png.getcolors(png.width*png.height))>10000
    expect(page.get_by_role('link',name='Open PNG',exact=True)).to_be_visible()
    # Native share is invoked with a PNG File directly in a user gesture.
    page.evaluate('''() => {
      Object.defineProperty(navigator,'canShare',{configurable:true,value:data=>data.files[0].type==='image/png'});
      Object.defineProperty(navigator,'share',{configurable:true,value:data=>{window.shared={name:data.files[0].name,size:data.files[0].size,type:data.files[0].type,active:navigator.userActivation.isActive};return Promise.resolve()}});
    }''')
    page.get_by_role('button',name='SAVE MY ACHIEVEMENT',exact=True).click()
    shared=page.evaluate('shared');assert shared['active'] and shared['type']=='image/png' and shared['size']>100000,shared
    expect(page.locator('#achievement-status')).to_contain_text('Shared!')
    # User cancel stays on screen, with no surprise download.
    page.evaluate("Object.defineProperty(navigator,'share',{configurable:true,value:()=>Promise.reject(new DOMException('Canceled','AbortError'))})")
    page.get_by_role('button',name='SAVE MY ACHIEVEMENT',exact=True).click()
    expect(page.locator('#achievement-status')).to_contain_text('Sharing canceled')
    # Share rejection falls back to the PNG.
    page.evaluate("Object.defineProperty(navigator,'share',{configurable:true,value:()=>Promise.reject(new DOMException('Unavailable','NotAllowedError'))})")
    with page.expect_download():page.get_by_role('button',name='SAVE MY ACHIEVEMENT',exact=True).click()
    # Layout: both actions fit above fixed nav, including fallback links and long text.
    def check_layout(label):
        nav=page.locator('#boffy-nav').bounding_box()
        for name in ['SAVE MY ACHIEVEMENT','RETURN HOME']:
            box=page.get_by_role('button',name=name,exact=True).bounding_box()
            assert box['height']>=44,(label,name,box)
            assert box['y']>=0 and box['y']+box['height']<=nav['y'],(label,name,box,nav)
        assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth'),label
        assert page.locator('.achievement-screen').evaluate('(e)=>e.scrollHeight<=e.clientHeight+1'),(label,page.locator('.achievement-screen').evaluate('(e)=>({height:e.clientHeight,scroll:e.scrollHeight,children:[...e.children].map(c=>({class:c.className,h:c.getBoundingClientRect().height}))})'))
    for width,height in [(320,568),(375,667),(390,844),(430,932),(844,390),(568,320),(768,1024),(1280,900)]:
        page.set_viewport_size({'width':width,'height':height});check_layout((width,height))
    page.set_viewport_size({'width':390,'height':844})
    page.get_by_role('button',name='RETURN HOME',exact=True).click();assert page.evaluate('page')=='welcome'
    page.reload();assert page.evaluate('page')=='welcome'
    page.evaluate('review()');page.locator('#dad-passcode').fill('7979');page.get_by_role('button',name='🔓 Unlock',exact=True).click()
    page.get_by_role('button',name='✓ Approve',exact=True).click();assert page.evaluate('page')=='review'
    assert page.evaluate('achievementHistory.milestones.length')==1
    # Revisit from existing navigation and a fresh PNG.
    page.get_by_role('button',name='Rewards',exact=True).click();page.get_by_role('button',name='🏆 View My Achievements',exact=True).click()
    page.locator('.achievement-history-item').click();expect(page.locator('#save-achievement')).to_be_enabled(timeout=15000)
    # Each quest's final answer shows its own celebration immediately.
    for c,name in enumerate(['Geometry Quest','Fractions Force','Number Sense','Word Problem Trail']):
        page.evaluate('''c=>{for(let i=0;i<999;i++)entries[c+'-'+i]={course:c,n:i,answer:String(problem(c,i).ans),correct:true,approved:false};choose(c)}''',c)
        page.locator('#answer').fill(str(page.evaluate('problem(course,n).ans')))
        page.get_by_role('button',name='✓ SUBMIT',exact=True).click()
        expect(page.locator('.achievement-details h3')).to_have_text('QUEST CHAMPION!')
        expect(page.locator('.achievement-details p')).to_contain_text(name)
        expect(page.locator('#save-achievement')).to_be_enabled(timeout=15000)
    assert page.evaluate('achievementHistory.milestones.length')==5
    page.reload();assert page.evaluate('page')=='welcome'
    assert page.evaluate('achievementHistory.milestones.length')==5
    # Long custom goal/reward text is fully included in PNG; buttons remain visible.
    page.evaluate('''()=>{achievementHistory.milestones.push({id:'goal:4000',type:'goal',target:4000,name:'N'.repeat(80),reward:'R'.repeat(140)});save();revisitAchievement('goal:4000')}''')
    expect(page.locator('#save-achievement')).to_be_enabled(timeout=15000)
    for width,height in [(320,568),(390,844),(568,320)]:
        page.set_viewport_size({'width':width,'height':height});check_layout(('long text',width,height))
    # Image failure is visible and retry works without losing the milestone.
    page.route('**/assets/boffy-a01.png',lambda route:route.abort())
    page.reload();page.evaluate("revisitAchievement('goal:4000')")
    expect(page.locator('#achievement-status')).to_contain_text('could not be prepared',timeout=15000)
    page.unroute('**/assets/boffy-a01.png');page.get_by_role('button',name='SAVE MY ACHIEVEMENT',exact=True).click()
    expect(page.locator('#achievement-status')).to_contain_text('Your PNG is ready',timeout=15000)
    # Reset clears milestones too, keeps configured goal; no resurrection on reload.
    page.evaluate('review()');page.locator('#dad-passcode').fill('7979');page.get_by_role('button',name='🔓 Unlock',exact=True).click()
    page.evaluate('setGoal()');saved_goal=page.evaluate('JSON.stringify(goal)')
    page.on('dialog',lambda dialog:dialog.accept());page.get_by_role('button',name='🗑️ Reset All Progress',exact=True).click()
    assert page.evaluate('achievementHistory.milestones.length')==0
    assert page.evaluate('Object.keys(entries).length')==0
    assert page.evaluate('JSON.stringify(goal)')==saved_goal
    page.reload();assert page.evaluate('achievementHistory.milestones.length')==0
    assert not errors,errors
    print('PASS: goal + four quests, PNG 1600×2000 with all five approved assets/text, native-share gesture/file, cancel/error/download fallback, history/reload/reset, Return Home, image retry; eight viewports and long text. Artifacts:',output)
    browser.close()
server.shutdown()
