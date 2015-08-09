var testRunnerConfig = {
  describe: 'Stem stylus utils',
  stylus: {
    use: function plugin(stylus) {
      stylus.include(__dirname + '../atom');
      stylus.include(__dirname + '../');
    },
    import: '../index'
  }
}

require('stylus-test-runner')(testRunnerConfig)