import User from "../../data/models/user.model.js";

class UserController {
  async createUser(req, res, next) {
    try {
      const user = await User.create(req.body);
  
      res.status(201).json({
        success: true,
        data: user,
        message: "Đăng ký thành công",
      });
    } catch (error) {
      if (error?.code === 11000) {
        const duplicateField = Object.keys(error.keyPattern || {})[0];
  
        let message = "Dữ liệu đã tồn tại";
  
        if (duplicateField === "email") {
          message = "Email này đã được sử dụng";
        } else if (duplicateField === "username") {
          message = "Tài khoản này đã tồn tại";
        }
  
        return res.status(400).json({
          success: false,
          message,
        });
      }
  
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await User.find();
      res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await User.findById(req.params.id);
      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      await User.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async loginUser(req, res, next) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập đầy đủ username và password",
        });
      }

      const user = await User.findOne({ username });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Tài khoản không tồn tại",
        });
      }

      if (user.password !== password) {
        return res.status(401).json({
          success: false,
          message: "Sai mật khẩu",
        });
      }

      return res.json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          display_name: user.display_name,
          email: user.email,
          role: user.role,
        },
        token: "demo-token",
        message: "Đăng nhập thành công",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();