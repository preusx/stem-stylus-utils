var testRunnerConfig = {
  describe: 'Stem stylus utils',
  stylus: {
    use: require('./index')(),
    import: 'index'
  }
}

require('stylus-test-runner')(testRunnerConfig)