var chai = require('chai');

describe("Homepage Calendar", function() {
    it("should have a calender ", function() {
        browser.url('http://localhost:3000/');
        expect(browser.getText(".fc-toolbar")).to.equal("December 2016\nTODAY");
    });
});