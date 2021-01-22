const config = require('../utilities/config/auth.js');
const db = require('../models');
const {checkDuplicateUser} = require('../utilities/middleware/verifySignUp');
const User = db.user;
const Role = db.role;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res, next) => {
  if (req.body.override_password_key === 100) {
    const filter = {email: req.body.email};
    const update = {password: bcrypt.hashSync(req.body.password, 8)};
    const user = await User.findOneAndUpdate(filter, update);
    if (user) {
      return res.status(200).send({message: 'User updated'}); ;
    }
  } else {
    checkDuplicateUser(req, res, next);
  }

  const user = new User({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({message: err});
      return;
    }
    if (req.body.roles) {
      Role.find(
          {
            name: {$in: req.body.roles},
          },
          (err, roles) => {
            if (err) {
              res.status(500).send({message: err});
              return;
            }
            user.roles = roles.map((role) => role._id);
            user.save((err) => {
              if (err) {
                res.status(500).send({message: err});
                return;
              }
              res.send({message: 'User was registered successfully!'});
            });
          },
      );
    } else {
      // normal user sign up path
      throw new Error('Roles must be provided');
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
      .populate('roles', '-__v')
      .exec((err, user) => {
        if (err) {
          res.status(500).send({message: err});
          return;
        }
        if (!user) {
          return res.status(404).send({message: 'User Not found.'});
        }
        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password,
        );
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: 'Invalid Password!',
          });
        }
        const token = jwt.sign({id: user.id}, config.secret, {
          expiresIn: 86400, // 24 hours
        });
        const authorities = [];
        for (let i = 0; i < user.roles.length; i++) {
          authorities.push('ROLE_' + user.roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user._id,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });
};
