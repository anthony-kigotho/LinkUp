// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import 'cypress-file-upload'

Cypress.Commands.add('login', (username, password) => {
    cy.visit('http://127.0.0.1:5500/client/landing/index.html');
    cy.wait(2000);
    cy.get('[data-cy="login"]').click();
    cy.get('#username').type(username, { delay: 200 });
    cy.get('#password').type(password, { delay: 200 });
    cy.get('#sign-in').click();
  });
  