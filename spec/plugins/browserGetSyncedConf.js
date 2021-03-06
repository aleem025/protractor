var env = require('../environment.js'),
    q = require('q');

// Make sure that borwser-related plugin hooks work with browser sync on
exports.config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'jasmine',

  // Spec patterns are relative to this directory.
  specs: [
    'specs/browser_get_wait_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl + '/ng1/',

  // Plugin patterns are relative to this directory.
  plugins: [{
    inline: {
      onPageLoad: function() {
        return q.delay(5000).then(function() {
          protractor.ON_PAGE_LOAD = true;
        });
      },
      onPageStable: function() {
        if (protractor.ON_PAGE_LOAD) {
          this.addSuccess();
        } else {
          this.addFailure(
              'onPageLoad did not finish before onPageStable began');
        }
        return q.delay(5000).then(function() {
          protractor.ON_PAGE_SYNC = true;
        });
      },
      teardown: function() {
        if (protractor.ON_PAGE_SYNC) {
          this.addSuccess();
        } else {
          this.addFailure('onPageStable did not finish before teardown');
        }
      }
    }
  }]
};
