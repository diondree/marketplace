const purgecss = [
  require('@fullhuman/postcss-purgecss'),
  {
    content: ['./components/**/*.js', './pages/**/*.js'],
    defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
  },
];
module.exports = {
  plugins: [
    require('tailwindcss'),
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
    require('postcss-preset-env'),
  ],
};
