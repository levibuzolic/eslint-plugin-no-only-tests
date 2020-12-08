const cy = {
  server: () => {},
  get: () => {},
}


describe.only("The audio conversion portion of the manual page", function() {
    before(() => {
        cy.server()
    })

    it.only(`can play the received source audio`, () => {
        cy.get(`source-audio-player`)
    })
})
