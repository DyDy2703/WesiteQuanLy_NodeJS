import IssueType from "../models/issueType.model.js";

class IssueTypeRepository {
  async create(data) {
    return await IssueType.create(data);
  }

  async findAll() {
    return await IssueType.find();
  }

  async findById(id) {
    return await IssueType.findById(id);
  }

  async findByName(name) {
    return await IssueType.findOne({ name });
  }

  async update(id, data) {
    return await IssueType.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
  }

  async delete(id) {
    return await IssueType.findByIdAndDelete(id);
  }
}

export default new IssueTypeRepository();