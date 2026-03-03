import userService from "../../business/services/user.service.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";

class UserController {
  createUser = asyncHandler(async (req, res) => {
    const result = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: result });
  });

  getAllUsers = asyncHandler(async (req, res) => {
    const result = await userService.getAllUsers();
    res.json({ success: true, data: result });
  });

  getUserById = asyncHandler(async (req, res) => {
    const result = await userService.getUserById(req.params.id);
    res.json({ success: true, data: result });
  });

  updateUser = asyncHandler(async (req, res) => {
    const result = await userService.updateUser(
      req.params.id,
      req.body
    );
    res.json({ success: true, data: result });
  });

  deleteUser = asyncHandler(async (req, res) => {
    const result = await userService.deleteUser(req.params.id);
    res.json({ success: true, data: result });
  });
}

export default new UserController();