from playwright.sync_api import sync_playwright
import os

# Create screenshots directory
os.makedirs('/tmp/screenshots', exist_ok=True)

# Define all pages to test
pages_to_test = [
    ('/', 'home'),
    ('/batch', 'batch'),
    ('/image-translator', 'image-translator'),
    ('/jpg-to-word', 'jpg-to-word'),
    ('/jpg-to-excel', 'jpg-to-excel'),
    ('/pdf-to-excel', 'pdf-to-excel'),
    ('/pdf-to-word', 'pdf-to-word'),
    ('/qr-scanner', 'qr-scanner'),
    ('/history', 'history'),
    ('/pricing', 'pricing'),
    ('/dashboard', 'dashboard'),
    ('/login', 'login'),
]

results = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 800})

    for path, name in pages_to_test:
        url = f'http://localhost:3000{path}'
        print(f'Testing: {url}')

        try:
            page.goto(url, timeout=30000)
            page.wait_for_load_state('networkidle', timeout=15000)

            # Take screenshot
            screenshot_path = f'/tmp/screenshots/{name}.png'
            page.screenshot(path=screenshot_path, full_page=True)

            # Get page title
            title = page.title()

            # Check if page has main content (not error page)
            has_content = page.locator('main, .container, [class*="content"]').count() > 0

            results.append({
                'page': name,
                'url': url,
                'status': 'OK',
                'title': title,
                'screenshot': screenshot_path
            })
            print(f'  ✓ {name}: OK')

        except Exception as e:
            results.append({
                'page': name,
                'url': url,
                'status': 'ERROR',
                'error': str(e)
            })
            print(f'  ✗ {name}: {str(e)[:50]}')

    browser.close()

# Print summary
print('\n' + '='*50)
print('TEST SUMMARY')
print('='*50)
success = sum(1 for r in results if r['status'] == 'OK')
print(f'Passed: {success}/{len(results)}')
print(f'Screenshots saved to: /tmp/screenshots/')

for r in results:
    status_icon = '✓' if r['status'] == 'OK' else '✗'
    print(f"  {status_icon} {r['page']}: {r['status']}")
