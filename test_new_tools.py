from playwright.sync_api import sync_playwright
import os

os.makedirs('/tmp/screenshots/new-tools', exist_ok=True)

pages = [
    ('/pdf-to-text', 'PDF to Text'),
    ('/text-to-pdf', 'Text to PDF'),
    ('/image-to-pdf', 'Image to PDF'),
    ('/pdf-to-jpg', 'PDF to JPG'),
    ('/text-to-image', 'Text to Image'),
]

results = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 800})

    for path, name in pages:
        url = f'http://localhost:3000{path}'
        print(f'Testing: {name}...')

        try:
            page.goto(url, timeout=30000)
            page.wait_for_load_state('networkidle', timeout=15000)

            # Take screenshot
            screenshot_path = f'/tmp/screenshots/new-tools/{path.replace("/", "")}.png'
            page.screenshot(path=screenshot_path, full_page=True)

            # Check for page title
            title = page.title()

            # Check for main content
            h1 = page.locator('h1').first
            if h1.count() > 0:
                h1_text = h1.inner_text()
                results.append({'page': name, 'status': 'OK', 'h1': h1_text[:40]})
                print(f'  ✓ {name}: OK - "{h1_text[:40]}"')
            else:
                results.append({'page': name, 'status': 'PARTIAL'})
                print(f'  ? {name}: No H1 found')

        except Exception as e:
            results.append({'page': name, 'status': 'ERROR', 'error': str(e)[:50]})
            print(f'  ✗ {name}: {str(e)[:50]}')

    browser.close()

print("\n" + "="*50)
print("NEW TOOLS TEST SUMMARY")
print("="*50)
ok = sum(1 for r in results if r['status'] == 'OK')
print(f"Passed: {ok}/{len(results)}")
print(f"Screenshots: /tmp/screenshots/new-tools/")
