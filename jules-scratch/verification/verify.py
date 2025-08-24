from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Add a listener for console messages
    page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))

    page.goto("http://localhost:5173")

    # Click the "Add Atom" button
    page.get_by_role("button", name="Add Atom").click()

    # Wait for the modal to appear
    page.wait_for_selector('h2:has-text("Create New Atom")')

    # Select the "Source text" atom type
    page.locator('select').first.select_option('experiment')

    # Fill in the bill details
    page.get_by_placeholder("Congress (e.g., 119)").fill("119")
    page.locator('div.grid > select').select_option('hr')
    page.get_by_placeholder("Bill Number").fill("100")

    # Click the "Fetch Bill Title" button
    page.get_by_role("button", name="Fetch Bill Title").click()

    # Wait for the title to be populated in the readonly input
    page.wait_for_function("() => document.querySelector('input[readonly]').value.startsWith('hr100 - A bill to amend rule 23')", timeout=15000)

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
