const express = require('express');
const router = express.Router()

const { hash, compare } = require('bcryptjs');
// const { verify } = require('jsonwebtoken');

const { LoginModel, Project, Todo} = require('../models/Models');

router.get('/', async (req, res) => {
  res.send('Hello Express!! 👋, this is Auth end point')
})

router.post('/signup', async (req, res) => {
  try {
    const { username: userName = "", password = "" } = req.body;
    const userDetails = await LoginModel.findOne({ userName });
    if (userDetails) {
      return res.status(500).json({
        message: "User already exists. Try login",
        type: 'warning'
      });
    }

    const passwordHash = await hash(password, 10);

    const newSignup = new LoginModel({
      userName,
      password: passwordHash
    });

    await newSignup.save();
    res.status(201).json(newSignup);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  const { username: userName, password } = req.body;
  const userDetails = await LoginModel.findOne({ userName });
  if (userDetails) {
    const isMatch = await compare(password, userDetails.password);
    console.log("match", isMatch)
    if (!isMatch) {
      return res.status(500).json({ message: "Password incorrect", userDetails });
    }

    userDetails.verified = isMatch;
    await userDetails.save();

    return res.status(201).json({ message: "User Logged in Successfully", userDetails });
  }
  else {
    res.status(404).send({ message: "User not exists please Sign up and then log in" });
  }
});

router.get('/projectlist', async (req, res) => {
  try {
    console.log(req.query.userName)
    if (req.query) {
      const projectList = await Project.find();
      return res.json(projectList);
    }
    return res.status(500).json({
      message: 'You are not logged in! 😢',
      type: 'error',
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/todolist', async (req, res) => {
    try {
      console.log(req.query.userName)
      if (req.query) {
        const todoList = await Todo.find();
        return res.json(todoList);
      }
      return res.status(500).json({
        message: 'You are not logged in! 😢',
        type: 'error',
      })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.post('/logout', async (req, res) => {
//   res.clearCookie("refreshToken");
  return res.json({
    message: "Logged out successfully",
    type: "success"
  });
});

module.exports = router;