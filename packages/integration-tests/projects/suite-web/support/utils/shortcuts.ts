/**
 * Shortcut to click device menu
 */
export const toggleDeviceMenu = () => {
    return cy.getTestElement('@menu/switch-device').click();
};


export const goToOnboarding = () => {
    cy.task('startEmu', { version: '2.1.4', wipe: true });
    cy.getTestElement('@onboarding/continue-button').click();
    cy.getTestElement('@onboarding/continue-button').click();

};

export const passThroughInitialRun = () => {
    return cy
        .getTestElement('@onboarding/continue-button')
        .click()
        .getTestElement('@onboarding/exit-app-button')
        .click()
        .getTestElement('@suite/loading')
        .should('not.exist');
};

export const passThroughBackup = () => {
    cy.log('Backup button should be disabled until all checkboxes are checked');
    cy.getTestElement('@backup/start-button').should('be.disabled');

     cy.getTestElement('@backup/check-item/wrote-seed-properly').click();
    cy.getTestElement('@backup/check-item/made-no-digital-copy').click();
    cy.getTestElement('@backup/check-item/will-hide-seed').click();

    cy.log('Create backup on device');
    cy.getTestElement('@backup/start-button').click();
    cy.getTestElement('@onboarding/confirm-on-device');
    cy.task('readAndConfirmMnemonicEmu');

    cy.getTestElement('@backup/close-button').click();
};

export const passThroughInitMetadata = (provider: 'dropbox' | 'google') => {
    cy.getConfirmActionOnDeviceModal();
    cy.task('pressYes');
    cy.getTestElement('@modal/metadata-provider').should('be.visible')
    cy.getTestElement(`@modal/metadata-provider/${provider}-button`).click();
    cy.getTestElement('@modal/metadata-provider').should('not.exist');
};

export const passThroughSetPin = () => {
    cy.getTestElement('@onboarding/set-pin-button').click();
    cy.getTestElement('@suite/modal/confirm-action-on-device');
    cy.task('pressYes');
    cy.task('inputEmu', '1');
    cy.task('inputEmu', '1');
    cy.task('pressYes');
    cy.getTestElement('@onboarding/pin/continue-button').click();

};
