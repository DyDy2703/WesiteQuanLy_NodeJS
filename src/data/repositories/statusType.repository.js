import StatusType from "../models/statusType.model.js";

class StatusTypeRepository {

  async create(data) {
    return await StatusType.create(data);
  }

  async findAll() {
    return await StatusType.find();
  }

  async findById(id) {
    return await StatusType.findById(id);
  }

  async findByName(name) {
    return await StatusType.findOne({ name });
  }

  async update(id, data) {
    return await StatusType.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
  }

  async delete(id) {
    return await StatusType.findByIdAndDelete(id);
  }
}

export default new StatusTypeRepository();