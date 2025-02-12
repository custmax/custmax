module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-px-to-viewport': {
      unitToConvert: 'vpx',
      viewportWidth: 1920,
      viewportUnit: 'vw',
    }
  },
};
