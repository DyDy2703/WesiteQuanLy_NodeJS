import Issue from "../models/issue.model.js";

class IssueRepository {
  async create(data) {
    return await Issue.create(data);
  }

  async findAll() {
    return await Issue.find()
      .populate("status_id priority_id type_id project_id reporter_id assignee_id");
  }

  async findByTimeFilter(timeKey) {
    const now = new Date();
    let q = {};

    if (!timeKey) return this.findAll();

    const key = String(timeKey).toLowerCase();
    if (key === "overdue") {
      q.due_at = { $lt: now, $ne: null };
    } else if (key === "today") {
      const s = new Date(); s.setHours(0,0,0,0);
      const e = new Date(); e.setHours(23,59,59,999);
      q.due_at = { $gte: s, $lte: e };
    } else if (key === "this_week") {
      const now2 = new Date();
      const day = now2.getDay();
      const diffToMonday = (day + 6) % 7; // Monday as start
      const start = new Date(now2); start.setDate(now2.getDate() - diffToMonday); start.setHours(0,0,0,0);
      const end = new Date(start); end.setDate(start.getDate() + 6); end.setHours(23,59,59,999);
      q.due_at = { $gte: start, $lte: end };
    } else if (key === "upcoming") {
      q.due_at = { $gt: now };
    } else {
      // unknown key -> return all
      return this.findAll();
    }

    return await Issue.find(q).sort({ due_at: 1 })
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