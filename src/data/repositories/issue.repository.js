import Issue from "../models/issue.model.js";

class IssueRepository {
  async create(data) {
    return await Issue.create(data);
  }

  async findAll() {
    return await Issue.find()
      .populate("status_id priority_id type_id project_id reporter_id assignee_id");
  }

  async findById(id) {
    return await Issue.findById(id)
      .populate("status_id priority_id type_id project_id reporter_id assignee_id");
  }

  async findByIssueKey(issue_key) {
    return await Issue.findOne({ issue_key });
  }

  async update(id, data) {
    return await Issue.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await Issue.findByIdAndDelete(id);
  }
}

export default new IssueRepository();