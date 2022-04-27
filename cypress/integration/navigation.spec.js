const { describe } = require("eslint/lib/testers/rule-tester");

describe("Navigation", () => {
  it("should visit root", () => {
    // eslint-disable-next-line no-undef
    cy.visit("/");
  });

  it("should navigate to Tuesday", () => {
    // eslint-disable-next-line no-undef
    cy.visit("/");

    // eslint-disable-next-line no-undef
    cy.contains("li", "Tuesday")
      .click()
      .should("have.class", "day-list__item--selected");
  });
});
