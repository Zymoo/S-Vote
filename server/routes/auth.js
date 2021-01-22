const {authJwt, verifySignUp} = require('../utilities/middleware');
const controller = require('../controllers/auth');
const express = require('express');
const router = express.Router();

router.post(
    '/signup',
    [
      authJwt.verifyToken,
      authJwt.isOrganizer,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup,
);

router.post('/signin', controller.signin);

module.exports = router;
