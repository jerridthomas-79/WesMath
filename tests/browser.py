"""Run with python tests/browser.py (Playwright + system Chromium)."""
import threading
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args): pass
server=ThreadingHTTPServer(('127.0.0.1',0),Quiet)
threading.Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
    page=context.new_page()
    errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.route('https://fonts.googleapis.com/**',lambda route:route.abort())
    page.goto(f'http://127.0.0.1:{server.server_port}/index.html')
    page.locator('.a08-play').click()
    assert page.locator('.quest-card').count()==4
    assert page.locator('.a09-count').all_text_contents()==['0 / 1000 completed']*4
    page.locator('.quest-card').first.click()
    question=page.locator('.a03-question-paper').inner_text()
    page.reload()
    page.get_by_role('button',name='Quests',exact=True).click()
    page.locator('.quest-card').first.click()
    assert page.locator('.a03-question-paper').inner_text()==question
    page.get_by_role('button',name='💡 HELP',exact=True).click()
    assert page.locator('#help').is_visible()
    page.locator('#answer').fill(str(page.evaluate('problem(course,n).ans+1')))
    page.get_by_role('button',name='✓ SUBMIT',exact=True).click()
    assert 'TRY AGAIN!' in page.locator('h2').inner_text()
    page.get_by_role('button',name='TRY AGAIN',exact=True).click()
    page.locator('#answer').fill(str(page.evaluate('problem(course,n).ans')))
    page.get_by_role('button',name='✓ SUBMIT',exact=True).click()
    assert page.locator('.a11-status-line').inner_text().endswith('1 / 1000 correct')
    solved=page.evaluate('n')
    page.get_by_role('button',name='NEXT QUESTION ➜',exact=True).click()
    assert page.evaluate('n')!=solved
    page.evaluate('review()')
    page.locator('#dad-passcode').fill('0000')
    page.get_by_role('button',name='🔓 Unlock',exact=True).click()
    assert page.locator('#dad-passcode-error').is_visible()
    page.locator('#dad-passcode').fill('7979')
    page.get_by_role('button',name='🔓 Unlock',exact=True).click()
    page.get_by_role('button',name='✓ Approve',exact=True).click()
    page.get_by_role('button',name='⚙️ Settings',exact=True).click()
    page.locator('#gn').fill('Safari test goal')
    page.locator('#gt').fill('75')
    page.locator('#gr').fill('Boffy reward')
    page.get_by_role('button',name='💾 Save Goal',exact=True).click()
    assert page.locator('.goal-board').is_visible()
    for width,height in [(320,568),(390,844),(844,390),(768,1024),(1280,900)]:
        page.set_viewport_size({'width':width,'height':height})
        for name in ['Home','Quests','Goal','Rewards','Friends']:
            page.get_by_role('button',name=name,exact=True).click()
            assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth'),(width,name)
    page.evaluate('setGoal()')
    page.on('dialog',lambda dialog:dialog.accept())
    page.get_by_role('button',name='🗑️ Reset All Progress',exact=True).click()
    assert page.evaluate('Object.keys(entries).length')==0
    assert page.evaluate('goal.target')==75
    page.reload()
    assert page.evaluate('Object.keys(entries).length')==0
    assert page.evaluate('goal.name')=='Safari test goal'
    assert not errors,errors
    print('PASS: mobile browser submit/retry/reload/HELP/passcode/approval/settings/reset; navigation at five viewport sizes; no script errors.')
    browser.close()
server.shutdown()
