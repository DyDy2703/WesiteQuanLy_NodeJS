import PriorityType from "../../models/priorityType.model.js";

class PriorityTypeRepository {

  async create(data) {
    return await PriorityType.create(data);
  }

  async findAll() {
    return await PriorityType.find();
  }

  async findById(id) {
    return await PriorityType.findById(id);
  }

  async findByName(name) {
    return await PriorityType.findOne({ name });
  }

  async update(id, data) {
    return await PriorityType.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
  }

  async delete(id) {
    return await PriorityType.findByIdAndDelete(id);
  }
}

export default new PriorityTypeRepository();