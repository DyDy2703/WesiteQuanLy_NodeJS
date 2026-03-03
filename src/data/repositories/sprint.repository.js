import Sprint from "../models/sprint.model.js";

class SprintRepository {
  async create(data) {
    return await Sprint.create(data);
  }

  async findAll() {
    return await Sprint.find().populate("project_id");
  }

  async findById(id) {
    return await Sprint.findById(id).populate("project_id");
  }

  async update(id, data) {
    return await Sprint.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await Sprint.findByIdAndDelete(id);
  }
}

export default new SprintRepository();