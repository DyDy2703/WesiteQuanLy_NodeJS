import User from "../models/user.model.js";

class UserRepository {
  async create(data) {
    return await User.create(data);
  }

  async findAll() {
    return await User.find().select("-password");
  }

  async findById(id) {
    return await User.findById(id).select("-password");
  }

  async findByUsernameOrEmail(username, email) {
    return await User.findOne({
      $or: [{ username }, { email }],
    });
  }

  async update(id, data) {
    return await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).select("-password");
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }
}

export default new UserRepository();