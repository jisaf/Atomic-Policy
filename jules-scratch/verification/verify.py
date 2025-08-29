from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()
    page.goto("http://localhost:5173/")
    page.get_by_role("button", name="Add Atom").click()

    page.wait_for_timeout(1000)
    page.get_by_label("Bill Number").click()
    page.get_by_label("Bill Number").fill("1")

    page.get_by_role("button", name="Manual Entry").click()

    page.wait_for_timeout(1000)

    bill_title_input = page.get_by_placeholder("Enter Bill Title")
    expect(bill_title_input).to_be_visible()
    bill_title_input.click()
    bill_title_input.fill("A manually entered title")

    atom_title_input = page.get_by_placeholder("Enter Atom Title")
    expect(atom_title_input).to_have_value("HR1 - A manually entered title")

    page.screenshot(path="jules-scratch/verification/manual-entry-test.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
