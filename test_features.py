from playwright.sync_api import sync_playwright
import os

# Create screenshots directory
os.makedirs('/tmp/screenshots/features', exist_ok=True)

# Create a simple test image with text for OCR testing
test_image_path = '/tmp/test_ocr_image.png'

try:
    from PIL import Image, ImageDraw
    # Create test image with clear text
    img = Image.new('RGB', (400, 100), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((50, 30), "Hello World 123", fill='black')
    img.save(test_image_path)
    print("Test image created at:", test_image_path)
except ImportError:
    # Fallback: create a simple PNG manually
    import struct
    import zlib

    def create_simple_png():
        width, height = 100, 50
        # Create white pixels
        raw_data = b''
        for y in range(height):
            raw_data += b'\x00'  # filter byte
            raw_data += b'\xff\xff\xff' * width  # white pixels RGB

        def png_chunk(chunk_type, data):
            chunk = chunk_type + data
            crc = zlib.crc32(chunk) & 0xffffffff
            return struct.pack('>I', len(data)) + chunk + struct.pack('>I', crc)

        png_data = b'\x89PNG\r\n\x1a\n'
        png_data += png_chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0))
        png_data += png_chunk(b'IDAT', zlib.compress(raw_data))
        png_data += png_chunk(b'IEND', b'')

        with open(test_image_path, 'wb') as f:
            f.write(png_data)

    create_simple_png()
    print("Created simple test image (no PIL available)")

results = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 800})

    # ==========================================
    # TEST 1: Language Switching
    # ==========================================
    print("\n" + "="*50)
    print("TEST 1: Language Switching")
    print("="*50)

    try:
        page.goto('http://localhost:3000', timeout=30000)
        page.wait_for_load_state('networkidle', timeout=15000)
        page.screenshot(path='/tmp/screenshots/features/01_home_initial.png')

        # Language switcher uses Globe icon - look for button with Globe SVG
        lang_button = page.locator('button:has(svg.lucide-globe)').first

        if lang_button.is_visible():
            print("  Found language switcher (Globe icon)")
            lang_button.click()
            page.wait_for_timeout(500)

            # Look for English option in dropdown
            en_option = page.locator('[role="menuitem"]:has-text("English")')
            if en_option.count() > 0:
                en_option.click()
                page.wait_for_timeout(1000)
                page.screenshot(path='/tmp/screenshots/features/02_home_english.png')

                # Check page content for English text
                page_text = page.inner_text('body')
                if 'Image to Text' in page_text or 'Upload' in page_text or 'Convert' in page_text:
                    print("  ✓ Switched to English successfully")
                    results.append({'test': 'Language Switch to English', 'status': 'OK'})
                else:
                    results.append({'test': 'Language Switch to English', 'status': 'PARTIAL'})
            else:
                results.append({'test': 'Language Switch', 'status': 'FAILED', 'error': 'English option not found'})

            # Switch back to Chinese
            page.wait_for_timeout(500)
            lang_button.click()
            page.wait_for_timeout(500)
            zh_option = page.locator('[role="menuitem"]:has-text("中文")')
            if zh_option.count() > 0:
                zh_option.click()
                page.wait_for_timeout(1000)
                page.screenshot(path='/tmp/screenshots/features/03_home_chinese.png')
                print("  ✓ Switched back to Chinese")
                results.append({'test': 'Language Switch to Chinese', 'status': 'OK'})
        else:
            print("  ✗ Language switcher not found")
            results.append({'test': 'Language Switch', 'status': 'FAILED', 'error': 'Globe button not found'})

    except Exception as e:
        print(f"  ✗ Language test error: {str(e)[:100]}")
        results.append({'test': 'Language Switch', 'status': 'ERROR', 'error': str(e)[:100]})

    # ==========================================
    # TEST 2: Chat Widget
    # ==========================================
    print("\n" + "="*50)
    print("TEST 2: Chat Widget")
    print("="*50)

    try:
        page.goto('http://localhost:3000', timeout=30000)
        page.wait_for_load_state('networkidle', timeout=15000)

        # Chat button is fixed at bottom-right with MessageCircle icon
        chat_button = page.locator('button.fixed:has(svg.lucide-message-circle)')

        if chat_button.count() > 0 and chat_button.first.is_visible():
            print("  Found chat button")
            chat_button.first.click()
            page.wait_for_timeout(1000)

            page.screenshot(path='/tmp/screenshots/features/04_chat_open.png')

            # Check if chat window opened (Card with "Chat Support" title)
            chat_window = page.locator('div.fixed:has-text("Chat Support")')
            if chat_window.count() > 0:
                print("  ✓ Chat window opened")

                # Find input and send a message
                chat_input = page.locator('div.fixed input[placeholder*="message"]')
                if chat_input.count() > 0:
                    chat_input.fill("Hello, how to use?")
                    page.wait_for_timeout(300)

                    # Click send button
                    send_btn = page.locator('div.fixed button[type="submit"]')
                    if send_btn.count() > 0:
                        send_btn.click()
                        page.wait_for_timeout(1500)  # Wait for response

                        page.screenshot(path='/tmp/screenshots/features/05_chat_message.png')

                        # Check if response appeared
                        messages = page.locator('div.fixed .whitespace-pre-wrap')
                        if messages.count() > 1:  # More than just welcome message
                            print("  ✓ Chat response received")
                            results.append({'test': 'Chat Widget', 'status': 'OK'})
                        else:
                            results.append({'test': 'Chat Widget', 'status': 'PARTIAL', 'note': 'Message sent but no response'})
                    else:
                        results.append({'test': 'Chat Widget', 'status': 'PARTIAL', 'note': 'Send button not found'})
                else:
                    results.append({'test': 'Chat Widget', 'status': 'PARTIAL', 'note': 'Input not found'})
            else:
                results.append({'test': 'Chat Widget', 'status': 'FAILED', 'error': 'Window did not open'})
        else:
            print("  ✗ Chat button not found")
            results.append({'test': 'Chat Widget', 'status': 'FAILED', 'error': 'Chat button not visible'})

    except Exception as e:
        print(f"  ✗ Chat test error: {str(e)[:100]}")
        results.append({'test': 'Chat Widget', 'status': 'ERROR', 'error': str(e)[:100]})

    # ==========================================
    # TEST 3: OCR Text Recognition
    # ==========================================
    print("\n" + "="*50)
    print("TEST 3: OCR Text Recognition")
    print("="*50)

    try:
        page.goto('http://localhost:3000', timeout=30000)
        page.wait_for_load_state('networkidle', timeout=15000)

        # Find file input
        file_input = page.locator('input[type="file"]')

        if file_input.count() > 0:
            print("  Found file input")
            file_input.set_input_files(test_image_path)
            print("  Uploaded test image")

            page.wait_for_timeout(2000)
            page.screenshot(path='/tmp/screenshots/features/06_ocr_upload.png')

            # Click Convert button
            convert_btn = page.locator('button:has-text("Convert")')
            if convert_btn.count() > 0 and convert_btn.is_visible():
                convert_btn.click()
                print("  Clicked Convert button")

                # Wait for processing (OCR can take a while)
                page.wait_for_timeout(10000)
                page.screenshot(path='/tmp/screenshots/features/07_ocr_processing.png')

                # Check for results - look for "Result" heading or result cards
                result_section = page.locator('h2:has-text("Result")')
                if result_section.count() > 0:
                    print("  ✓ OCR completed - Result section found")

                    # Get the extracted text
                    result_text = page.locator('.whitespace-pre-wrap').first
                    if result_text.count() > 0:
                        extracted = result_text.inner_text()
                        print(f"  Extracted text: {extracted[:50]}...")
                        results.append({'test': 'OCR Recognition', 'status': 'OK', 'output': extracted[:50]})
                    else:
                        results.append({'test': 'OCR Recognition', 'status': 'PARTIAL', 'note': 'Result section but no text'})
                else:
                    # Check if still processing
                    if page.locator('text=Processing').count() > 0:
                        print("  ? Still processing...")
                        results.append({'test': 'OCR Recognition', 'status': 'PARTIAL', 'note': 'Still processing after 10s'})
                    else:
                        # Check for "Done" status
                        done_status = page.locator('span:has-text("Done")')
                        if done_status.count() > 0:
                            print("  ✓ OCR completed (Done status)")
                            results.append({'test': 'OCR Recognition', 'status': 'OK'})
                        else:
                            results.append({'test': 'OCR Recognition', 'status': 'UNKNOWN'})

                page.screenshot(path='/tmp/screenshots/features/08_ocr_result.png', full_page=True)
            else:
                results.append({'test': 'OCR Recognition', 'status': 'FAILED', 'error': 'Convert button not found'})
        else:
            results.append({'test': 'OCR Recognition', 'status': 'FAILED', 'error': 'File input not found'})

    except Exception as e:
        print(f"  ✗ OCR test error: {str(e)[:100]}")
        results.append({'test': 'OCR Recognition', 'status': 'ERROR', 'error': str(e)[:100]})

    # ==========================================
    # TEST 4: Batch Upload
    # ==========================================
    print("\n" + "="*50)
    print("TEST 4: Batch Upload Page")
    print("="*50)

    try:
        page.goto('http://localhost:3000/batch', timeout=30000)
        page.wait_for_load_state('networkidle', timeout=15000)
        page.screenshot(path='/tmp/screenshots/features/09_batch_page.png')

        # Check for batch-specific elements
        page_text = page.inner_text('body')
        file_input = page.locator('input[type="file"]')

        if file_input.count() > 0:
            multiple_attr = file_input.get_attribute('multiple')
            print(f"  File input found, multiple={multiple_attr}")
            results.append({'test': 'Batch Upload Page', 'status': 'OK'})
        else:
            results.append({'test': 'Batch Upload Page', 'status': 'PARTIAL'})

    except Exception as e:
        print(f"  ✗ Batch test error: {str(e)[:100]}")
        results.append({'test': 'Batch Upload', 'status': 'ERROR', 'error': str(e)[:100]})

    # ==========================================
    # TEST 5: Image Translator
    # ==========================================
    print("\n" + "="*50)
    print("TEST 5: Image Translator Page")
    print("="*50)

    try:
        page.goto('http://localhost:3000/image-translator', timeout=30000)
        page.wait_for_load_state('networkidle', timeout=15000)
        page.screenshot(path='/tmp/screenshots/features/10_translator_page.png')

        # Check for language selector elements
        selectors = page.locator('button[role="combobox"], select')
        if selectors.count() >= 2:
            print(f"  ✓ Found {selectors.count()} language selectors")
            results.append({'test': 'Image Translator Page', 'status': 'OK'})
        else:
            results.append({'test': 'Image Translator Page', 'status': 'PARTIAL'})

    except Exception as e:
        print(f"  ✗ Translator test error: {str(e)[:100]}")
        results.append({'test': 'Image Translator', 'status': 'ERROR', 'error': str(e)[:100]})

    # ==========================================
    # TEST 6: QR Scanner
    # ==========================================
    print("\n" + "="*50)
    print("TEST 6: QR Scanner Page")
    print("="*50)

    try:
        page.goto('http://localhost:3000/qr-scanner', timeout=30000)
        page.wait_for_load_state('networkidle', timeout=15000)
        page.screenshot(path='/tmp/screenshots/features/11_qr_scanner.png')

        page_text = page.inner_text('body')
        if 'QR' in page_text or 'qr' in page_text.lower() or '二维码' in page_text:
            print("  ✓ QR Scanner page loaded")
            results.append({'test': 'QR Scanner Page', 'status': 'OK'})
        else:
            results.append({'test': 'QR Scanner Page', 'status': 'PARTIAL'})

    except Exception as e:
        print(f"  ✗ QR Scanner test error: {str(e)[:100]}")
        results.append({'test': 'QR Scanner', 'status': 'ERROR', 'error': str(e)[:100]})

    # ==========================================
    # TEST 7: Star Rating
    # ==========================================
    print("\n" + "="*50)
    print("TEST 7: Star Rating Component")
    print("="*50)

    try:
        page.goto('http://localhost:3000', timeout=30000)
        page.wait_for_load_state('networkidle', timeout=15000)

        # Look for star rating component
        rating_section = page.locator('text=Rate this tool')
        if rating_section.count() > 0:
            print("  ✓ Rating section found")

            # Look for star buttons
            stars = page.locator('button:has(svg.lucide-star)')
            if stars.count() >= 5:
                print(f"  ✓ Found {stars.count()} star buttons")

                # Click 4th star
                stars.nth(3).click()
                page.wait_for_timeout(1000)
                page.screenshot(path='/tmp/screenshots/features/12_rating.png')

                results.append({'test': 'Star Rating', 'status': 'OK'})
            else:
                results.append({'test': 'Star Rating', 'status': 'PARTIAL', 'note': f'Only {stars.count()} stars found'})
        else:
            results.append({'test': 'Star Rating', 'status': 'FAILED', 'error': 'Rating section not found'})

    except Exception as e:
        print(f"  ✗ Rating test error: {str(e)[:100]}")
        results.append({'test': 'Star Rating', 'status': 'ERROR', 'error': str(e)[:100]})

    browser.close()

# Print summary
print("\n" + "="*60)
print("COMPREHENSIVE TEST SUMMARY")
print("="*60)

ok_count = sum(1 for r in results if r['status'] == 'OK')
partial_count = sum(1 for r in results if r['status'] == 'PARTIAL')
error_count = sum(1 for r in results if r['status'] in ['ERROR', 'FAILED', 'UNKNOWN'])

print(f"\nResults: {ok_count} OK, {partial_count} Partial, {error_count} Failed/Error")
print(f"Total tests: {len(results)}")
print(f"Screenshots saved to: /tmp/screenshots/features/")
print()

for r in results:
    status = r['status']
    icon = '✓' if status == 'OK' else ('?' if status == 'PARTIAL' else '✗')
    extra = ''
    if 'note' in r:
        extra = f" - {r['note']}"
    if 'output' in r:
        extra = f" - Output: {r['output']}"
    if 'error' in r:
        extra = f" - {r['error']}"
    print(f"  {icon} {r['test']}: {status}{extra}")

print("\n" + "="*60)
