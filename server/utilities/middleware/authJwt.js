const jwt = require('jsonwebtoken');
const config = require('../config/auth.js');
const db = require('../../models');
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(' ')[1];
  if (!token || token === '') {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, config.secret);
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  next();
};

isOrganizer = async (req, res, next) => {
  const user = await User.findById(req.body.userId);
  if (!user) {
    res.status(500).send({message: err});
    return;
  }
  Role.find(
      {
        _id: {$in: user.roles},
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({message: err});
          return;
        }
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'organizer') {
            next();
            return;
          }
        }
        res.status(403).send({message: 'Require Organizer Role!'});
        return;
      },
  );
};

isShareHolder = async (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({message: err});
      return;
    }
    Role.find(
        {
          _id: {$in: user.roles},
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({message: err});
            return;
          }
          for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === 'shareholder') {
              next();
              return;
            }
          }
          res.status(403).send({message: 'Require Shareholder Role!'});
          return;
        },
    );
  });
};

const authJwt = {
  verifyToken,
  isOrganizer,
  isShareHolder,
};
module.exports = authJwt;
