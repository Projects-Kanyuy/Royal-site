// client/src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // This is the trigger: any URL starting with /api will be proxied
    createProxyMiddleware({
      target: 'http://localhost:5000', // The destination: your backend server
      changeOrigin: true,
    })
  );
};