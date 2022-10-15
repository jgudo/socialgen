// postcss.config.js
module.exports = {
  plugins: [
      require('postcss-import'),
      require('postcss-extend'),
      require('postcss-nested'),
      require('autoprefixer'),
      require('tailwindcss'),
  ],
};
