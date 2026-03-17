import express from "express";
import userController from "../controllers/user.controller.js";

const usersRoutes = express.Router();
usersRoutes.post("/login", userController.loginUser);

usersRoutes.post("/", userController.createUser);
usersRoutes.get("/", userController.getAllUsers);
usersRoutes.get("/:id", userController.getUserById);
usersRoutes.put("/:id", userController.updateUser);
usersRoutes.delete("/:id", userController.deleteUser);

export default usersRoutes;
