import Comment from "../models/comment.model.js";

class CommentRepository {
  async create(data) {
    return await Comment.create(data);
  }

  async findAll() {
    return await Comment.find().populate("issue_id user_id");
  }

  async findById(id) {
    return await Comment.findById(id).populate("issue_id user_id");
  }

  async update(id, data) {
    return await Comment.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
  }

  async delete(id) {
    return await Comment.findByIdAndDelete(id);
  }
}

export default new CommentRepository();