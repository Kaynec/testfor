module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{css,ico,ttf,woff,eot,woff2,png,svg,jpg,html,js,json,txt}'
  ],
  swDest: 'dist/sw.js',
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  runtimeCaching: [
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|json)$/,
      handler: 'StaleWhileRevalidate'
    }
  ]
};
