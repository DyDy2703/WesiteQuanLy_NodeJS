import Project from "../models/project.model.js";

class ProjectRepository {
  async create(data) {
    return await Project.create(data);
  }

  async findAll() {
    return await Project.find().populate("lead_id");
  }

  async findById(id) {
    return await Project.findById(id).populate("lead_id");
  }

  async findByKey(key) {
    return await Project.findOne({ key });
  }

  async update(id, data) {
    return await Project.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await Project.findByIdAndDelete(id);
  }
}

export default new ProjectRepository();