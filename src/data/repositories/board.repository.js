import Board from "../models/board.model.js";

class BoardRepository {
  async create(data) {
    return await Board.create(data);
  }

  async findAll() {
    return await Board.find().populate("user_id");
  }

  async findById(id) {
    return await Board.findById(id).populate("user_id");
  }

  async findByName(name) {
    return await Board.findOne({ name });
  }

  async update(id, data) {
    return await Board.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await Board.findByIdAndDelete(id);
  }
}

export default new BoardRepository();