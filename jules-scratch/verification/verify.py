from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()


    page.goto("http://localhost:5173/")

    # Click the "Add Atom" button
    page.get_by_role("button", name="Add Atom").click()

    # The modal should be visible
    expect(page.get_by_role("heading", name="Create New Atom")).to_be_visible()

    # It should default to "Source text"
    atom_type_form_control = page.locator("div.MuiFormControl-root:has-text('Atom Type')")
    expect(atom_type_form_control.get_by_role("combobox")).to_have_text("Source text")

    # Open the Atom Type dropdown
    atom_type_form_control.get_by_role("combobox").click()

    # Select "Source text"
    page.get_by_role("option", name="Source text").click()


    # Fill in bill details
    page.get_by_label("Bill Number").fill("123")
    page.get_by_label("Congress").fill("118")

    # Fetch bill title
    page.get_by_role("button", name="Fetch Bill Title").click()
    expected_title = "HR123 - To authorize a pilot program under section 258 of the National Housing Act to establish an automated process for providing additional credit rating information for mortgagors and prospective mortgagors under certain mortgages."
    expect(page.get_by_label("Title (auto-generated)")).to_have_value(expected_title, timeout=10000)

    # Create the atom
    page.get_by_role("button", name="Create").click()

    # Verify the atom is created
    expect(page.get_by_text(expected_title)).to_be_visible()

    # Click "Add Atom" again
    page.get_by_role("button", name="Add Atom").click()

    # Verify the defaults
    atom_type_form_control = page.locator("div.MuiFormControl-root:has-text('Atom Type')")
    expect(atom_type_form_control.get_by_role("combobox")).to_have_text("Plain language interpretation")

    # Check that the new atom is linked to the previous one
    expect(page.locator("ul.MuiList-root").get_by_text(expected_title)).to_be_visible()

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
