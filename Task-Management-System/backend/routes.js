const express = require("express");
const route = express.Router();

const userController = require("./controller/user");
const authController = require("./controller/auth");
const taskController = require("./controller/task");
const verifyToken = require("./middleware/auth.middleware");

// API - Users

route.get("/api/users", userController.getUsers);

route.get("/api/users/:id", userController.getUserById);

route.put("/api/users/:id", userController.updateUser);

route.delete("/api/users/:id", userController.deleteUser);


// API - Authentication

route.get("/api/auth/user",verifyToken, authController.getUserByToken);

route.post("/api/auth/register", authController.register);

route.post("/api/auth/login", authController.login);

route.delete("/api/auth/logout",verifyToken, authController.logout);

route.post("/api/auth/confirmRegistration", authController.confirmRegister);

route.post("/api/auth/refreshAccessToken", authController.refreshAccessToken);

// API - Task

route.get("/api/tasks", taskController.getTasks);

route.get("/api/tasks/user/:id", taskController.getTasksByUser);

route.get("/api/tasks/:id", taskController.getTasksByTaskId);

route.post("/api/tasks/addTask", taskController.createTask);

route.put("/api/tasks/:id", taskController.updateTask);

route.delete("/api/tasks/:id", taskController.deleteTask);

module.exports = route;
