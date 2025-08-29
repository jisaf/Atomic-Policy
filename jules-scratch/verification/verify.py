from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("http://localhost:5173/")

    # Switch to flowchart view
    page.get_by_label("flowchart view").click()

    # Create first atom (experiment)
    page.get_by_role("button", name="Add Atom").click()
    expect(page.get_by_role("heading", name="Create New Atom")).to_be_visible()
    page.get_by_label("Bill Number").fill("12345")
    page.get_by_role("button", name="Manual Entry").click()
    expect(page.get_by_label("Bill Title")).to_be_visible()
    page.get_by_label("Bill Title").fill("A Bill About Something")
    page.get_by_label("Atom Title").fill("First Atom")
    page.get_by_role("button", name="Create").click()
    expect(page.get_by_role("heading", name="Create New Atom")).to_be_hidden()

    # Create second atom (fact)
    page.get_by_role("button", name="Add Atom").click()
    expect(page.get_by_role("heading", name="Create New Atom")).to_be_visible()
    page.get_by_test_id("atom-type-select").click()
    page.get_by_role("option", name="Plain language interpretation").click()
    page.get_by_label("Title").fill("Second Atom")
    page.get_by_label("Content").fill("This is the second atom.")
    page.get_by_role("button", name="Create").click()
    expect(page.get_by_role("heading", name="Create New Atom")).to_be_hidden()

    # Create third atom (insight)
    page.get_by_role("button", name="Add Atom").click()
    expect(page.get_by_role("heading", name="Create New Atom")).to_be_visible()
    page.get_by_test_id("atom-type-select").click()
    page.get_by_role("option", name="Pseudo code").click()
    page.get_by_label("Title").fill("Third Atom")
    page.get_by_label("Content").fill("This is the third atom.")
    page.get_by_role("button", name="Create").click()
    expect(page.get_by_role("heading", name="Create New Atom")).to_be_hidden()

    # Link atoms
    # Click on the first atom to open the detail modal
    page.get_by_text("First Atom").click()
    expect(page.get_by_role("heading", name="First Atom")).to_be_visible()
    page.get_by_test_id("link-atom-select").click()
    page.get_by_role("option", name="Second Atom").click()
    # After linking, the modal should still be open. We close it manually.
    page.locator('body').press('Escape')
    expect(page.get_by_role("heading", name="First Atom")).to_be_hidden()

    # Click on the second atom to open the detail modal
    page.get_by_text("Second Atom").click()
    expect(page.get_by_role("heading", name="Second Atom")).to_be_visible()
    page.get_by_test_id("link-atom-select").click()
    page.get_by_role("option", name="Third Atom").click()
    page.locator('body').press('Escape')
    expect(page.get_by_role("heading", name="Second Atom")).to_be_hidden()

    page.screenshot(path="jules-scratch/verification/flowchart.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
