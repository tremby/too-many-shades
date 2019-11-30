module.exports = {
  style: {
    postcss: {
      env: {
        stage: 1,
        features: {
          'color-mod-function': { unresolved: 'warn' },
        },
      },
    },
  },
}
