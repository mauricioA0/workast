const express = require('express');
const userRoutes = require('./server/user/user.route');
const authRoutes = require('./server/auth/auth.route');
const articleRoutes = require('./server/article/article.route');
const expressJwt = require('express-jwt');
const config = require('./config/config');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount user routes at /users
router.use('/users', expressJwt({ secret: config.jwtSecret }), userRoutes);

// mount auth routes at /articles
router.use('/articles', expressJwt({ secret: config.jwtSecret }), articleRoutes);

module.exports = router;
