const express = require('express');
const next = require('next');
const path = require('path');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Serve static files
  server.use('/avatars', express.static(path.join(__dirname, 'public/avatars')));
  server.use('/foods', express.static(path.join(__dirname, 'public/foods')));
  server.use('/images', express.static(path.join(__dirname, 'public/images')));

  // server.use('/foods', (req, res, next) => {
  //   res.set('Cache-Control', 'no-store'); // Disable caching
  //   express.static(path.join(__dirname, 'public/foods'))(req, res, next);
  // });

  // All other requests are handled by Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3002, (err) => {
    if (err) throw err;
    console.log("++++++++++++++++++++++++++++++++\n");
    console.log('> Ready on http://localhost:3002 \n');
    console.log("++++++++++++++++++++++++++++++++");
  });
});
