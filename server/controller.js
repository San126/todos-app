const express = require('express');
const ObjectId = require('mongodb').ObjectId;
const { snakeCase, isEmpty } = require('lodash');
const { hash, compare } = require('bcryptjs');

const router = express.Router();

const { LoginModel, ProjectModel, TodoModel } = require('../models/Models');
const getNextSequenceValue = require('../utils/autoIncrement');

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
    const createdBy = req.query.userName;
    if (req.query) {
      const projectList = await ProjectModel.find({ createdBy });
      console.log(projectList)
      return res.status(201).json(projectList);
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

router.post('/create', async (req, res) => {
  try {
    const { createdBy, title } = req.body;
    const createdAt = new Date();
    const projectDetails = await ProjectModel.findOne({ title });
    if (projectDetails) {
      return res.status(500).json({
        message: "Project name already exists",
        type: 'warning'
      });
    }

    const projectId = await getNextSequenceValue('projects');

    const newProject = new ProjectModel({
      projectId,
      createdAt,
      createdBy,
      title
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/details', async (req, res) => {
  try {
    const projectId = req.query.projectId;
    const projectIdAsObjectId = new ObjectId(projectId);

    if (projectIdAsObjectId) {
      const projectDetails = await ProjectModel.findOne({ _id: projectIdAsObjectId });
      const todoIds = projectDetails?.listOfTodos?.taskIds || [];
      const todoListDetails = todoIds && await getTodoList(todoIds) || {};
      const data = { ...projectDetails, todoListDetails }
      res.status(201).json(data);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const getTodoList = async (todoIds) => {
  try {
    const todoList = await TodoModel.find({ taskId: { $in: [...todoIds] } });
    return todoList;
  } catch (error) {
    console.error(error);
    return ({ error: 'Internal Server Error' });
  }
}

router.post('/createtask', async (req, res) => {
  try {
    const { projectId = '', description = '', statusValue = '', createdBy = '', taskId: todoId = '' } = req.body;
    const projectIdAsObjectId = new ObjectId(projectId);
    let todoTasks = [];
    const updatedAt = new Date();

    if (projectIdAsObjectId) {
      let taskId = '';
      let projectDetails = await ProjectModel.findOne({ _id: projectIdAsObjectId });
      if (!isEmpty(projectDetails?.listOfTodos?.taskIds)) {
        todoTasks = projectDetails.listOfTodos.taskIds || [];
      }
      const details = await TodoModel.findOne({ taskId: todoId });
      const toDoDetails = details && details.toJSON();

      if (isEmpty(toDoDetails)) {
        taskId = await getNextSequenceValue('todos');
      }

      const taskIdsArray = projectDetails?.listOfTodos?.taskIds ?? [];
      taskIdsArray.push(taskId);
      projectDetails.listOfTodos.taskIds = taskIdsArray;

      const updatedData = {
        ...toDoDetails,
        updatedAt,
        createdBy,
        status: statusValue,
        description
      };

      updatedData.taskId = toDoDetails?.taskId || taskId;
      updatedData.createdAt = updatedAt;

      const options = {
        new: true, // Return the updated document
        upsert: true, // Insert if not exists, update if exists
        setDefaultsOnInsert: true // Set default values when inserting new document
      };

      const projectUpdate = new ProjectModel(projectDetails);
      const newTodo = await TodoModel.findOneAndUpdate(
        { taskId: todoId },
        updatedData,
        options
      );

      await projectUpdate.save();

      res.status(201).json({ message: "Task Updated Successfully", data: { newTodo, projectUpdate } });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/delete', async (req, res) => {
  try {
    const taskId = req.query.taskId;

    const deletedTask = await TodoModel.findOneAndDelete({ taskId });

    res.status(201).json({ message: `Task ${deletedTask} Deleted Successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/logout', async (req, res) => {
  return res.json({
    message: "Logged out successfully",
    type: "success"
  });
});

module.exports = router;