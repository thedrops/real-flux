const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.user;
const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    console.log('Received signup request with body:', {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password ? '[REDACTED]' : undefined
    });

    if (!req.body.name || !req.body.email || !req.body.password) {
      return res.status(400).send({
        message: "Missing required fields",
        required: ['name', 'email', 'password'],
        received: Object.keys(req.body)
      });
    }

    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    };

    console.log('Attempting to create user with data:', { ...userData, password: '[REDACTED]' });

    const user = await User.create(userData);
    console.log('User created successfully:', { id: user.id, name: user.name, email: user.email });

    res.send({ 
      message: "User registered successfully!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).send({
        message: "Validation error",
        errors: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).send({
        message: "Email already exists",
        field: 'email'
      });
    }
    res.status(500).send({ message: error.message });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!"
      });
    }

    const token = jwt.sign({ id: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      {
        expiresIn: 86400 // 24 hours
      });

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: token
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.post('/logout', (req, res) => {
  res.send({ message: "User logged out successfully!" });
});


module.exports = router;
