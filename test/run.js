var testRunnerConfig = {
  describe: 'Stem stylus utils',
  stylus: {
    use: function plugin(stylus) {
      stylus.include(__dirname + '../lib');
      stylus.include(__dirname + '../');
    },
    import: [
      '../bower_components/stem-stylus-extensions',
      '../index',
    ],
  }
}

require('stylus-test-runner')(testRunnerConfig)