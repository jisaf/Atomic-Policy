from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("http://localhost:5173/")

    # Create first atom (Source text)
    page.get_by_role("button", name="Add Atom").click()
    expect(page.get_by_role("heading", name="Create New Atom")).to_be_visible()
    atom_type_form_control = page.locator("div.MuiFormControl-root:has-text('Atom Type')")
    expect(atom_type_form_control.get_by_role("combobox")).to_have_text("Source text")
    page.get_by_label("Bill Number").fill("123")
    page.get_by_label("Congress").fill("118")
    page.get_by_role("button", name="Fetch Bill Title").click()
    first_atom_title = "HR123 - To authorize a pilot program under section 258 of the National Housing Act to establish an automated process for providing additional credit rating information for mortgagors and prospective mortgagors under certain mortgages."
    expect(page.get_by_label("Title (auto-generated)")).to_have_value(first_atom_title, timeout=10000)
    page.get_by_role("button", name="Create").click()
    expect(page.get_by_text(first_atom_title)).to_be_visible()

    # Create second atom (Plain language)
    page.get_by_role("button", name="Add Atom").click()
    expect(page.get_by_role("heading", name="Create New Atom")).to_be_visible()
    atom_type_form_control = page.locator("div.MuiFormControl-root:has-text('Atom Type')")
    expect(atom_type_form_control.get_by_role("combobox")).to_have_text("Plain language interpretation")
    second_atom_title = "Plain Language Title"
    page.get_by_label("Title").fill(second_atom_title)
    page.get_by_label("Content").fill("This is the plain language content.")
    expect(page.locator("ul.MuiList-root").get_by_text(first_atom_title)).to_be_visible()
    page.get_by_role("button", name="Create").click()
    expect(page.get_by_text(second_atom_title)).to_be_visible()

    # Create third atom (Pseudo code)
    page.get_by_role("button", name="Add Atom").click()
    expect(page.get_by_role("heading", name="Create New Atom")).to_be_visible()
    atom_type_form_control = page.locator("div.MuiFormControl-root:has-text('Atom Type')")
    expect(atom_type_form_control.get_by_role("combobox")).to_have_text("Pseudo code")
    third_atom_title = "Pseudo Code Title"
    page.get_by_label("Title").fill(third_atom_title)
    page.get_by_label("Content").fill("This is the pseudo code content.")
    expect(page.locator("ul.MuiList-root").get_by_text(second_atom_title)).to_be_visible()
    expect(page.locator("ul.MuiList-root").get_by_text(first_atom_title)).not_to_be_visible()
    page.get_by_role("button", name="Create").click()
    expect(page.get_by_text(third_atom_title)).to_be_visible()

    # Create fourth atom (Implementation)
    page.get_by_role("button", name="Add Atom").click()
    expect(page.get_by_role("heading", name="Create New Atom")).to_be_visible()
    atom_type_form_control = page.locator("div.MuiFormControl-root:has-text('Atom Type')")
    expect(atom_type_form_control.get_by_role("combobox")).to_have_text("Implementation")
    fourth_atom_title = "Implementation Title"
    page.get_by_label("Title").fill(fourth_atom_title)
    page.get_by_label("File Path or URL").fill("path/to/file.js")
    expect(page.locator("ul.MuiList-root").get_by_text(third_atom_title)).to_be_visible()
    page.get_by_role("button", name="Create").click()
    expect(page.get_by_text(fourth_atom_title)).to_be_visible()

    # Create fifth atom (Source text, should have pre-filled bill info)
    page.get_by_role("button", name="Add Atom").click()
    expect(page.get_by_role("heading", name="Create New Atom")).to_be_visible()
    atom_type_form_control = page.locator("div.MuiFormControl-root:has-text('Atom Type')")
    expect(atom_type_form_control.get_by_role("combobox")).to_have_text("Source text")
    expect(page.get_by_label("Bill Number")).to_have_value("123")
    expect(page.get_by_label("Congress")).to_have_value("118")
    expect(page.locator("ul.MuiList-root").get_by_text(fourth_atom_title)).to_be_visible()

    # Link atoms for flowchart view
    page.get_by_role("button", name="Close").click() # Close the create modal
    page.locator("div.MuiCard-root:has-text('HR123')").click()
    link_atom_form_control = page.locator("div.MuiFormControl-root:has-text('Link another atom')")
    link_atom_form_control.get_by_role("combobox").click()
    page.get_by_role("option", name="Plain Language Title").click()
    page.get_by_test_id("CloseIcon").click()

    # Switch to flowchart view
    page.get_by_role("button", name="Flow").click()

    # Take a screenshot of the flowchart
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
