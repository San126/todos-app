const { Schema, model } = require("mongoose");

const loginSchema = new Schema({
  userName: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false }
});

const projectSchema = new Schema({
  projectId: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  listOfTodos: {
    taskIds: { type: Array }
  },
  createdAt: { type: Date, required: true },
  createdBy: { type: String, required: true }
});

const todoSchema = new Schema({
  taskId: { type: Number, required: true, unique: true },
  status: { type: String, required: true },
  description: { type: String, required: true },
  updatedAt: { type: Date, required: true },
  createdAt: { type: Date, required: true },
  createdBy: { type: String, required: true }
});

const ProjectModel = model('Project', projectSchema);
const TodoModel = model('Todo', todoSchema);
const LoginModel = model('Login', loginSchema);

module.exports = {
  ProjectModel,
  TodoModel,
  LoginModel
}